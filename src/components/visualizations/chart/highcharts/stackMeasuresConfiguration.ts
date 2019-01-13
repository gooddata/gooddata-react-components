import partial = require('lodash/partial');
import { IChartConfig } from '../../../../interfaces/Config';

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

export default function stackMeasuresConfiguration(chartOptions: any, config: any, chartConfig: IChartConfig = {}) {
    const { stackMeasures = false, stackMeasuresToPercent = false} = chartConfig;
    if (!stackMeasures && !stackMeasuresToPercent) {
        return {};
    }

    const { yAxes } = chartOptions;
    const isDualAxes = yAxes.length === 2;
    const { series } = config;

    const handlers: Function[] = [
        partial(handleStackMeasure, stackMeasures),
        partial(handleStackMeasuresToPercent, stackMeasuresToPercent),
        partial(handleDualAxes, isDualAxes)
    ];

    return {
        series: series.map((item: any) => (handlers.reduce((result: any, handler: Function) => handler(result), item)))
    };
}
