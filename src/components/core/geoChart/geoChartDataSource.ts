// (C) 2019-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import {
    DEFAULT_PUSHPIN_COLOR_VALUE_KEY,
    DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY,
    DEFAULT_PUSHPIN_SIZE_VALUE,
    DEFAULT_PUSHPIN_SIZE_VALUE_KEY,
} from "../../../constants/geoChart";
import { getHeaderItemName } from "../../../helpers/executionResultHelper";
import { stringToFloat } from "../../../helpers/utils";
import { IGeoDataIndex } from "../../../interfaces/GeoChart";

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
    geoDataIndex: IGeoDataIndex,
): IGeoDataSourceFeatures {
    const { color, location, segmentBy, size, tooltipText } = geoDataIndex;
    const data = executionResult.data as Execution.DataValue[][];

    const hasColorMeasure = color !== undefined;
    let colorData: Execution.DataValue[] = [];
    if (hasColorMeasure) {
        colorData = data[color];
    }

    const hasSizeMeasure = size !== undefined;
    let sizeData: Execution.DataValue[] = [];
    if (hasSizeMeasure) {
        sizeData = data[size];
    }

    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    const locationData = location !== undefined ? attributeHeaderItems[location] : [];
    const locationNameData = tooltipText !== undefined ? attributeHeaderItems[tooltipText] : [];
    const segmentByData = segmentBy !== undefined ? attributeHeaderItems[segmentBy] : [];

    const features = locationData.reduce(
        (
            result: IGeoDataSourceFeatures,
            locationItem: Execution.IResultHeaderItem,
            index: number,
        ): IGeoDataSourceFeatures => {
            const coordinates = getLocation(locationItem);
            if (coordinates) {
                const colorValue = hasColorMeasure ? stringToFloat(colorData[index] as string) : undefined;
                const sizeValue = hasSizeMeasure
                    ? stringToFloat(sizeData[index] as string)
                    : DEFAULT_PUSHPIN_SIZE_VALUE;
                return [
                    ...result,
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates,
                        },
                        properties: {
                            City: getHeaderItemName(locationNameData[index]),
                            [DEFAULT_PUSHPIN_COLOR_VALUE_KEY]: colorValue,
                            [DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY]: getHeaderItemName(segmentByData[index]),
                            [DEFAULT_PUSHPIN_SIZE_VALUE_KEY]: sizeValue,
                        },
                    },
                ];
            }
            return result;
        },
        [],
    );

    return features;
}

export const createPushpinDataSource = (
    executionResult: Execution.IExecutionResult,
    geoDataIndex: IGeoDataIndex,
): mapboxgl.GeoJSONSourceRaw => {
    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(executionResult, geoDataIndex),
        },
    };
};
