// (C) 2019-2020 GoodData Corporation
import uniqBy = require("lodash/uniqBy");
import { Execution } from "@gooddata/typings";
import mapboxgl from "mapbox-gl";
import { DEFAULT_COLORS, getLighterColor } from "../../visualizations/utils/color";
import {
    DEFAULT_PUSHPIN_COLOR_SCALE,
    DEFAULT_PUSHPIN_COLOR_VALUE,
    DEFAULT_PUSHPIN_COLOR_VALUE_KEY,
    DEFAULT_PUSHPIN_OPTIONS,
    DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY,
    DEFAULT_PUSHPIN_SIZE_SCALE,
    DEFAULT_PUSHPIN_SIZE_VALUE,
    DEFAULT_PUSHPIN_SIZE_VALUE_KEY,
    PUSHPIN_STYLE_CIRCLE,
    PUSHPIN_STYLE_CIRCLE_COLOR,
    PUSHPIN_STYLE_CIRCLE_SIZE,
    PUSHPIN_STYLE_CIRCLE_STROKE_COLOR,
} from "../../../constants/geoChart";
import { getHeaderItemName } from "../../../helpers/executionResultHelper";
import { stringToFloat } from "../../../helpers/utils";
import { IGeoDataIndex } from "../../../interfaces/GeoChart";

function createPushpinBorderOptions(
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.Expression | string {
    const { color, segmentBy, size } = geoDataIndex;
    const data = executionResult.data as Execution.DataValue[][];
    const colorData = (data[color] || []).map(stringToFloat);

    if (colorData.length === 0) {
        return DEFAULT_COLORS[0];
    }

    if (!segmentBy) {
        return DEFAULT_COLORS[0];
    }

    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;
    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    const segmentByData = uniqBy(attributeHeaderItems[segmentBy], getHeaderItemName);
    if (segmentByData.length < 2) {
        return DEFAULT_COLORS[0];
    }

    const colorPaletteCount = DEFAULT_COLORS.length;
    let colorPaletteIndex = 0;

    const colorOptions: mapboxgl.Expression = ["match", ["get", DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY]];
    segmentByData.forEach((segmentByItem: Execution.IResultHeaderItem) => {
        const segmentByColor = DEFAULT_COLORS[colorPaletteIndex % colorPaletteCount];
        colorOptions.push(getHeaderItemName(segmentByItem), segmentByColor);
        colorPaletteIndex++;
    });

    // default color
    colorOptions.push(DEFAULT_PUSHPIN_COLOR_VALUE);

    return colorOptions;
}

function createColorRangeOptions(
    baseColor: string,
    minValue: number,
    maxValue: number,
    stepValue: number,
): mapboxgl.Expression | string {
    const colorOptions: mapboxgl.Expression = [
        "step",
        ["get", DEFAULT_PUSHPIN_COLOR_VALUE_KEY],
        DEFAULT_PUSHPIN_COLOR_VALUE,
    ];

    for (let index = 0; index < DEFAULT_PUSHPIN_COLOR_SCALE; index++) {
        let optionValue = minValue + stepValue * index;
        optionValue = parseFloat(optionValue.toFixed(2));
        if (optionValue > maxValue) {
            optionValue = maxValue;
        }

        // color range will run from lighter color to baseColor
        // bigger value will have the darker color
        let optionOpacity = (DEFAULT_PUSHPIN_COLOR_SCALE - (index + 1)) / DEFAULT_PUSHPIN_COLOR_SCALE;
        optionOpacity = parseFloat(optionOpacity.toFixed(2));
        if (optionOpacity > 1) {
            optionOpacity = 1;
        }

        colorOptions.push(optionValue, getLighterColor(baseColor, optionOpacity));
    }

    return colorOptions;
}

function createColorSegmentByOptions(
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
    minValue: number,
    maxValue: number,
    stepValue: number,
): mapboxgl.Expression | string {
    const { color, segmentBy, size } = geoDataIndex;

    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;
    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    const segmentByData = uniqBy(attributeHeaderItems[segmentBy], getHeaderItemName);

    if (segmentByData.length < 2) {
        return createColorRangeOptions(DEFAULT_COLORS[0], minValue, maxValue, stepValue);
    }

    const colorPaletteCount = DEFAULT_COLORS.length;
    let colorPaletteIndex = 0;

    const colorOptions: mapboxgl.Expression = ["match", ["get", DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY]];
    segmentByData.forEach((segmentByItem: Execution.IResultHeaderItem) => {
        const segmentByColor = DEFAULT_COLORS[colorPaletteIndex % colorPaletteCount];
        const segmentBySteps = createColorRangeOptions(segmentByColor, minValue, maxValue, stepValue);
        colorOptions.push(getHeaderItemName(segmentByItem), segmentBySteps);
        colorPaletteIndex++;
    });

    // default color
    colorOptions.push(DEFAULT_PUSHPIN_COLOR_VALUE);

    return colorOptions;
}

function createPushpinColorOptions(
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.Expression | string {
    const { color, segmentBy } = geoDataIndex;
    const data = executionResult.data as Execution.DataValue[][];
    const colorData = (data[color] || []).map(stringToFloat);

    if (colorData.length === 0) {
        return DEFAULT_PUSHPIN_COLOR_VALUE;
    }

    const colorMax: number = Math.max(...colorData);
    const colorMin: number = Math.min(...colorData);

    const colorStep = (colorMax - colorMin) / DEFAULT_PUSHPIN_COLOR_SCALE;

    if (segmentBy !== undefined) {
        return createColorSegmentByOptions(executionResult, geoDataIndex, colorMin, colorMax, colorStep);
    }

    return createColorRangeOptions(DEFAULT_COLORS[0], colorMin, colorMax, colorStep);
}

function createPushpinSizeOptions(
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
    const sizeStep = (sizeMax - sizeMin) / sizesCount;

    const sizeOptions: number[][] = [];
    for (let index = 0; index < sizesCount; index++) {
        let stepValue = sizeMin + sizeStep * index;
        stepValue = parseFloat(stepValue.toFixed(2));
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

function createPushpinFilter(selectedSegmentItem: string): mapboxgl.Expression {
    return ["==", selectedSegmentItem, ["get", DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY]];
}

export function createPushpinDataLayer(
    dataSourceName: string,
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
    selectedSegmentItem?: string,
): mapboxgl.Layer {
    const layer: mapboxgl.Layer = {
        id: "gdcPushpins",
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        paint: {
            ...DEFAULT_PUSHPIN_OPTIONS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: createPushpinColorOptions(executionResult, geoDataIndex),
            [PUSHPIN_STYLE_CIRCLE_SIZE]: createPushpinSizeOptions(executionResult, geoDataIndex),
            [PUSHPIN_STYLE_CIRCLE_STROKE_COLOR]: createPushpinBorderOptions(executionResult, geoDataIndex),
        },
    };
    if (selectedSegmentItem !== undefined) {
        layer.filter = createPushpinFilter(selectedSegmentItem);
    }
    return layer;
}
