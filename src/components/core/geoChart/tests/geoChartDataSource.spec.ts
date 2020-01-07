// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushpinDataSource } from "../geoChartDataSource";
import { IGeoData } from "../../../../interfaces/GeoChart";

function getExecutionResult(): Execution.IExecutionResult {
    return {
        data: [["1005", "943", "179"], ["1005", "943", "179"]],
        paging: {
            count: [2, 3],
            offset: [0, 0],
            total: [2, 3],
        },
        headerItems: [
            [
                [
                    {
                        measureHeaderItem: {
                            name: "PushPin Value [Size]",
                            order: 0,
                        },
                    },
                    {
                        measureHeaderItem: {
                            name: "PushPin Value [Color]",
                            order: 1,
                        },
                    },
                ],
            ],
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
                [
                    {
                        attributeHeaderItem: {
                            name: "Hawaii",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/790/elements?id=2027",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Hawaii",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/790/elements?id=2027",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Other county",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/790/elements?id=2027",
                        },
                    },
                ],
                [
                    {
                        attributeHeaderItem: {
                            name: "Discovery Harbour",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1808",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Naalehu",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1903",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Waiohinu",
                            uri: "/gdc/md/a8pxyfcimmbcgczhy0o4w775oabma8im/obj/694/elements?id=1870",
                        },
                    },
                ],
            ],
        ],
    };
}

describe("createPushpinDataSource", () => {
    it("should return default color and size", () => {
        const geoData: IGeoData = {};
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(), geoData);

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
            segmentBy: {
                index: 1,
                name: "segmentBy",
            },
            tooltipText: {
                index: 2,
                name: "tooltipText",
            },
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(), geoData);

        expect(source.data).toEqual({
            features: [
                {
                    geometry: { coordinates: [-155.6254, 19.0415], type: "Point" },
                    properties: {
                        color: {
                            background: "rgb(20,178,226)",
                            border: "rgb(20,178,226)",
                            title: "color",
                            value: 1005,
                        },
                        locationName: { title: "tooltipText", value: "Discovery Harbour" },
                        segmentBy: { title: "segmentBy", value: "Hawaii" },
                        size: { title: "size", value: 1005 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.5751, 19.0698], type: "Point" },
                    properties: {
                        color: {
                            background: "rgb(20,178,226)",
                            border: "rgb(20,178,226)",
                            title: "color",
                            value: 943,
                        },
                        locationName: { title: "tooltipText", value: "Naalehu" },
                        segmentBy: { title: "segmentBy", value: "Hawaii" },
                        size: { title: "size", value: 943 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.6143, 19.0716], type: "Point" },
                    properties: {
                        color: {
                            background: "rgb(212,244,236)",
                            border: "rgb(0,193,141)",
                            title: "color",
                            value: 179,
                        },
                        locationName: { title: "tooltipText", value: "Waiohinu" },
                        segmentBy: { title: "segmentBy", value: "Other county" },
                        size: { title: "size", value: 179 },
                    },
                    type: "Feature",
                },
            ],
            type: "FeatureCollection",
        });
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
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segmentBy: { title: "", value: "" },
                        size: { title: "", value: 10 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.5751, 19.0698], type: "Point" },
                    properties: {
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segmentBy: { title: "", value: "" },
                        size: { title: "", value: 10 },
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.6143, 19.0716], type: "Point" },
                    properties: {
                        color: { title: "", value: undefined },
                        locationName: { title: "", value: "" },
                        segmentBy: { title: "", value: "" },
                        size: { title: "", value: 10 },
                    },
                    type: "Feature",
                },
            ],
            type: "FeatureCollection",
        });
    });
});
