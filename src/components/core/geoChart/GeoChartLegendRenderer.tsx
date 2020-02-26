// (C) 2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import { IGeoConfig, IGeoData, IPushpinCategoryLegendItem } from "../../../interfaces/GeoChart";
import { TOP } from "../../visualizations/chart/legend/PositionTypes";
import { IColorLegendItem } from "../../visualizations/typings/legend";
import { ColorLegend } from "../../visualizations/chart/legend/ColorLegend";
import PushpinCategoryLegend from "../geoChart/legends/PushpinCategoryLegend";

import { useNumbericSymbols } from "../base/hook/TranslationsHook";

export interface IGeoChartLegendRendererProps {
    config: IGeoConfig;
    geoData: IGeoData;
    sizeData?: number[];
    sizeFormat?: string;
    colorData?: IColorLegendItem[];
    colorFormat?: string;
    position?: string;
    segmentData?: IPushpinCategoryLegendItem[];
    onItemClick?(item: IPushpinCategoryLegendItem): void;
}

export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    const numericSymbols = useNumbericSymbols();
    const { position = TOP, sizeData, colorData, segmentData, colorFormat } = props;

    const hasSizeData = Boolean(sizeData && sizeData.length);
    const hasSegmentData = Boolean(segmentData && segmentData.length);
    const isColorLegendVisible = Boolean(colorData && colorData.length && !hasSegmentData);
    const isLegendVisible = isColorLegendVisible || hasSizeData || hasSegmentData;

    if (!isLegendVisible) {
        return null;
    }

    const classes = cx("geo-legend s-geo-legend", `position-${position}`, { "has-size-legend": hasSizeData });

    return (
        <div className={classes}>
            {isColorLegendVisible && renderColorLegend(colorData, colorFormat, numericSymbols)}
            {hasSegmentData && renderPushpinCategoryLegend(props)}
            {hasSizeData && renderPushpinSizeLegend(props, numericSymbols)}
        </div>
    );
}

function renderPushpinSizeLegend(props: IGeoChartLegendRendererProps, numericSymbols: string[]): JSX.Element {
    const {
        sizeFormat,
        sizeData,
        geoData: {
            size: { name },
        },
    } = props;
    return (
        <PushpinSizeLegend
            numericSymbols={numericSymbols}
            format={sizeFormat}
            sizes={sizeData}
            measureName={name}
        />
    );
}

function renderColorLegend(
    colorData: IColorLegendItem[],
    format: string,
    numericSymbols: string[],
): JSX.Element {
    return <ColorLegend data={colorData} format={format} numericSymbols={numericSymbols} position={TOP} />;
}

function renderPushpinCategoryLegend(props: IGeoChartLegendRendererProps): JSX.Element {
    const { position = TOP, segmentData, onItemClick } = props;
    return <PushpinCategoryLegend position={position} segmentData={segmentData} onItemClick={onItemClick} />;
}
