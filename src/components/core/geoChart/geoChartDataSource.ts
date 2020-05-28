// (C) 2019-2020 GoodData Corporation
import { getPushpinColors } from "./geoChartColor";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import {
    DEFAULT_CLUSTER_RADIUS,
    DEFAULT_CLUSTER_MAX_ZOOM,
    PUSHPIN_SIZE_OPTIONS_MAP,
} from "../../../constants/geoChart";
import {
    IGeoConfig,
    IGeoData,
    IGeoLngLat,
    IPushpinColor,
    IGeoPointsConfig,
} from "../../../interfaces/GeoChart";
import { getMinMax } from "../../../helpers/utils";

export interface IGeoDataSourceProps {
    colorStrategy: IColorStrategy;
    config: IGeoConfig;
    geoData: IGeoData;
    hasClustering: boolean;
}

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

function transformPushpinDataSource(dataSourceProps: IGeoDataSourceProps): IGeoDataSourceFeatures {
    const { config, geoData, colorStrategy } = dataSourceProps;
    const { points: geoPointsConfig = {} } = config || {};
    const { color, location, segment, size, tooltipText } = geoData;

    const locationNameTitle = tooltipText ? tooltipText.name : "";
    const colorTitle = color ? color.name : "";
    const sizeTitle = size ? size.name : "";
    const segmentTitle = segment ? segment.name : "";

    const hasLocation = location !== undefined;
    const hasTooltip = tooltipText !== undefined;
    const hasSegment = segment !== undefined;
    const hasSize = size !== undefined;
    const hasColor = color !== undefined;

    const locationData = hasLocation ? location.data : [];
    const locationNameData = hasTooltip ? tooltipText.data : [];
    const segmentData = hasSegment ? segment.data : [];
    const segmentUris = hasSegment ? segment.uris : [];
    const sizeData = hasSize ? size.data : [];
    const { min: minSizeFromData, max: maxSizeFromData } = getMinMax(sizeData);
    const colorData = hasColor ? color.data : [];

    const sizeFormat = hasSize ? size.format : "";
    const colorFormat = hasColor ? color.format : "";

    const pushpinColors: IPushpinColor[] = getPushpinColors(colorData, segmentData, colorStrategy);

    const features = locationData.reduce(
        (result: IGeoDataSourceFeatures, coordinates: IGeoLngLat, index: number): IGeoDataSourceFeatures => {
            if (!coordinates) {
                return result;
            }

            const { lat, lng } = coordinates;

            const pushpinSize = hasSize
                ? calculateSizeInPixel(sizeData[index], minSizeFromData, maxSizeFromData, geoPointsConfig)
                : PUSHPIN_SIZE_OPTIONS_MAP.min.default;
            const colorValue = hasColor ? colorData[index] : undefined;

            const segmentValue = segmentData[index];
            const segmentUri = segmentUris[index];

            const pushpinColor = pushpinColors[index] || pushpinColors[0] || {};

            return [
                ...result,
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat], // Mapbox requires number[]
                    },
                    properties: {
                        pushpinSize,
                        locationName: {
                            title: locationNameTitle,
                            value: locationNameData[index],
                        },
                        locationIndex: index,
                        color: {
                            ...pushpinColor,
                            title: colorTitle,
                            value: colorValue,
                            format: colorFormat,
                        },
                        size: {
                            title: sizeTitle,
                            value: sizeData[index],
                            format: sizeFormat,
                        },
                        segment: {
                            title: segmentTitle,
                            value: segmentValue,
                            uri: segmentUri,
                        },
                    },
                },
            ];
        },
        [],
    );

    return features;
}

// transform data value to pushpin size in pixel
const calculateSizeInPixel = (
    dataValue: number,
    minSize: number,
    maxSize: number,
    geoPointsConfig: IGeoPointsConfig,
): number => {
    if (minSize === maxSize || dataValue === null) {
        return PUSHPIN_SIZE_OPTIONS_MAP.min.default;
    }
    const { minSize: minSizeFromConfig = "default", maxSize: maxSizeFromConfig = "default" } =
        geoPointsConfig || {};
    const minSizeInPixel = PUSHPIN_SIZE_OPTIONS_MAP.min[minSizeFromConfig];
    const maxSizeInPixel = PUSHPIN_SIZE_OPTIONS_MAP.max[maxSizeFromConfig];

    return ((dataValue - minSize) * (maxSizeInPixel - minSizeInPixel)) / (maxSize - minSize) + minSizeInPixel;
};

export const createPushpinDataSource = (dataSourceProps: IGeoDataSourceProps): mapboxgl.GeoJSONSourceRaw => {
    const { hasClustering } = dataSourceProps;
    const source: mapboxgl.GeoJSONSourceRaw = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(dataSourceProps),
        },
    };
    if (hasClustering) {
        return {
            ...source,
            cluster: true,
            clusterMaxZoom: DEFAULT_CLUSTER_MAX_ZOOM,
            clusterRadius: DEFAULT_CLUSTER_RADIUS,
        };
    }
    return source;
};
