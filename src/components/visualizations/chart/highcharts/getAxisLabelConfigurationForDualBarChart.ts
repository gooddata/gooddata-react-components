// (C) 2019 GoodData Corporation
import { IAxisConfig, IChartOptions } from "../../../../interfaces/Config";
import { isBarChart } from "../../utils/common";
import {
    ALIGN_LEFT,
    ALIGN_RIGHT,
    BOTTOM_AXIS_MARGIN,
    ROTATE_90_DEGREES,
} from "../../../../constants/axisLabel";

export function getAxisLabelConfigurationForDualBarChart(chartOptions: IChartOptions) {
    const { type, yAxes = [] } = chartOptions;
    const isBar: boolean = isBarChart(type);
    const isDualAxis: boolean = yAxes.length === 2;
    const isDualAxisBarChart: boolean = isBar && isDualAxis;

    if (!isDualAxisBarChart) {
        return {};
    }

    const { yAxisProps, secondary_yAxisProps } = chartOptions;
    const yAxesConfig: Highcharts.XAxisOptions[] = [yAxisProps, secondary_yAxisProps].map(
        (axis: IAxisConfig = {}, index: number): Highcharts.XAxisOptions => {
            const { rotation } = axis;
            const isOppositeAxis: boolean = index === 1;

            if (rotation === ROTATE_90_DEGREES) {
                const align: Highcharts.AlignValue = isOppositeAxis ? ALIGN_LEFT : ALIGN_RIGHT;
                return {
                    labels: {
                        align,
                        y: isOppositeAxis ? undefined : BOTTOM_AXIS_MARGIN,
                    },
                };
            }
            return undefined;
        },
    );

    return {
        yAxis: yAxesConfig, // yAxis in UI SDK is xaxis in Highcharts for bar chart
    };
}
