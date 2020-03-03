// (C) 2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import {
    IGeoConfig,
    IGeoData,
    IGeoMeasureItem,
    IPushpinCategoryLegendItem,
} from "../../../interfaces/GeoChart";
import { TOP } from "../../visualizations/chart/legend/PositionTypes";
import { ColorLegend } from "../../visualizations/chart/legend/ColorLegend";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import PushpinCategoryLegend from "../geoChart/legends/PushpinCategoryLegend";

import { useNumbericSymbols } from "../base/hook/TranslationsHook";
import { generateLegendColorData } from "./geoChartColor";

export interface IGeoChartLegendRendererProps {
    config: IGeoConfig;
    geoData: IGeoData;
    position?: string;
    categoryItems?: IPushpinCategoryLegendItem[];
    onItemClick?(item: IPushpinCategoryLegendItem): void;
}

export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    const numericSymbols = useNumbericSymbols();
    const { position = TOP, categoryItems, geoData } = props;
    const { size, color } = geoData;

    const hasSizeData = Boolean(size && size.data.length);
    const hasSegmentData = Boolean(categoryItems && categoryItems.length);
    const isColorLegendVisible = Boolean(color && color.data.length && !hasSegmentData);
    const isLegendVisible = isColorLegendVisible || hasSizeData || hasSegmentData;

    if (!isLegendVisible) {
        return null;
    }

    const classes = cx("geo-legend s-geo-legend", `position-${position}`, { "has-size-legend": hasSizeData });

    return (
        <div className={classes}>
            {isColorLegendVisible && renderPushpinColorLegend(color, numericSymbols)}
            {hasSegmentData && renderPushpinCategoryLegend(props)}
            {hasSizeData && renderPushpinSizeLegend(size, numericSymbols)}
        </div>
    );
}

function renderPushpinSizeLegend(size: IGeoMeasureItem, numericSymbols: string[]): JSX.Element {
    const { name, format, data } = size;
    return (
        <PushpinSizeLegend numericSymbols={numericSymbols} format={format} sizes={data} measureName={name} />
    );
}

function renderPushpinColorLegend(color: IGeoMeasureItem, numericSymbols: string[]): JSX.Element {
    const { data, format } = color;
    const dataWithoutNull = data.filter(isFinite);
    const colorData = generateLegendColorData(dataWithoutNull);
    return <ColorLegend data={colorData} format={format} numericSymbols={numericSymbols} position={TOP} />;
}

function renderPushpinCategoryLegend(props: IGeoChartLegendRendererProps): JSX.Element {
    const { position = TOP, categoryItems, onItemClick } = props;
    return (
        <PushpinCategoryLegend position={position} categoryItems={categoryItems} onItemClick={onItemClick} />
    );
}
