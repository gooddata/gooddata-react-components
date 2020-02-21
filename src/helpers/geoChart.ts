// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import { VisualizationObject, Execution } from "@gooddata/typings";
import { IChartConfig } from "../interfaces/Config";
import { IGeoConfig, IGeoData, IObjectMapping } from "../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT, SIZE, TOOLTIP_TEXT } from "../constants/bucketNames";
import {
    getAttributeHeadersInDimension,
    getMeasureGroupHeaderItemsInDimension,
} from "./executionResultHelper";
import { isDisplayFormUri } from "../internal/utils/mdObjectHelper";

interface IBucketItemInfo {
    uri: VisualizationObject.IObjUriQualifier["uri"];
    localIdentifier: VisualizationObject.IObjUriQualifier["uri"];
}

function getBucketItemInfo(bucketItem: VisualizationObject.BucketItem): IBucketItemInfo {
    if (!bucketItem) {
        return null;
    }

    // attribute item
    if (VisualizationObject.isVisualizationAttribute(bucketItem)) {
        const { displayForm, localIdentifier } = bucketItem.visualizationAttribute;
        const uri = isDisplayFormUri(displayForm) && displayForm.uri;
        return {
            uri,
            localIdentifier,
        };
    }

    // measure item
    const { definition, localIdentifier } = bucketItem.measure;
    const item = VisualizationObject.isMeasureDefinition(definition) && definition.measureDefinition.item;
    const uri = isDisplayFormUri(item) && item.uri;
    return { uri, localIdentifier };
}

export function getGeoData(
    buckets: VisualizationObject.IBucket[],
    dimensions: Execution.IResultDimension[],
): IGeoData {
    const measureGroupHeader: Execution.IMeasureHeaderItem[] = getMeasureGroupHeaderItemsInDimension(
        dimensions,
    );
    const attributeHeaders: Array<
        Execution.IAttributeHeader["attributeHeader"]
    > = getAttributeHeadersInDimension(dimensions);

    const bucketItemInfos = buckets.reduce(
        (result: IObjectMapping, bucket: VisualizationObject.IBucket): IObjectMapping => ({
            ...result,
            [bucket.localIdentifier]: getBucketItemInfo(bucket.items[0]),
        }),
        {},
    );

    const geoData: IGeoData = {};

    [LOCATION, SEGMENT, TOOLTIP_TEXT].forEach(
        (bucketName: string): void => {
            const bucketItemInfo = bucketItemInfos[bucketName];
            if (!bucketItemInfo) {
                return;
            }
            const index = attributeHeaders.findIndex(
                (attributeHeader: Execution.IAttributeHeader["attributeHeader"]): boolean =>
                    attributeHeader.localIdentifier === bucketItemInfo.localIdentifier ||
                    attributeHeader.uri === bucketItemInfo.uri,
            );
            if (index !== -1) {
                geoData[bucketName] = {
                    index,
                    name: attributeHeaders[index].name,
                };
            }
        },
    );

    [SIZE, COLOR].forEach(
        (bucketName: string): void => {
            const bucketItemInfo = bucketItemInfos[bucketName];
            if (!bucketItemInfo) {
                return;
            }
            const index = measureGroupHeader.findIndex(
                (measureHeaderItem: Execution.IMeasureHeaderItem): boolean =>
                    measureHeaderItem.measureHeaderItem.localIdentifier === bucketItemInfo.localIdentifier ||
                    measureHeaderItem.measureHeaderItem.uri === bucketItemInfo.uri,
            );
            if (index !== -1) {
                geoData[bucketName] = {
                    index,
                    name: measureGroupHeader[index].measureHeaderItem.name,
                };
            }
        },
    );

    return geoData;
}

export function getGeoAttributeHeaderItems(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): Execution.IResultHeaderItem[][] {
    const { color, size } = geoData;

    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;
    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    return attributeHeaderItems;
}

export function isDataOfReasonableSize(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
    limit: number,
): boolean {
    const { location } = geoData;

    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);
    const locationData = location !== undefined ? attributeHeaderItems[location.index] : [];

    return locationData.length <= limit;
}

export function isLocationMissing(buckets: VisualizationObject.IBucket[]): boolean {
    const locationBucket: VisualizationObject.IBucket = buckets.find(
        (bucket: VisualizationObject.IBucket) => bucket.localIdentifier === LOCATION,
    );
    return !locationBucket || !locationBucket.items.length;
}

export function calculateAverage(values: number[] = []): number {
    if (!values.length) {
        return 0;
    }
    return values.reduce((a: number, b: number): number => a + b, 0) / values.length;
}

export function getFormatFromExecutionResponse(
    indexMeasure: number,
    result: Execution.IExecutionResponse,
): string {
    return get(
        result,
        `dimensions[0].headers[0].measureGroupHeader.items[${indexMeasure}].measureHeaderItem.format`,
    );
}

// show clusters when there is location attribute only
export function isClusteringAllowed(geoData: IGeoData): boolean {
    return geoData.location && Object.keys(geoData).length === 1;
}

export function isGeoConfig(config: IChartConfig | IGeoConfig): config is IGeoConfig {
    return (config as IGeoConfig).mapboxToken !== undefined;
}

export function isChartConfig(config: IChartConfig | IGeoConfig): config is IChartConfig {
    return !isGeoConfig(config);
}
