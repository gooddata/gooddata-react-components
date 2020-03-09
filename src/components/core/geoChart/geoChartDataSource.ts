// (C) 2019-2020 GoodData Corporation
import { IGeoData, IGeoLngLatLike, IPushpinColor } from "../../../interfaces/GeoChart";
import {
    DEFAULT_CLUSTER_RADIUS,
    DEFAULT_CLUSTER_MAX_ZOOM,
    DEFAULT_PUSHPIN_SIZE_VALUE,
} from "../../../constants/geoChart";
import { isClusteringAllowed } from "../../../helpers/geoChart/common";
import { getPushpinColors } from "./geoChartColor";

type IGeoDataSourceFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;
export type IGeoDataSourceFeatures = IGeoDataSourceFeature[];

function transformPushpinDataSource(geoData: IGeoData): IGeoDataSourceFeatures {
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
    const colorData = hasColor ? color.data : [];

    const sizeFormat = hasSize ? size.format : "";
    const colorFormat = hasColor ? color.format : "";

    const pushpinColors: IPushpinColor[] = getPushpinColors(colorData, segmentData);

    const features = locationData.reduce(
        (
            result: IGeoDataSourceFeatures,
            coordinates: IGeoLngLatLike,
            index: number,
        ): IGeoDataSourceFeatures => {
            if (!coordinates) {
                return result;
            }

            const sizeValue = hasSize ? sizeData[index] : DEFAULT_PUSHPIN_SIZE_VALUE;
            const colorValue = hasColor ? colorData[index] : undefined;

            const segmentValue = segmentData[index];
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
                            value: sizeValue,
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

export const createPushpinDataSource = (geoData: IGeoData): mapboxgl.GeoJSONSourceRaw => {
    const source: mapboxgl.GeoJSONSourceRaw = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: transformPushpinDataSource(geoData),
        },
    };
    if (isClusteringAllowed(geoData)) {
        return {
            ...source,
            cluster: true,
            clusterMaxZoom: DEFAULT_CLUSTER_MAX_ZOOM,
            clusterRadius: DEFAULT_CLUSTER_RADIUS,
        };
    }
    return source;
};
