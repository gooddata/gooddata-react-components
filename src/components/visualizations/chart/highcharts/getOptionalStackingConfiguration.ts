// (C) 2007-2018 GoodData Corporation
import partial = require('lodash/partial');
import merge = require('lodash/merge');
import includes = require('lodash/includes');
import isNil = require('lodash/isNil');
import set = require('lodash/set');
import get = require('lodash/get');
import { IChartConfig, IDataLabelsVisible } from '../../../../interfaces/Config';
import {
    IAxis,
    ISeriesItem,
    IChartOptions,
    isNegativeValueIncluded,
    supportedStackingAttributesChartTypes
} from '../chartOptionsBuilder';
import { formatAsPercent, getLabelsVisibilityConfig } from './customConfiguration';
import { isBarChart, isColumnChart } from '../../utils/common';

export const NORMAL_STACK = 'normal';
export const PERCENT_STACK = 'percent';

/**
 * Set 'normal' stacking config to single series which will overwrite config in 'plotOptions.series'
 * @param stackMeasures
 * @param seriesItem
 */
function handleStackMeasure(stackMeasures: boolean, seriesItem: any) {
    return stackMeasures ? {
        ...seriesItem,
        stacking: NORMAL_STACK,
        stack: seriesItem.yAxis
    } : seriesItem;
}

/**
 * Set 'percent' stacking config to single series which will overwrite config in 'plotOptions.series'
 * @param stackMeasuresToPercent
 * @param seriesItem
 */
function handleStackMeasuresToPercent(stackMeasuresToPercent: boolean, seriesItem: any) {
    return stackMeasuresToPercent ? {
        ...seriesItem,
        stacking: PERCENT_STACK,
        stack: seriesItem.yAxis
    } : seriesItem;
}

function handleDualAxis(isDualAxis: boolean, seriesItem: any) {
    if (!isDualAxis) {
        return seriesItem;
    }

    const { stacking, yAxis } = seriesItem;
    const isFirstAxis = yAxis === 0;

    // highcharts stack config
    // percent stack is only applied to primary Y axis
    const hcStackingConfig = stacking ? { stacking: isFirstAxis ? stacking : NORMAL_STACK } : {};

    return {
        ...seriesItem,
        ...hcStackingConfig
    };
}

function countMeasuresInSeries(series: any): number[] {
    return series.reduce((result: number[], seriesItem: any) => {
        result[seriesItem.yAxis] += 1;
        return result;
    }, [0, 0]);
}

/**
 * For y axis having one series, this series should be removed stacking config
 * @param series
 */
function getSanitizedStackingSeries(series: any) {
    const [primaryMeasuresNum, secondaryMeasuresNum] = countMeasuresInSeries(series);

    if (primaryMeasuresNum <= 1 && secondaryMeasuresNum <= 1) {
        return series.map((seriesItem: any) => ({
            ...seriesItem,
            stack: null,
            stacking: null
        }));
    }
    return series;
}

function getSeriesConfiguration(
    config: any,
    stackMeasures: boolean,
    stackMeasuresToPercent: boolean,
    isDualAxis: boolean
) {
    const { series } = config;

    const handlers = [
        partial(handleStackMeasure, stackMeasures),
        partial(handleStackMeasuresToPercent, stackMeasuresToPercent),
        partial(handleDualAxis, isDualAxis)
    ];

    // get series with stacking config
    const seriesWithStackingConfig = series.map((seriesItem: any) => (
        handlers.reduce((result, handler) => handler(result), seriesItem))
    );

    return {
        series: getSanitizedStackingSeries(seriesWithStackingConfig)
    };
}

function hasNegativeValues(series: ISeriesItem[] = [], index: number) {
    const matchedSeries = series.filter((seriesItem: ISeriesItem) => seriesItem.yAxis === index);
    return isNegativeValueIncluded(matchedSeries);
}

export function getYAxisConfiguration(
    chartOptions: IChartOptions,
    config: any,
    chartConfig: IChartConfig
) {
    const { type } = chartOptions;
    const { yAxis, series } = config;
    const { stackMeasuresToPercent = false } = chartConfig;

    // only support column char
    // bar chart disables stack labels by default
    if (!isColumnChart(type)) {
        return {};
    }

    const labelsVisible: IDataLabelsVisible = get<IDataLabelsVisible>(chartConfig, 'dataLabels.visible');
    const { enabled: dataLabelEnabled } = getLabelsVisibilityConfig(labelsVisible);

    const yAxisWithStackLabel = yAxis.map((axis: any, index: number) => {
        let stackLabelEnabled = isNil(dataLabelEnabled)
            ? true // enable by default
            : dataLabelEnabled; // follow dataLabels.visible config

        if (stackMeasuresToPercent && index === 0 && hasNegativeValues(series, index)) {
            // disable stack labels to primary Y axis when having negative values and 'Stack to 100%' on
            stackLabelEnabled = false;
        }

        return {
            ...axis,
            stackLabels: {
                enabled: stackLabelEnabled
            }
        };
    });

    return { yAxis: yAxisWithStackLabel };
}

/**
 * Set config to highchart for 'Stack Measures' and 'Stack to 100%'
 * @param chartOptions
 * @param config
 * @param chartConfig
 */
export function getStackMeasuresConfiguration(chartOptions: IChartOptions, config: any, chartConfig: IChartConfig) {
    const { stackMeasures = false, stackMeasuresToPercent = false } = chartConfig;

    if ((!stackMeasures && !stackMeasuresToPercent)) {
        return {};
    }

    const { yAxes } = chartOptions;
    const isDualAxis = yAxes.length === 2;

    return {
        stackMeasuresToPercent, // this prop is used in 'dualAxesLabelFormatter.ts'
        ...getSeriesConfiguration(config, stackMeasures, stackMeasuresToPercent, isDualAxis),
        ...getYAxisConfiguration(chartOptions, config, chartConfig)
    };
}

/**
 * Add style to X axis in case of 'grouped-categories'
 * @param chartOptions
 * @param config
 */
export function getParentAttributeConfiguration(chartOptions: IChartOptions, config: any) {
    const { type } = chartOptions;
    const { xAxis } = config;
    const xAxisItem = xAxis[0]; // expect only one X axis

    // parent attribute in X axis
    const parentAttributeOptions = {};

    // only apply font-weight to parent label
    set(parentAttributeOptions, 'style', {
        fontWeight: 'bold'
    });

    if (isBarChart(type)) {
        // distance more 5px for two groups of attributes for bar chart
        set(parentAttributeOptions, 'x', -5);
    }

    // 'groupedOptions' is custom property in 'grouped-categories' plugin
    set(xAxisItem, 'labels.groupedOptions', [parentAttributeOptions]);

    return { xAxis: [xAxisItem] };
}

/**
 * Format labels in Y axis from '0 - 100' to '0% - 100%'
 * Only applied when measure/series in Y axis more than one
 * @param chartOptions
 * @param _config
 * @param chartConfig
 */
export function getShowInPercentConfiguration(chartOptions: IChartOptions, _config: any, chartConfig: IChartConfig) {
    const { stackMeasuresToPercent = false } = chartConfig;
    const series = get(chartOptions, 'data.series', []);
    const [primaryMeasuresNum] = countMeasuresInSeries(series);
    if (!stackMeasuresToPercent || primaryMeasuresNum <= 1) {
        return {};
    }

    const { yAxes = [] } = chartOptions;
    const percentageFormatter = partial(formatAsPercent, 1);

    // suppose that max number of y axes is 2
    // percentage format only supports primary axis
    const yAxis = yAxes.map((_axis: any, index: number) => {
        return index === 0 ? {
            labels: {
                formatter: percentageFormatter
            }
        } : {};
    });
    return { yAxis };
}

/**
 * Convert [0, 1] to [0, 100], it's needed by highchart
 * Only applied to primary Y axis
 * @param _chartOptions
 * @param config
 * @param chartConfig
 */
export function convertMinMaxFromPercentToNumber(_chartOptions: IChartOptions, config: any, chartConfig: IChartConfig) {
    const { stackMeasuresToPercent = false } = chartConfig;
    if (!stackMeasuresToPercent) {
        return {};
    }

    const { yAxis: yAxes = [] as any[] } = config;
    const yAxis = yAxes.map((axis: any, _: number, axes: IAxis[]) => {
        const { min, max } = axis;
        const newAxis = {};

        if (!isNil(min)) {
            set(newAxis, 'min', min * 100);
        }

        if (!isNil(max)) {
            set(newAxis, 'max', max * 100);
        }

        const numberOfAxes = axes.length;
        if (numberOfAxes === 1) {
            return newAxis;
        }

        const { opposite = false } = axis;
        return opposite ? {} : newAxis;
    });

    return { yAxis };
}

export default function getOptionalStackingConfiguration(
    chartOptions: IChartOptions,
    config: any,
    chartConfig: IChartConfig = {}
) {
    const { type } = chartOptions;
    return includes(supportedStackingAttributesChartTypes, type) ? merge(
    {},
        getParentAttributeConfiguration(chartOptions, config),
        getStackMeasuresConfiguration(chartOptions, config, chartConfig),
        getShowInPercentConfiguration(chartOptions, config, chartConfig),
        convertMinMaxFromPercentToNumber(chartOptions, config, chartConfig)
    ) : {};
}
