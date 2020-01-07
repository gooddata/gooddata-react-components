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
