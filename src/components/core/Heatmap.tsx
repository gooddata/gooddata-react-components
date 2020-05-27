// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { BaseChart, IChartProps } from "./base/BaseChart";
import { ChartPropTypes, Requireable } from "../../proptypes/Chart";
import { getDefaultHeatmapSort } from "../../helpers/sorts";

export { Requireable };

export class Heatmap extends React.PureComponent<IChartProps, null> {
    public static propTypes = ChartPropTypes;

    public render() {
        const sorts = getDefaultHeatmapSort(this.props.resultSpec);
        const resultSpecWithSorts = {
            ...this.props.resultSpec,
            sorts,
        };
        return <BaseChart type="heatmap" {...this.props} resultSpec={resultSpecWithSorts} />;
    }
}
