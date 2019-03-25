// (C) 2007-2018 GoodData Corporation
import partial = require('lodash/partial');
import merge = require('lodash/merge');
import includes = require('lodash/includes');
import isNil = require('lodash/isNil');
import set = require('lodash/set');
import { IChartConfig } from '../../../../interfaces/Config';
import { IAxis, IChartOptions, supportedStackingAttributesChartTypes } from '../chartOptionsBuilder';
import { formatAsPercent } from './customConfiguration';
import { isBarChart, isColumnChart } from '../../utils/common';

export const NORMAL_STACK = 'normal';
export const PERCENT_STACK = 'percent';

function handleStackMeasure(stackMeasures: boolean, item: any) {
    return stackMeasures ? {
        ...item,
        stacking: NORMAL_STACK,
        stack: item.yAxis
    } : item;
}

function handleStackMeasuresToPercent(stackMeasuresToPercent: boolean, item: any) {
    return stackMeasuresToPercent ? {
        ...item,
        stacking: PERCENT_STACK,
        stack: item.yAxis
    } : item;
}

function handleDualAxis(isDualAxis: boolean, item: any) {
    if (!isDualAxis) {
        return item;
    }

    const { stacking, yAxis } = item;
    const isFirstAxis = yAxis === 0;

    // highcharts stack config
    // percent stack is only applied to primary Y axis
    const hcStackingConfig = stacking ? { stacking: isFirstAxis ? stacking : NORMAL_STACK } : {};

    return {
        ...item,
        ...hcStackingConfig
    };
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

    return {
        series: series.map((item: any) => (handlers.reduce((result, handler) => handler(result), item)))
    };
}

function getYAxisConfiguration(
    config: any,
    type: string,
    stackMeasuresToPercent: boolean
) {
    const { yAxis } = config;
    // only support column char and bar chart disables stack labels by default
    if (!isColumnChart(type)) {
        return {};
    }

    if (stackMeasuresToPercent) {
        // hide stack labels in primary axis
        // leave stack labels in secondary axis to default flow
        set(yAxis[0], 'stackLabels.enabled', false);
    }

    return {
        yAxis: yAxis.map((axis: any) => ({
            ...axis,
            stackLabels: {
                enabled: true, // enabled by default (fallback value in case dataLabels.visible is undefined)
                ...axis.stackLabels // follow dataLabels.visible config
            }
        }))
    };
}

/**
 * Set config to highchart for 'Stack Measures' and 'Stack to 100%'
 * @param chartOptions
 * @param config
 * @param chartConfig
 */
export function getStackMeasuresConfiguration(chartOptions: any, config: any, chartConfig: IChartConfig) {
    const { stackMeasures = false, stackMeasuresToPercent = false } = chartConfig;

    if ((!stackMeasures && !stackMeasuresToPercent)) {
        return {};
    }

    const { yAxes, type } = chartOptions;
    const isDualAxis = yAxes.length === 2;

    return {
        stackMeasuresToPercent, // put prop to 'highChart.userOptions' and use in 'dualAxesLabelFormatter.ts'
        ...getSeriesConfiguration(config, stackMeasures, stackMeasuresToPercent, isDualAxis),
        ...getYAxisConfiguration(config, type, stackMeasuresToPercent)
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
 * @param chartOptions
 * @param _config
 * @param chartConfig
 */
export function getShowInPercentConfiguration(chartOptions: IChartOptions, _config: any, chartConfig: IChartConfig) {
    const { stackMeasuresToPercent = false } = chartConfig;
    if (!stackMeasuresToPercent) {
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
