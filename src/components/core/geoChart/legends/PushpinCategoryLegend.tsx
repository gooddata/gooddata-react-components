// (C) 2020 GoodData Corporation
import * as React from "react";
import StaticLegend from "../../../visualizations/chart/legend/StaticLegend";
import { IPushpinCategoryLegendItem } from "../../../../interfaces/GeoChart";

export interface IPushpinCategoryLegendProps {
    segmentData: IPushpinCategoryLegendItem[];
    position: string;
    onItemClick(item: IPushpinCategoryLegendItem): void;
}

export default function PushpinCategoryLegend(props: IPushpinCategoryLegendProps): JSX.Element {
    const { position, segmentData, onItemClick } = props;
    const classNames = `viz-static-legend-wrap s-geo-category-legend position-${position}`;
    const DEFAULT_HEIGHT = 0;
    const legendProps = {
        series: [...segmentData],
        onItemClick,
        position,
    };
    return (
        <div className={classNames}>
            <StaticLegend {...legendProps} containerHeight={DEFAULT_HEIGHT} />
        </div>
    );
}
