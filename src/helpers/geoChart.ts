// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import { VisualizationObject, Execution } from "@gooddata/typings";
import { IGeoData, IObjectMapping } from "../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../constants/bucketNames";
import {
    getAttributeHeadersInDimension,
    getMeasureGroupHeaderItemsInDimension,
} from "./executionResultHelper";

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
            [bucket.localIdentifier]: {
                uri:
                    get(bucket, "items.0.visualizationAttribute.displayForm.uri") ||
                    get(bucket, "items.0.measure.definition.measureDefinition.item.uri"),
                localIdentifier:
                    get(bucket, "items.0.visualizationAttribute.localIdentifier") ||
                    get(bucket, "items.0.measure.localIdentifier"),
            },
        }),
        {},
    );

    const geoData: IGeoData = {};

    [LOCATION, SEGMENT_BY, TOOLTIP_TEXT].forEach(
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
