// (C) 2019-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { IGeoData, IPushpinColor } from "../../../interfaces/GeoChart";
import { DEFAULT_PUSHPIN_SIZE_VALUE } from "../../../constants/geoChart";
import { getHeaderItemName, isTwoDimensionsData } from "../../../helpers/executionResultHelper";
import { stringToFloat } from "../../../helpers/utils";
import { getPushpinColors } from "./geoChartColor";

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

function getLocation(locationValue: Execution.IResultHeaderItem): [number, number] | null {
    if (locationValue && Execution.isAttributeHeaderItem(locationValue)) {
        const latlng = locationValue.attributeHeaderItem.name;
        const [latitude, longitude] = latlng.split(";").map(stringToFloat);
        if (isNaN(latitude) || isNaN(longitude)) {
            // tslint:disable-next-line:no-console
            console.warn("UI-SDK: geoChartDataSource - getLocation: invalid location", locationValue);
        } else {
            return [longitude, latitude];
        }
    }
    return null;
}

function transformPushpinDataSource(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): IGeoDataSourceFeatures {
    const { color, location, segmentBy, size, tooltipText } = geoData;

    const locationNameTitle = tooltipText ? tooltipText.name : "";
    const colorTitle = color ? color.name : "";
    const sizeTitle = size ? size.name : "";
    const segmentByTitle = segmentBy ? segmentBy.name : "";

    let colorData: Execution.DataValue[] = [];
    let sizeData: Execution.DataValue[] = [];
    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;

    const { data } = executionResult;
    if (isTwoDimensionsData(data)) {
        if (hasColorMeasure) {
            colorData = data[color.index];
        }
        if (hasSizeMeasure) {
            sizeData = data[size.index];
        }
    }

    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    const locationData = location !== undefined ? attributeHeaderItems[location.index] : [];
    const locationNameData = tooltipText !== undefined ? attributeHeaderItems[tooltipText.index] : [];
    const segmentByData = segmentBy !== undefined ? attributeHeaderItems[segmentBy.index] : [];

    const sizesInNumber = sizeData.map(stringToFloat);
    const colorsInNumber = colorData.map(stringToFloat);
    const pushpinColors: IPushpinColor[] = getPushpinColors(colorsInNumber, segmentByData);

    const features = locationData.reduce(
        (
            result: IGeoDataSourceFeatures,
            locationItem: Execution.IResultHeaderItem,
            index: number,
        ): IGeoDataSourceFeatures => {
            const coordinates = getLocation(locationItem);
            if (!coordinates) {
                return result;
            }

            const colorValue = hasColorMeasure ? colorsInNumber[index] : undefined;
            const sizeValue = hasSizeMeasure ? sizesInNumber[index] : DEFAULT_PUSHPIN_SIZE_VALUE;

            const locationNameValue = getHeaderItemName(locationNameData[index]);
            const segmentByValue = getHeaderItemName(segmentByData[index]);
            const pushpinColor = pushpinColors[index] || pushpinColors[0] || {};

            return [
                ...result,
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates,
                    },
                    properties: {
                        locationName: {
                            title: locationNameTitle,
                            value: locationNameValue,
                        },
                        color: {
                            ...pushpinColor,
                            title: colorTitle,
                            value: colorValue,
                        },
                        size: {
                            title: sizeTitle,
                            value: sizeValue,
                        },
                        segmentBy: {
                            title: segmentByTitle,
                            value: segmentByValue,
                        },
                    },
                },
            ];
        },
        [],
    );

    return features;
}

export const createPushpinDataSource = (
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): mapboxgl.GeoJSONSourceRaw => {
    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(executionResult, geoData),
        },
    };
};
