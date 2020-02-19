// (C) 2019-2020 GoodData Corporation
import isFinite = require("lodash/isFinite");
import { Execution } from "@gooddata/typings";
import { IGeoData, IPushpinColor, IGeoDataItem } from "../../../interfaces/GeoChart";
import {
    DEFAULT_CLUSTER_RADIUS,
    DEFAULT_CLUSTER_MAX_ZOOM,
    DEFAULT_PUSHPIN_SIZE_VALUE,
} from "../../../constants/geoChart";
import { getGeoAttributeHeaderItems } from "../../../helpers/geoChart";
import { getHeaderItemName, isTwoDimensionsData } from "../../../helpers/executionResultHelper";
import { stringToFloat } from "../../../helpers/utils";
import { getPushpinColors, generateLegendColorData } from "./geoChartColor";
import { IGeoChartLegendData } from "../../visualizations/typings/legend";

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
    const { color, location, segment, size, tooltipText } = geoData;

    const locationNameTitle = tooltipText ? tooltipText.name : "";
    const colorTitle = color ? color.name : "";
    const sizeTitle = size ? size.name : "";
    const segmentTitle = segment ? segment.name : "";

    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);
    const locationData = location !== undefined ? attributeHeaderItems[location.index] : [];
    const locationNameData = tooltipText !== undefined ? attributeHeaderItems[tooltipText.index] : [];
    const segmentData = segment !== undefined ? attributeHeaderItems[segment.index] : [];

    const [sizeSeries, colorSeries] = getSizeColorSeries(executionResult, geoData);
    const pushpinColors: IPushpinColor[] = getPushpinColors(colorSeries, segmentData);
    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;

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

            const sizeValue = hasSizeMeasure ? sizeSeries[index] : DEFAULT_PUSHPIN_SIZE_VALUE;
            const colorValue = hasColorMeasure ? colorSeries[index] : undefined;

            const locationNameValue = getHeaderItemName(locationNameData[index]);
            const segmentValue = getHeaderItemName(segmentData[index]);
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
                        pushpinRadius: sizeValue,
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
                        segment: {
                            title: segmentTitle,
                            value: segmentValue,
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
    const source: mapboxgl.GeoJSONSourceRaw = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(executionResult, geoData),
        },
    };
    if (!geoData.size) {
        return {
            ...source,
            cluster: true,
            clusterMaxZoom: DEFAULT_CLUSTER_MAX_ZOOM,
            clusterRadius: DEFAULT_CLUSTER_RADIUS,
        };
    }
    return source;
};

export const calculateLegendData = (
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): IGeoChartLegendData => {
    const { data } = executionResult;
    if (isTwoDimensionsData(data)) {
        const [sizeSeries, colorSeries] = getSizeColorSeries(executionResult, geoData).map(
            (series: number[]) => series.filter(isFinite),
        );
        const colorData = colorSeries.length > 0 ? generateLegendColorData(colorSeries) : undefined;
        const sizeData = sizeSeries.length > 0 ? sizeSeries : undefined;

        return {
            colorData,
            sizeData,
        };
    }

    return {};
};

const getSizeColorSeries = (executionResult: Execution.IExecutionResult, geoData: IGeoData): number[][] => {
    const { size, color } = geoData;
    const { data } = executionResult;
    if (isTwoDimensionsData(data)) {
        return [size, color]
            .map((item: IGeoDataItem): Execution.DataValue[] => (item ? data[item.index] : []))
            .map((series: Execution.DataValue[]) => series.map(stringToFloat));
    }
    return [[], []];
};
