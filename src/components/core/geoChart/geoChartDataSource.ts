// (C) 2019-2020 GoodData Corporation
import {
    IGeoData,
    IGeoLngLat,
    IPushpinColor,
    IGeoPointsConfig,
    IGeoConfig,
} from "../../../interfaces/GeoChart";
import {
    DEFAULT_CLUSTER_RADIUS,
    DEFAULT_CLUSTER_MAX_ZOOM,
    PUSHPIN_SIZE_OPTIONS_MAP,
} from "../../../constants/geoChart";
import { isClusteringAllowed } from "../../../helpers/geoChart/common";
import { getPushpinColors } from "./geoChartColor";
import { getMinMax } from "../../../helpers/utils";

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

function transformPushpinDataSource(
    geoData: IGeoData,
    geoPointsConfig: IGeoPointsConfig,
): IGeoDataSourceFeatures {
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
    const sizeData = hasSize ? size.data : [];
    const { min: minSizeFromData, max: maxSizeFromData } = getMinMax(sizeData);
    const colorData = hasColor ? color.data : [];

    const sizeFormat = hasSize ? size.format : "";
    const colorFormat = hasColor ? color.format : "";

    const pushpinColors: IPushpinColor[] = getPushpinColors(colorData, segmentData);

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

export const createPushpinDataSource = (
    geoData: IGeoData,
    config?: IGeoConfig,
): mapboxgl.GeoJSONSourceRaw => {
    const { points: geoPointsConfig = {} } = config || {};
    const { groupNearbyPoints = true } = geoPointsConfig;
    const source: mapboxgl.GeoJSONSourceRaw = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(geoData, geoPointsConfig),
        },
    };
    if (isClusteringAllowed(geoData, groupNearbyPoints)) {
        return {
            ...source,
            cluster: true,
            clusterMaxZoom: DEFAULT_CLUSTER_MAX_ZOOM,
            clusterRadius: DEFAULT_CLUSTER_RADIUS,
        };
    }
    return source;
};
