// (C) 2019-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import mapboxgl from "mapbox-gl";
import {
    DEFAULT_PUSHPIN_COLOR_PALETTE,
    DEFAULT_PUSHPIN_COLOR_VALUE,
    DEFAULT_PUSHPIN_COLOR_VALUE_KEY,
    DEFAULT_PUSHPIN_OPTIONS,
    DEFAULT_PUSHPIN_SIZE_SCALE,
    DEFAULT_PUSHPIN_SIZE_VALUE,
    DEFAULT_PUSHPIN_SIZE_VALUE_KEY,
    PUSHPIN_STYLE_CIRCLE,
    PUSHPIN_STYLE_CIRCLE_COLOR,
    PUSHPIN_STYLE_CIRCLE_SIZE,
} from "../../../constants/geoChart";
import { stringToFloat } from "../../../helpers/utils";
import { IGeoDataIndex } from "../../../interfaces/GeoChart";

function createPushPinColorOptions(
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.Expression | string {
    const data = executionResult.data as Execution.DataValue[][];
    const colorData = (data[geoDataIndex.color] || []).map(stringToFloat);

    if (colorData.length === 0) {
        return DEFAULT_PUSHPIN_COLOR_VALUE;
    }

    const colorMax: number = Math.max(...colorData);
    const colorMin: number = Math.min(...colorData);

    const colorsCount = DEFAULT_PUSHPIN_COLOR_PALETTE.length;
    const colorStep = colorsCount > 0 ? (colorMax - colorMin) / colorsCount : 0;

    const colorOptions: mapboxgl.Expression = ["step", ["get", DEFAULT_PUSHPIN_COLOR_VALUE_KEY], "#000000"];
    for (let index = 0; index < colorsCount; index++) {
        let stepValue = colorMin + colorStep * index;
        if (stepValue > colorMax) {
            stepValue = colorMax;
        }
        colorOptions.push(stepValue, DEFAULT_PUSHPIN_COLOR_PALETTE[index]);
    }

    return colorOptions;
}

function createPushPinSizeOptions(
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.StyleFunction | number {
    const data = executionResult.data as Execution.DataValue[][];
    const sizeData = (data[geoDataIndex.size] || []).map(stringToFloat);

    if (sizeData.length === 0) {
        return DEFAULT_PUSHPIN_SIZE_VALUE;
    }

    const sizeMax: number = Math.max(...sizeData);
    const sizeMin: number = Math.min(...sizeData);

    const sizesCount = DEFAULT_PUSHPIN_SIZE_SCALE.length;
    const sizeStep = sizesCount > 0 ? (sizeMax - sizeMin) / sizesCount : 0;

    const sizeOptions: number[][] = [];
    for (let index = 0; index < sizesCount; index++) {
        let stepValue = sizeMin + sizeStep * index;
        if (stepValue > sizeMax) {
            stepValue = sizeMax;
        }
        sizeOptions.push([stepValue, DEFAULT_PUSHPIN_SIZE_SCALE[index]]);
    }

    return {
        property: DEFAULT_PUSHPIN_SIZE_VALUE_KEY,
        stops: sizeOptions,
    };
}

export function createPushPinDataLayer(
    dataSourceName: string,
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.Layer {
    return {
        id: "gdcPushpins",
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        paint: {
            ...DEFAULT_PUSHPIN_OPTIONS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: createPushPinColorOptions(executionResult, geoDataIndex),
            [PUSHPIN_STYLE_CIRCLE_SIZE]: createPushPinSizeOptions(executionResult, geoDataIndex),
        },
    };
}
