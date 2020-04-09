// (C) 2020 GoodData Corporation
import * as React from "react";
import { ContentRect } from "react-measure";

import FluidLegend from "../../../visualizations/chart/legend/FluidLegend";
import StaticLegend from "../../../visualizations/chart/legend/StaticLegend";
import { LEFT, RIGHT } from "../../../visualizations/chart/legend/PositionTypes";
import { ChartType } from "../../../../constants/visualizationTypes";
import { isFluidLegendEnabled } from "../../../../helpers/geoChart/common";
import { IPushpinCategoryLegendItem } from "../../../../interfaces/GeoChart";

export const HEIGHT_OF_SIZE_LEGEND = 161;
const PUSHPIN_TYPE: ChartType = "pushpin";

export interface IPushpinCategoryLegendProps {
    categoryItems?: IPushpinCategoryLegendItem[];
    chartType?: ChartType;
    contentRect: ContentRect;
    format?: string;
    hasSizeLegend: boolean;
    height?: number;
    locale?: string;
    position?: string;
    responsive?: boolean;
    showFluidLegend?: boolean;
    onItemClick?(item: IPushpinCategoryLegendItem): void;
}

export default function PushpinCategoryLegend(props: IPushpinCategoryLegendProps): JSX.Element {
    const { contentRect, hasSizeLegend, responsive, showFluidLegend } = props;
    const isFluidLegend = isFluidLegendEnabled(responsive, showFluidLegend);

    return (
        <div className="s-geo-category-legend">
            {isFluidLegend
                ? renderFluidCategoryLegend(props, contentRect)
                : renderStaticCategoryLegend(props, contentRect, hasSizeLegend)}
        </div>
    );
}

function renderFluidCategoryLegend(
    props: IPushpinCategoryLegendProps,
    contentRect: ContentRect,
): JSX.Element {
    const { categoryItems, chartType = PUSHPIN_TYPE, onItemClick } = props;

    const legendProps = {
        chartType,
        series: categoryItems,
        onItemClick,
    };

    const { client: contentRectClient } = contentRect;
    const usedWidth = contentRectClient && contentRectClient.width ? Math.floor(contentRectClient.width) : 0;

    return <FluidLegend {...legendProps} containerWidth={usedWidth} />;
}

function renderStaticCategoryLegend(
    props: IPushpinCategoryLegendProps,
    contentRect: ContentRect,
    hasSizeLegend: boolean,
): JSX.Element {
    const {
        categoryItems,
        chartType = PUSHPIN_TYPE,
        position,
        height,
        format,
        locale,
        onItemClick,
        responsive,
    } = props;

    // For Geo Pushpin with position left/right
    // we set the height of series to number of actual displayed items
    // so that, size legend will be visible
    const shouldFillAvailableSpace = position !== LEFT && position !== RIGHT;

    const legendProps = {
        chartType,
        format,
        locale,
        position,
        responsive,
        series: categoryItems,
        shouldFillAvailableSpace,
        onItemClick,
    };

    const { client: contentRectClient } = contentRect;
    const hasSizeAndLeftRightPosition = hasSizeLegend && (position === LEFT || position === RIGHT);
    const measuredHeight =
        contentRectClient && contentRectClient.height ? Math.floor(contentRectClient.height) : 0;
    const usedHeight = (height || measuredHeight) - (hasSizeAndLeftRightPosition ? HEIGHT_OF_SIZE_LEGEND : 0);

    return <StaticLegend {...legendProps} containerHeight={usedHeight} />;
}
