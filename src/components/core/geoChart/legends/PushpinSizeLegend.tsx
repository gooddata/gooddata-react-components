// (C) 2020 GoodData Corporation
import * as React from "react";
import { formatLegendLabel } from "../../../../components/visualizations/utils/common";
import { calculateAverage } from "../../../../helpers/geoChart";

export interface IPushpinSizeLegendProps {
    format: string;
    numericSymbols: string[];
    sizes: number[];
}

export default function PushpinSizeLegend(props: IPushpinSizeLegendProps): JSX.Element {
    const { sizes, format, numericSymbols = [] } = props;
    const minValue: number = Math.min(...sizes);
    const maxValue: number = Math.max(...sizes);
    if (minValue === maxValue) {
        return null;
    }
    const averageValue: number = calculateAverage(sizes);
    const diff: number = maxValue - minValue;
    return (
        <div className="pushpin-size-legend s-pushpin-size-legend">
            <div className="pushpin-size-legend-circle-list">
                <div className="pushpin-size-legend-circle circle-max-value">
                    <div className="pushpin-size-legend-circle circle-average-value">
                        <div className="pushpin-size-legend-circle circle-min-value" />
                    </div>
                </div>
            </div>
            <div className="labels">
                <span>{formatLegendLabel(maxValue, format, diff, numericSymbols)}</span>
                <span>{formatLegendLabel(averageValue, format, diff, numericSymbols)}</span>
                <span>{formatLegendLabel(minValue, format, diff, numericSymbols)}</span>
            </div>
        </div>
    );
}
