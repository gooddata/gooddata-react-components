// (C) 2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import { IGeoConfig } from "../../../interfaces/GeoChart";
import { TOP } from "../../visualizations/chart/legend/PositionTypes";
import { IColorLegendItem } from "../../visualizations/typings/legend";
import { ColorLegend } from "../../visualizations/chart/legend/ColorLegend";
import { useNumbericSymbols } from "../base/hook/TranslationsHook";

export interface IGeoChartLegendRendererProps {
    config: IGeoConfig;
    sizeData?: number[];
    sizeFormat?: string;
    colorData?: IColorLegendItem[];
    colorFormat?: string;
    isColorLegendVisible?: boolean;
    position?: string;
}
export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    const numericSymbols = useNumbericSymbols();
    const {
        position = TOP,
        sizeData,
        sizeFormat,
        colorData,
        colorFormat,
        isColorLegendVisible = false,
    } = props;

    const hasSizeData = Boolean(sizeData);
    const isLegendVisible = isColorLegendVisible || hasSizeData;

    if (!isLegendVisible) {
        return null;
    }

    const classes = cx("geo-legend s-geo-legend", `position-${position}`, { "has-size-legend": hasSizeData });

    return (
        <div className={classes}>
            {isColorLegendVisible && renderColorLegend(colorData, colorFormat, numericSymbols)}
            {sizeData && renderPushpinSizeLegend(sizeData, sizeFormat, numericSymbols)}
        </div>
    );
}

function renderPushpinSizeLegend(sizeData: number[], format: string, numericSymbols: string[]): JSX.Element {
    return <PushpinSizeLegend numericSymbols={numericSymbols} format={format} sizes={sizeData} />;
}

function renderColorLegend(
    colorData: IColorLegendItem[],
    format: string,
    numericSymbols: string[],
): JSX.Element {
    return <ColorLegend data={colorData} format={format} numericSymbols={numericSymbols} position={TOP} />;
}
