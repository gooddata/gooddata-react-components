// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import {
    DEFAULT_CLUSTER_FILTER,
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_CLUSTER_POINT_BORDERS,
    DEFAULT_CLUSTER_POINT_COLORS,
    DEFAULT_CLUSTER_POINT_SIZES,
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
import { SEGMENT } from "../../../constants/bucketNames";
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

    // The mouseenter event uses queryRenderedFeatures to determine when the mouse is touching a feature
    // And queryRenderedFeatures is not supporting nested object in expression
    // https://github.com/mapbox/mapbox-gl-js/issues/7194
    const sizeOptions: mapboxgl.Expression = ["step", ["get", "pushpinRadius"], DEFAULT_PUSHPIN_SIZE_VALUE];
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
    return ["==", selectedSegmentItem, getExpressionByBucketName(SEGMENT)];
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

/**
 * Create layer for clustered points/pins which have 'properties.point_count' indicates number of same points is clustered together
 * @param dataSourceName
 */
export function createClusterPoints(dataSourceName: string): mapboxgl.Layer {
    return {
        id: DEFAULT_CLUSTER_LAYER_NAME,
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        filter: DEFAULT_CLUSTER_FILTER,
        paint: {
            ...DEFAULT_CLUSTER_POINT_BORDERS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: DEFAULT_CLUSTER_POINT_COLORS,
            [PUSHPIN_STYLE_CIRCLE_SIZE]: DEFAULT_CLUSTER_POINT_SIZES,
        },
    };
}

/**
 * Create layer for cluster labels which indicate number of points/pins is clustered
 * @param dataSourceName
 */
export function createClusterLabels(dataSourceName: string): mapboxgl.Layer {
    return {
        ...DEFAULT_CLUSTER_LABELS_CONFIG,
        source: dataSourceName,
        filter: DEFAULT_CLUSTER_FILTER,
    };
}

/**
 * Create layer for un-clustered points which are not close to others
 * @param dataSourceName
 */
export function createUnclusterPoints(dataSourceName: string): mapboxgl.Layer {
    return {
        id: DEFAULT_LAYER_NAME,
        type: PUSHPIN_STYLE_CIRCLE,
        source: dataSourceName,
        filter: ["!", DEFAULT_CLUSTER_FILTER],
        paint: {
            ...DEFAULT_PUSHPIN_OPTIONS,
            [PUSHPIN_STYLE_CIRCLE_COLOR]: DEFAULT_PUSHPIN_COLOR_VALUE,
            [PUSHPIN_STYLE_CIRCLE_STROKE_COLOR]: DEFAULT_PUSHPIN_COLOR_VALUE,
            [PUSHPIN_STYLE_CIRCLE_SIZE]: DEFAULT_PUSHPIN_SIZE_VALUE,
        },
    };
}
