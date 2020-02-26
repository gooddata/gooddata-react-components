// (C) 2020 GoodData Corporation
import * as React from "react";
import StaticLegend from "../../../visualizations/chart/legend/StaticLegend";
import { IPushpinCategoryLegendItem } from "../../../../interfaces/GeoChart";

export interface IPushpinCategoryLegendProps {
    categoryItems: IPushpinCategoryLegendItem[];
    position: string;
    onItemClick(item: IPushpinCategoryLegendItem): void;
}

export default function PushpinCategoryLegend(props: IPushpinCategoryLegendProps): JSX.Element {
    const { position, categoryItems, onItemClick } = props;
    const classNames = `viz-static-legend-wrap s-geo-category-legend position-${position}`;
    const DEFAULT_HEIGHT = 0;
    const legendProps = {
        series: [...categoryItems],
        onItemClick,
        position,
    };
    return (
        <div className={classNames}>
            <StaticLegend {...legendProps} containerHeight={DEFAULT_HEIGHT} />
        </div>
    );
}
