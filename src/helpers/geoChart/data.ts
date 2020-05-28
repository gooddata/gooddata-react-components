// (C) 2020 GoodData Corporation
import get = require("lodash/get");
import { Execution, VisualizationObject } from "@gooddata/typings";
import {
    IAvailableLegends,
    IGeoData,
    IGeoLngLat,
    IObjectMapping,
    IPushpinCategoryLegendItem,
} from "../../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT, SIZE, TOOLTIP_TEXT } from "../../constants/bucketNames";
import {
    isTwoDimensionsData,
    getHeaderItemName,
    getAttributeHeadersInDimension,
    getMeasureGroupHeaderItemsInDimension,
} from "../executionResultHelper";
import { getMinMax, stringToFloat } from "../utils";
import { getFormatFromExecutionResponse, getGeoAttributeHeaderItems } from "./common";
import { isDisplayFormUri } from "../../internal/utils/mdObjectHelper";

interface IBucketItemInfo {
    uri?: VisualizationObject.IObjUriQualifier["uri"];
    identifier?: VisualizationObject.IObjIdentifierQualifier["identifier"];
    localIdentifier: VisualizationObject.IObjUriQualifier["uri"];
}

interface ISegmentData {
    uris: string[];
    data: string[];
}

export function getLocation(latlng: string): IGeoLngLat | null {
    if (!latlng) {
        return null;
    }

    const [latitude, longitude] = latlng.split(";").map(stringToFloat);
    if (isNaN(latitude) || isNaN(longitude)) {
        // tslint:disable-next-line:no-console
        console.warn("UI-SDK: geoChartDataSource - getLocation: invalid location", latlng);
        return null;
    }

    return {
        lat: latitude,
        lng: longitude,
    };
}

export function getGeoData(
    buckets: VisualizationObject.IBucket[],
    execution: Execution.IExecutionResponses,
): IGeoData {
    const { executionResponse, executionResult } = execution;
    const geoData: IGeoData = getBucketItemNameAndDataIndex(buckets, executionResponse.dimensions);
    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);

    const locationIndex: number = get(geoData, `${LOCATION}.index`);
    const segmentIndex: number = get(geoData, `${SEGMENT}.index`);
    const tooltipTextIndex: number = get(geoData, `${TOOLTIP_TEXT}.index`);
    const sizeIndex: number = get(geoData, `${SIZE}.index`);
    const colorIndex: number = get(geoData, `${COLOR}.index`);

    if (locationIndex !== undefined) {
        const locationData: string[] = getAttributeData(attributeHeaderItems, locationIndex);
        geoData[LOCATION].data = locationData.map(getLocation);
    }

    if (segmentIndex !== undefined) {
        const { data, uris } = getSegmentDataAndUris(attributeHeaderItems, segmentIndex);
        geoData[SEGMENT].data = data;
        geoData[SEGMENT].uris = uris;
    }

    if (tooltipTextIndex !== undefined) {
        geoData[TOOLTIP_TEXT].data = getAttributeData(attributeHeaderItems, tooltipTextIndex);
    }

    if (sizeIndex !== undefined) {
        geoData[SIZE].data = getMeasureData(executionResult, sizeIndex);
        geoData[SIZE].format = getFormatFromExecutionResponse(executionResponse, sizeIndex);
    }

    if (colorIndex !== undefined) {
        geoData[COLOR].data = getMeasureData(executionResult, colorIndex);
        geoData[COLOR].format = getFormatFromExecutionResponse(executionResponse, colorIndex);
    }

    return geoData;
}

function getMeasureData(executionResult: Execution.IExecutionResult, dataIndex: number): number[] {
    const { data } = executionResult;
    if (!isTwoDimensionsData(data)) {
        return [];
    }

    const measureValues = data[dataIndex];
    return measureValues.map(stringToFloat);
}

function getAttributeData(
    attributeHeaderItems: Execution.IResultHeaderItem[][],
    dataIndex: number,
): string[] {
    const headerItems = attributeHeaderItems[dataIndex];
    return headerItems.map(getHeaderItemName);
}

function getSegmentDataAndUris(
    attributeHeaderItems: Execution.IResultHeaderItem[][],
    dataIndex: number,
): ISegmentData {
    const headerItems = attributeHeaderItems[dataIndex];
    return headerItems.reduce<ISegmentData>(
        (result: ISegmentData, headerItem: Execution.IResultHeaderItem): ISegmentData => {
            if (headerItem && Execution.isAttributeHeaderItem(headerItem)) {
                const { uri, name } = headerItem.attributeHeaderItem;
                return { uris: [...result.uris, uri], data: [...result.data, name] };
            }
            return result;
        },
        { uris: [], data: [] },
    );
}

function getBucketItemNameAndDataIndex(
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

    // init data
    const result: IGeoData = {};

    [LOCATION, SEGMENT, TOOLTIP_TEXT].forEach(
        (bucketName: string): void => {
            const bucketItemInfo = bucketItemInfos[bucketName];
            if (!bucketItemInfo) {
                return;
            }
            const index = attributeHeaders.findIndex(
                (attributeHeader: Execution.IAttributeHeader["attributeHeader"]): boolean =>
                    attributeHeader.localIdentifier === bucketItemInfo.localIdentifier &&
                    (attributeHeader.uri === bucketItemInfo.uri ||
                        attributeHeader.identifier === bucketItemInfo.identifier),
            );
            if (index !== -1) {
                const {
                    formOf: { name },
                } = attributeHeaders[index];
                result[bucketName] = { index, name };
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
                    measureHeaderItem.measureHeaderItem.localIdentifier === bucketItemInfo.localIdentifier &&
                    (measureHeaderItem.measureHeaderItem.uri === bucketItemInfo.uri ||
                        measureHeaderItem.measureHeaderItem.identifier === bucketItemInfo.identifier),
            );
            if (index !== -1) {
                result[bucketName] = {
                    index,
                    name: measureGroupHeader[index].measureHeaderItem.name,
                };
            }
        },
    );

    return result;
}

function getUriAndIdentifier(objQualifier: VisualizationObject.ObjQualifier) {
    if (isDisplayFormUri(objQualifier)) {
        return {
            uri: objQualifier.uri,
        };
    }
    return {
        identifier: objQualifier.identifier,
    };
}

function getBucketItemInfo(bucketItem: VisualizationObject.BucketItem): IBucketItemInfo {
    if (!bucketItem) {
        return null;
    }

    // attribute item
    if (VisualizationObject.isVisualizationAttribute(bucketItem)) {
        const { displayForm, localIdentifier } = bucketItem.visualizationAttribute;
        return {
            localIdentifier,
            ...getUriAndIdentifier(displayForm),
        };
    }

    // measure item
    const { definition, localIdentifier } = bucketItem.measure;
    const item = VisualizationObject.isMeasureDefinition(definition) && definition.measureDefinition.item;
    return { localIdentifier, ...getUriAndIdentifier(item) };
}

function buildTooltipBucketItem(tooltipText: string): VisualizationObject.IBucket {
    return {
        localIdentifier: TOOLTIP_TEXT,
        items: [
            {
                visualizationAttribute: {
                    localIdentifier: TOOLTIP_TEXT,
                    displayForm: {
                        uri: tooltipText,
                    },
                },
            },
        ],
    };
}

export const getGeoBucketsFromMdObject = (
    mdObject: VisualizationObject.IVisualizationObjectContent,
): VisualizationObject.IBucket[] => {
    if (!mdObject) {
        return [];
    }
    const { buckets = [], properties } = mdObject;
    const propertiesObj = parseGeoPropertyItem(properties);
    const tooltipText = get(propertiesObj, "controls.tooltipText");
    if (tooltipText) {
        return [...buckets, buildTooltipBucketItem(tooltipText)];
    }

    return buckets;
};

export function getAvailableLegends(
    categoryItems: IPushpinCategoryLegendItem[],
    geoData: IGeoData,
): IAvailableLegends {
    const { color: { data: colorData = [] } = {}, size: { data: sizeData = [] } = {} } = geoData;

    const { min: minColor, max: maxColor } = getMinMax(colorData);
    const { min: minSize, max: maxSize } = getMinMax(sizeData);

    const hasCategoryLegend = Boolean(categoryItems && categoryItems.length);
    const hasColorLegend = Boolean(colorData.length) && minColor !== maxColor && !hasCategoryLegend;
    const hasSizeLegend = Boolean(sizeData.length) && minSize !== maxSize;

    return {
        hasCategoryLegend,
        hasColorLegend,
        hasSizeLegend,
    };
}

function parseGeoPropertyItem(item: string): GeoJSON.GeoJsonProperties {
    try {
        return JSON.parse(item);
    } catch (e) {
        return {};
    }
}

export function parseGeoProperties(properties: GeoJSON.GeoJsonProperties): GeoJSON.GeoJsonProperties {
    const { locationName = "{}", color = "{}", size = "{}", segment = "{}" } = properties;
    return {
        locationName: parseGeoPropertyItem(locationName),
        size: parseGeoPropertyItem(size),
        color: parseGeoPropertyItem(color),
        segment: parseGeoPropertyItem(segment),
    };
}
