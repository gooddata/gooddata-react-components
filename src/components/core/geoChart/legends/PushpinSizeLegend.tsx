// (C) 2020 GoodData Corporation
import * as React from "react";
import { formatLegendLabel } from "../../../../components/visualizations/utils/common";
import { calculateAverage } from "../../../../helpers/geoChart/common";

export interface IPushpinSizeLegendProps {
    format: string;
    numericSymbols: string[];
    sizes: number[];
    measureName: string;
}

export default function PushpinSizeLegend(props: IPushpinSizeLegendProps): JSX.Element {
    const { sizes = [], format, numericSymbols = [], measureName } = props;
    const sizeData = sizes.filter(isFinite);

    if (!sizeData.length) {
        return null;
    }

    const min = Math.min(...sizeData);
    const max = Math.max(...sizeData);

    if (min === max) {
        return null;
    }

    const averageValue: number = calculateAverage(sizeData);
    const diff: number = max - min;

    return (
        <div className="pushpin-size-legend s-pushpin-size-legend">
            <div className="metric-name" title={measureName}>
                {measureName}:
            </div>
            <div className="pushpin-size-legend-circle-list">
                <div className="pushpin-size-legend-circle circle-min-value">
                    <span className="circle-min-icon" />
                    <span className="circle-value">
                        {formatLegendLabel(min, format, diff, numericSymbols)}
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
                        {formatLegendLabel(max, format, diff, numericSymbols)}
                    </span>
                </div>
            </div>
        </div>
    );
}
