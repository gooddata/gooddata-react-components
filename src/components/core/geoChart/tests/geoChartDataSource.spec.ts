// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushpinDataSource, calculateLegendData } from "../geoChartDataSource";
import { IGeoData } from "../../../../interfaces/GeoChart";
import { getExecutionResult, SIZE_DATA } from "../../../../../stories/data/geoChart";
import { stringToFloat } from "../../../../helpers/utils";

describe("createPushpinDataSource", () => {
    it("should return empty data source", () => {
        const geoData: IGeoData = {};
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(true), geoData);

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
            },
            color: {
                index: 1,
                name: "color",
            },
            location: {
                index: 0,
                name: "location",
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(
            getExecutionResult(true, false, false, true, true),
            geoData,
        );

        const data = source.data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
        expect(data.features[0]).toEqual({
            geometry: {
                coordinates: [-89.5, 44.5],
                type: "Point",
            },
            properties: {
                pushpinRadius: 1005,
                color: {
                    background: "rgb(176,229,245)",
                    border: "rgb(20,178,226)",
                    title: "color",
                    value: 528,
                },
                locationName: {
                    title: "",
                    value: "",
                },
                segment: {
                    title: "",
                    value: "",
                },
                size: {
                    title: "size",
                    value: 1005,
                },
            },
            type: "Feature",
        });

        expect(source.type).toEqual("geojson");
    });

    it("should return location without measure", () => {
        const noMeasureExecResult: Execution.IExecutionResult = {
            data: [],
            paging: {
                count: [2, 3],
                offset: [0, 0],
                total: [2, 3],
            },
            headerItems: [
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "19.0415;-155.6254",
                                uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1808",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "19.0698;-155.5751",
                                uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1903",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "19.0716;-155.6143",
                                uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1870",
                            },
                        },
                    ],
                ],
            ],
        };
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(noMeasureExecResult, geoData);

        expect(source.data).toEqual({
            features: [
                {
                    geometry: { coordinates: [-155.6254, 19.0415], type: "Point" },
                    properties: {
                        pushpinRadius: 10,
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segment: { title: "", value: "" },
                        size: { title: "", value: 10 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.5751, 19.0698], type: "Point" },
                    properties: {
                        pushpinRadius: 10,
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segment: { title: "", value: "" },
                        size: { title: "", value: 10 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.6143, 19.0716], type: "Point" },
                    properties: {
                        pushpinRadius: 10,
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segment: { title: "", value: "" },
                        size: { title: "", value: 10 },
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
            },
            location: {
                index: 0,
                name: "location",
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(
            getExecutionResult(true, false, false, false, true),
            geoData,
        );

        expect(source.cluster).toBe(undefined);
    });

    it("should return data source with clusters", () => {
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(true), geoData);

        expect(source.cluster).toBe(true);
        expect(source.clusterMaxZoom).toBe(14);
        expect(source.clusterRadius).toBe(50);
    });

    describe("calculate legend data", () => {
        const colorData = [
            {
                range: {
                    from: 18,
                    to: 7632.166666666667,
                },
                color: "rgb(215,242,250)",
            },
            {
                range: {
                    from: 7632.166666666667,
                    to: 15246.333333333334,
                },
                color: "rgb(176,229,245)",
            },
            {
                range: {
                    from: 15246.333333333334,
                    to: 22860.5,
                },
                color: "rgb(137,216,240)",
            },
            {
                range: {
                    from: 22860.5,
                    to: 30474.666666666668,
                },
                color: "rgb(98,203,235)",
            },
            {
                range: {
                    from: 30474.666666666668,
                    to: 38088.833333333336,
                },
                color: "rgb(59,190,230)",
            },
            {
                range: {
                    from: 38088.833333333336,
                    to: 45703,
                },
                color: "rgb(20,178,226)",
            },
        ];

        it("should calculate legend data with size and color", () => {
            const executionResult = getExecutionResult(true, false, false, true, true);
            const geoData: IGeoData = {
                size: {
                    index: 0,
                    name: "size",
                },
                color: {
                    index: 1,
                    name: "color",
                },
                location: {
                    index: 0,
                    name: "location",
                },
            };

            const expectedLegendData = {
                colorData,
                sizeData: SIZE_DATA.map(stringToFloat),
            };
            expect(calculateLegendData(executionResult, geoData)).toEqual(expectedLegendData);
        });

        it("should calculate legend data with size", () => {
            const executionResult = getExecutionResult(true, false, false, true, true);
            const geoData: IGeoData = {
                size: {
                    index: 0,
                    name: "size",
                },
                location: {
                    index: 0,
                    name: "location",
                },
            };

            const expectedLegendData = {
                sizeData: SIZE_DATA.map(stringToFloat),
            };
            expect(calculateLegendData(executionResult, geoData)).toEqual(expectedLegendData);
        });

        it("should calculate legend data with color", () => {
            const executionResult = getExecutionResult(true, false, false, true, true);
            const geoData: IGeoData = {
                color: {
                    index: 1,
                    name: "color",
                },
                location: {
                    index: 0,
                    name: "location",
                },
            };

            const expectedLegendData = {
                colorData,
            };
            expect(calculateLegendData(executionResult, geoData)).toEqual(expectedLegendData);
        });
    });
});
