import partial = require('lodash/partial');
import includes = require('lodash/includes');
import set = require('lodash/set');
import { IChartConfig } from '../../../../interfaces/Config';
import { VisualizationTypes } from '../../../../constants/visualizationTypes';
import { supportedOptionalStackingChartTypes } from '../chartOptionsBuilder';

const NORMAL_STACK = 'normal';
const PERCENT_STACK = 'percent';

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

function handleDualAxes(isDualAxes: boolean, item: any) {
    if (!isDualAxes) {
        return item;
    }

    const { stacking, yAxis } = item;
    const isFirstAxis = yAxis === 0;

    // highcharts stack config
    const hcStackingConfig = stacking ? { stacking: isFirstAxis ? stacking : NORMAL_STACK } : {};

    return {
        ...item,
        ...hcStackingConfig,
    };
}

function getStackMeasuresConfiguration(chartOptions: any, config: any, chartConfig: IChartConfig = {}) {
    const { stackMeasures = false, stackMeasuresToPercent = false} = chartConfig;
    if (!stackMeasures && !stackMeasuresToPercent) {
        return {};
    }

    const { yAxes } = chartOptions;
    const { series } = config;
    const isDualAxes = yAxes.length === 2;

    const handlers: Function[] = [
        partial(handleStackMeasure, stackMeasures),
        partial(handleStackMeasuresToPercent, stackMeasuresToPercent),
        partial(handleDualAxes, isDualAxes)
    ];

    return {
        series: series.map((item: any) => (handlers.reduce((result: any, handler: Function) => handler(result), item)))
    };
}

function getParentAttributeConfiguration(chartOptions: any, config: any) {

    const { type } = chartOptions;
    const { xAxis } = config;
    const xAxisItem = xAxis[0]; // expect only one X axis

    // parent attribute in X axis
    const parentAttributeOptions = {};

    // only apply font-weight to parent label
    set(parentAttributeOptions, 'style', {
        fontWeight: 'bold'
    });

    if (type === VisualizationTypes.BAR) {
        // distance more 5px for two groups of attributes for bar chart
        set(parentAttributeOptions, 'x', -5);
    }

    set(xAxisItem, 'labels.groupedOptions', [parentAttributeOptions]);

    return {
        xAxis: [xAxisItem]
    };
}

export default function getOptionalStackingConfiguration(chartOptions: any, config: any, chartConfig: IChartConfig) {
    const { type } = chartOptions;

    return includes(supportedOptionalStackingChartTypes, type) ? {
        ...getParentAttributeConfiguration(chartOptions, config),
        ...getStackMeasuresConfiguration(chartOptions, config, chartConfig)
    }: {};
}
