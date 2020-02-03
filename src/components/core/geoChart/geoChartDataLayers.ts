// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import {
    DEFAULT_CLUSTER_FILTER,
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_CLUSTER_POINTS_SIZE,
    DEFAULT_LAYER_NAME,
    DEFAULT_PUSHPIN_COLOR_VALUE,
    DEFAULT_PUSHPIN_OPTIONS,
    DEFAULT_PUSHPIN_SIZE_SCALE,
    DEFAULT_PUSHPIN_SIZE_VALUE,
    PUSHPIN_STYLE_CIRCLE,
    PUSHPIN_STYLE_CIRCLE_COLOR,
    PUSHPIN_STYLE_CIRCLE_SIZE,
    PUSHPIN_STYLE_CIRCLE_STROKE_COLOR,
} from "../../../constants/geoChart";
import { IGeoData } from "../../../interfaces/GeoChart";
import { stringToFloat } from "../../../helpers/utils";
import { SEGMENT_BY, SIZE } from "../../../constants/bucketNames";
import { isTwoDimensionsData } from "../../../helpers/executionResultHelper";

function getExpressionByBucketName(name: string): mapboxgl.Expression {
    return ["get", "value", ["object", ["get", name]]];
}

function createPushpinSizeOptions(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): mapboxgl.Expression | number {
    let sizeData: number[] = [];
    const hasSize = geoData.size !== undefined;
    const { data } = executionResult;
    if (hasSize && isTwoDimensionsData(data)) {
        sizeData = (data[geoData.size.index] || []).map(stringToFloat);
    }

    if (sizeData.length === 0) {
        return DEFAULT_PUSHPIN_SIZE_VALUE;
    }

    const sizeMax: number = Math.max(...sizeData);
    const sizeMin: number = Math.min(...sizeData);

    const sizesCount = DEFAULT_PUSHPIN_SIZE_SCALE.length;
    const sizeStep = (sizeMax - sizeMin) / sizesCount;

    const sizeOptions: mapboxgl.Expression = [
        "step",
        getExpressionByBucketName(SIZE),
        DEFAULT_PUSHPIN_SIZE_VALUE,
    ];
    for (let index = 0; index < sizesCount; index++) {
        let stepValue = sizeMin + sizeStep * index;
        stepValue = parseFloat(stepValue.toFixed(2));
        if (stepValue > sizeMax) {
            stepValue = sizeMax;
        }
        sizeOptions.push(stepValue, DEFAULT_PUSHPIN_SIZE_SCALE[index]);
    }

    return sizeOptions;
}

function createPushpinFilter(selectedSegmentItem: string): mapboxgl.Expression {
    return ["==", selectedSegmentItem, getExpressionByBucketName(SEGMENT_BY)];
}

function createPushpinColorOptions(): mapboxgl.Expression {
    return ["string", ["get", "background", ["object", ["get", "color"]]], DEFAULT_PUSHPIN_COLOR_VALUE];
}

function createPushpinBorderOptions(): mapboxgl.Expression {
    return ["string", ["get", "border", ["object", ["get", "color"]]], DEFAULT_PUSHPIN_COLOR_VALUE];
}

export function createPushpinDataLayer(
    dataSourceName: string,
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
    selectedSegmentItem?: string,
): mapboxgl.Layer {
    const layer: mapboxgl.Layer = {
        id: DEFAULT_LAYER_NAME,
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        paint: {
            ...DEFAULT_PUSHPIN_OPTIONS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: createPushpinColorOptions(),
            [PUSHPIN_STYLE_CIRCLE_STROKE_COLOR]: createPushpinBorderOptions(),
            [PUSHPIN_STYLE_CIRCLE_SIZE]: createPushpinSizeOptions(executionResult, geoData),
        },
    };
    if (selectedSegmentItem !== undefined) {
        layer.filter = createPushpinFilter(selectedSegmentItem);
    }
    return layer;
}

function createClusterPoints(dataSourceName: string): mapboxgl.Layer {
    return {
        id: DEFAULT_CLUSTER_LAYER_NAME,
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        filter: DEFAULT_CLUSTER_FILTER,
        paint: {
            [PUSHPIN_STYLE_CIRCLE_COLOR]: DEFAULT_PUSHPIN_COLOR_VALUE,
            [PUSHPIN_STYLE_CIRCLE_SIZE]: DEFAULT_CLUSTER_POINTS_SIZE,
        },
    };
}

function createClusterLabels(dataSourceName: string): mapboxgl.Layer {
    return {
        ...DEFAULT_CLUSTER_LABELS_CONFIG,
        source: dataSourceName,
        filter: DEFAULT_CLUSTER_FILTER,
    };
}

function createUnclusterPoints(dataSourceName: string): mapboxgl.Layer {
    return {
        id: DEFAULT_LAYER_NAME,
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        filter: ["!", DEFAULT_CLUSTER_FILTER],
        paint: {
            ...DEFAULT_PUSHPIN_OPTIONS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: createPushpinColorOptions(),
            [PUSHPIN_STYLE_CIRCLE_STROKE_COLOR]: createPushpinBorderOptions(),
            [PUSHPIN_STYLE_CIRCLE_SIZE]: DEFAULT_PUSHPIN_SIZE_VALUE,
        },
    };
}

export function createClusterLayers(dataSourceName: string): mapboxgl.Layer[] {
    return [
        createClusterPoints(dataSourceName),
        createClusterLabels(dataSourceName),
        createUnclusterPoints(dataSourceName),
    ];
}
