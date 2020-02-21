// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { IHeatmapLegendItem, IColorLegendItem } from "../../typings/legend";
import { ColorLegend } from "./ColorLegend";

export interface IHeatmapLegendProps {
    series: IHeatmapLegendItem[];
    isSmall: boolean;
    format?: string;
    numericSymbols: string[];
    position: string;
}

export default class HeatmapLegend extends React.PureComponent<IHeatmapLegendProps> {
    public render() {
        const { series, format, numericSymbols, isSmall, position } = this.props;
        const data = series.map(
            (item: IHeatmapLegendItem): IColorLegendItem => {
                const { range, color } = item;
                return { range, color };
            },
        );

        return (
            <ColorLegend
                data={data}
                format={format}
                isSmall={isSmall}
                numericSymbols={numericSymbols}
                position={position}
            />
        );
    }
}
