// (C) 2020 GoodData Corporation
import * as React from "react";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";
import cx from "classnames";

import { generateLegendColorData } from "./geoChartColor";
import PushpinCategoryLegend from "./legends/PushpinCategoryLegend";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import { useNumbericSymbols } from "../base/hook/TranslationsHook";
import { ColorLegend } from "../../visualizations/chart/legend/ColorLegend";
import { BOTTOM } from "../../visualizations/chart/legend/PositionTypes";
import { IGeoData, IPushpinCategoryLegendItem } from "../../../interfaces/GeoChart";
import { isFluidLegendEnabled } from "../../../helpers/geoChart/common";
import { getAvailableLegends } from "../../../helpers/geoChart/data";

export interface IGeoChartLegendRendererProps {
    categoryItems?: IPushpinCategoryLegendItem[]; // used for Category legend
    format?: string;
    geoData?: IGeoData; // used for Color/Size legend
    height?: number;
    locale?: string;
    colorLegendValue: string;
    position?: string;
    responsive?: boolean;
    showFluidLegend?: boolean;
    onItemClick?: (item: IPushpinCategoryLegendItem) => void;
}

export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    const { categoryItems, geoData, position, responsive, showFluidLegend } = props;
    const { hasCategoryLegend, hasColorLegend, hasSizeLegend } = getAvailableLegends(categoryItems, geoData);

    const isLegendVisible = hasCategoryLegend || hasColorLegend || hasSizeLegend;
    if (!isLegendVisible) {
        return null;
    }

    const isFluidLegend = isFluidLegendEnabled(responsive, showFluidLegend);
    const isBottomPosition = isFluidLegend || position === BOTTOM;

    const classNames = cx("geo-legend", "s-geo-legend", {
        "viz-fluid-legend-wrap": isFluidLegend,
        "viz-static-legend-wrap": !isFluidLegend,
        "has-size-legend": hasSizeLegend,
        [`position-${position}`]: !isBottomPosition,
        // this is required in case
        // position is not BOTTOM but isFluidLegend is true
        "position-bottom": isBottomPosition,
    });

    return (
        <Measure client={true}>
            {({ measureRef, contentRect }: MeasuredComponentProps) => {
                return (
                    <div className={classNames} ref={measureRef}>
                        {renderPushpinColorLegend(props, hasColorLegend)}
                        {renderPushpinCategoryLegend(props, contentRect, hasSizeLegend, hasCategoryLegend)}
                        {renderPushpinSizeLegend(props, hasSizeLegend)}
                    </div>
                );
            }}
        </Measure>
    );
}

function renderPushpinColorLegend(props: IGeoChartLegendRendererProps, hasColorLegend: boolean): JSX.Element {
    if (!hasColorLegend) {
        return null;
    }

    const {
        geoData: {
            color: { data, format },
        },
        position,
        responsive,
        showFluidLegend,
        colorLegendValue,
    } = props;

    const dataWithoutNull = data.filter(isFinite);
    const colorData = generateLegendColorData(dataWithoutNull, colorLegendValue);
    const isSmall: boolean = responsive && showFluidLegend;
    const numericSymbols: string[] = useNumbericSymbols();

    return (
        <ColorLegend
            data={colorData}
            format={format}
            isSmall={isSmall}
            numericSymbols={numericSymbols}
            position={position}
        />
    );
}

function renderPushpinCategoryLegend(
    props: IGeoChartLegendRendererProps,
    contentRect: ContentRect,
    hasSizeLegend: boolean,
    hasCategoryLegend: boolean,
): JSX.Element {
    if (!hasCategoryLegend) {
        return null;
    }

    return <PushpinCategoryLegend {...props} contentRect={contentRect} hasSizeLegend={hasSizeLegend} />;
}

function renderPushpinSizeLegend(props: IGeoChartLegendRendererProps, hasSizeLegend: boolean): JSX.Element {
    if (!hasSizeLegend) {
        return null;
    }

    const {
        geoData: {
            size: { data, format, name },
        },
    } = props;
    const numericSymbols: string[] = useNumbericSymbols();

    return (
        <PushpinSizeLegend format={format} measureName={name} numericSymbols={numericSymbols} sizes={data} />
    );
}
