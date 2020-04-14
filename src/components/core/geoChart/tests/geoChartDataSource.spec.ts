// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { createPushpinDataSource } from "../geoChartDataSource";
import { IGeoData } from "../../../../interfaces/GeoChart";
import { LOCATION_LNGLATS, SIZE_NUMBERS, COLOR_NUMBERS } from "../../../../../stories/data/geoChart";
import { buildMockColorStrategy } from "./mock";

describe("createPushpinDataSource", () => {
    const mockColorStrategy = buildMockColorStrategy();

    it("should return empty data source", () => {
        const geoData: IGeoData = {
            location: {
                name: "name",
                index: 0,
                data: [],
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(geoData, mockColorStrategy);

        expect(source.data).toEqual({
            type: "FeatureCollection",
            features: [],
        });
    });

    it("should return color palette and size scale", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
                data: SIZE_NUMBERS,
                format: "#,##0.00",
            },
            color: {
                index: 1,
                name: "color",
                data: COLOR_NUMBERS,
                format: "#,##0.00",
            },
            location: {
                index: 0,
                name: "location",
                data: LOCATION_LNGLATS,
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(geoData, mockColorStrategy);

        const data = source.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
        expect(data.features[0]).toEqual({
            geometry: {
                coordinates: [-89.5, 44.5],
                type: "Point",
            },
            properties: {
                pushpinSize: 10.311683632105215,
                color: {
                    background: "rgb(215,242,250)",
                    border: "rgb(20,178,226)",
                    title: "color",
                    value: NaN,
                    format: "#,##0.00",
                },
                locationName: {
                    title: "",
                    value: undefined,
                },
                segment: {
                    title: "",
                    value: undefined,
                },
                size: {
                    title: "size",
                    value: 1005,
                    format: "#,##0.00",
                },
            },
            type: "Feature",
        });

        expect(source.type).toEqual("geojson");
    });

    it("should return location without measure", () => {
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
                data: [
                    {
                        lat: 19.0415,
                        lng: -155.6254,
                    },
                    {
                        lat: 19.0698,
                        lng: -155.5751,
                    },
                    {
                        lat: 19.0716,
                        lng: -155.6143,
                    },
                ],
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(geoData, mockColorStrategy);

        expect(source.data).toEqual({
            features: [
                {
                    geometry: { coordinates: [-155.6254, 19.0415], type: "Point" },
                    properties: {
                        pushpinSize: 8,
                        color: {
                            format: "",
                            title: "",
                            value: undefined,
                            background: "rgb(20,178,226)",
                            border: "rgb(233,237,241)",
                        },
                        locationName: { title: "", value: undefined },
                        segment: { title: "", value: undefined },
                        size: { format: "", title: "", value: undefined },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.5751, 19.0698], type: "Point" },
                    properties: {
                        pushpinSize: 8,
                        color: {
                            format: "",
                            title: "",
                            value: undefined,
                            background: "rgb(20,178,226)",
                            border: "rgb(233,237,241)",
                        },
                        locationName: { title: "", value: undefined },
                        segment: { title: "", value: undefined },
                        size: { format: "", title: "", value: undefined },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.6143, 19.0716], type: "Point" },
                    properties: {
                        pushpinSize: 8,
                        color: {
                            format: "",
                            title: "",
                            value: undefined,
                            background: "rgb(20,178,226)",
                            border: "rgb(233,237,241)",
                        },
                        locationName: { title: "", value: undefined },
                        segment: { title: "", value: undefined },
                        size: { format: "", title: "", value: undefined },
                    },
                    type: "Feature",
                },
            ],
            type: "FeatureCollection",
        });
    });

    it("should not return data source with clusters", () => {
        const geoData: IGeoData = {
            color: {
                index: 0,
                name: "color",
                data: [],
                format: "#,##0",
            },
            location: {
                index: 0,
                name: "location",
                data: [],
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(geoData, mockColorStrategy);

        expect(source.cluster).toBe(undefined);
    });

    it("should return data source with clusters", () => {
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
                data: [],
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(geoData, mockColorStrategy);

        expect(source.cluster).toBe(true);
        expect(source.clusterMaxZoom).toBe(14);
        expect(source.clusterRadius).toBe(50);
    });
});
