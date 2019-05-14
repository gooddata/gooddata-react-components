// (C) 2007-2019 GoodData Corporation
import isArray = require("lodash/isArray");
import get = require("lodash/get");
import set = require("lodash/set");
import { AFM, VisualizationObject } from "@gooddata/typings";
import { getBucketItems, isStackedChart } from "../dimensions";
import { VIEW_BY_ATTRIBUTES_LIMIT } from "../../components/visualizations/chart/constants";
import { MEASURES } from "../../constants/bucketNames";
import { IChartConfig } from "../../interfaces/Config";
import IVisualizationAttribute = VisualizationObject.IVisualizationAttribute;

export function getViewByTwoAttributes(
    viewBy: IVisualizationAttribute | IVisualizationAttribute[],
): IVisualizationAttribute[] {
    if (!viewBy) {
        return [];
    }
    if (viewBy && isArray(viewBy)) {
        // only get first two attributes
        return viewBy.slice(0, VIEW_BY_ATTRIBUTES_LIMIT);
    }
    return [viewBy] as VisualizationObject.IVisualizationAttribute[];
}

/**
 * multiple measures => ignore computeRatio
 */
export function sanitizeMeasures(
    measures: VisualizationObject.BucketItem[] = [],
): VisualizationObject.BucketItem[] {
    if (measures.length > 1) {
        return measures.map(disableBucketItemComputeRatio);
    }

    return measures;
}

/**
 * Show a measure as a percentage
 * one measure
 *      => computeRatio = false or not set => evaluate stackMeasuresToPercent
 * stackMeasures is applied only when there are [2 measures and more]
 * stackMeasuresToPercent is applied only when there are [1 measure + 1 stackBy] or [2 measures and more]
 */
export function sanitizeConfig(
    buckets: VisualizationObject.IBucket[],
    config: IChartConfig = {},
): IChartConfig {
    const measures = getBucketItems(buckets, MEASURES);

    if (measures.length === 1) {
        const isComputeRatio = getComputeRatio(measures[0]);
        const hasStackByAttribute = isStackedChart(buckets);
        const { stackMeasures, stackMeasuresToPercent } = config;

        return {
            ...config,
            stackMeasures: stackMeasures && !isComputeRatio,
            stackMeasuresToPercent: stackMeasuresToPercent && !isComputeRatio && hasStackByAttribute,
        };
    }

    return config;
}

function disableBucketItemComputeRatio(item: VisualizationObject.BucketItem): VisualizationObject.BucketItem {
    if (getComputeRatio(item)) {
        setComputeRatio(item, false);
    }
    return item;
}

export function getComputeRatio(bucketItem: VisualizationObject.BucketItem): boolean {
    return get(bucketItem, ["measure", "definition", "measureDefinition", "computeRatio"], false);
}

function setComputeRatio(bucketItem: VisualizationObject.BucketItem, value: boolean) {
    set(bucketItem, ["measure", "definition", "measureDefinition", "computeRatio"], value);
}

/**
 * Show a measure as a percentage
 * one measure
 *      => computeRatio = false or not set => evaluate stackMeasuresToPercent
 * multiple measures
 *      => ignore computeRatio and use stackMeasuresToPercent
 *
 * stackMeasures is applied only when there are [2 measures and more]
 * stackMeasuresToPercent is applied only when there are [1 measure + 1 stackBy] or [2 measures and up]
 */
export function getSanitizedStackingConfigFromAfm(
    afm: AFM.IAfm,
    chartConfig: IChartConfig,
    hasStackByAttribute: boolean,
): IChartConfig {
    if (get(afm, ["measures", "length"]) === 1) {
        const { stackMeasures, stackMeasuresToPercent } = chartConfig;
        const isComputeRatio = get(afm, ["measures", "0", "definition", "measure", "computeRatio"], false);
        return {
            ...chartConfig,
            stackMeasures: stackMeasures && !isComputeRatio,
            stackMeasuresToPercent: stackMeasuresToPercent && !isComputeRatio && hasStackByAttribute,
        };
    }
    return chartConfig;
}
