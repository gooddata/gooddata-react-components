// (C) 2020 GoodData Corporation
import * as React from "react";
import { formatLegendLabel } from "../../../../components/visualizations/utils/common";
import { calculateAverage } from "../../../../helpers/geoChart";

export interface IPushpinSizeLegendProps {
    format: string;
    numericSymbols: string[];
    sizes: number[];
    measureName: string;
}

export default function PushpinSizeLegend(props: IPushpinSizeLegendProps): JSX.Element {
    const { sizes, format, numericSymbols = [], measureName } = props;
    const minValue: number = Math.min(...sizes);
    const maxValue: number = Math.max(...sizes);
    if (minValue === maxValue) {
        return null;
    }
    const averageValue: number = calculateAverage(sizes);
    const diff: number = maxValue - minValue;
    return (
        <div className="pushpin-size-legend s-pushpin-size-legend">
            <div className="metric-name">{measureName}:</div>
            <div className="pushpin-size-legend-circle-list">
                <div className="pushpin-size-legend-circle circle-min-value">
                    <span className="circle-min-icon" />
                    <span className="circle-value">
                        {formatLegendLabel(minValue, format, diff, numericSymbols)}
                    </span>
                </div>
                <div className="pushpin-size-legend-circle">
                    <span className="circle-average-icon" />
                    <span className="circle-value">
                        {formatLegendLabel(averageValue, format, diff, numericSymbols)}
                    </span>
                </div>
                <div className="pushpin-size-legend-circle circle-max-value">
                    <span className="circle-max-icon" />
                    <span className="circle-value">
                        {formatLegendLabel(maxValue, format, diff, numericSymbols)}
                    </span>
                </div>
            </div>
        </div>
    );
}
