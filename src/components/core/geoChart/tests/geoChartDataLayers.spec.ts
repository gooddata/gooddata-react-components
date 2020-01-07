// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushpinDataLayer } from "../geoChartDataLayers";
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
                            uri: "/gdc/md/projectId/obj/694/elements?id=1808",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "19.0698;-155.5751",
                            uri: "/gdc/md/projectId/obj/694/elements?id=1903",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "19.0716;-155.6143",
                            uri: "/gdc/md/projectId/obj/694/elements?id=1870",
                        },
                    },
                ],
                [
                    {
                        attributeHeaderItem: {
                            name: "Hawaii",
                            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Hawaii",
                            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Another County",
                            uri: "/gdc/md/projectId/obj/790/elements?id=2027",
                        },
                    },
                ],
                [
                    {
                        attributeHeaderItem: {
                            name: "Discovery Harbour",
                            uri: "/gdc/md/projectId/obj/694/elements?id=1808",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Naalehu",
                            uri: "/gdc/md/projectId/obj/694/elements?id=1903",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Waiohinu",
                            uri: "/gdc/md/projectId/obj/694/elements?id=1870",
                        },
                    },
                ],
            ],
        ],
    };
}

describe("createPushpinDataLayer", () => {
    const dataSourceName: string = "test_datasource";

    it("should return default border, color and size", () => {
        const geoData: IGeoData = {};
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, getExecutionResult(), geoData);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
        expect(layer.paint["circle-radius"]).toBe(10);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
    });

    it("should return border, color palette and size scale", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
            },
            color: {
                index: 1,
                name: "color",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, getExecutionResult(), geoData);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
        expect(layer.paint["circle-radius"]).toEqual([
            "step",
            ["get", "value", ["object", ["get", "size"]]],
            10,
            179,
            10,
            316.67,
            28,
            454.33,
            46,
            592,
            64,
            729.67,
            82,
            867.33,
            100,
        ]);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
    });

    it("should return border and color palette with segmentBy", () => {
        const geoData: IGeoData = {
            size: {
                index: 0,
                name: "size",
            },
            color: {
                index: 1,
                name: "color",
            },
            segmentBy: {
                index: 1,
                name: "segmentBy",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(dataSourceName, getExecutionResult(), geoData);

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);

        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
    });

    it("should return filter", () => {
        const geoData: IGeoData = {};
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoData,
            "Hawaii",
        );

        expect(layer.filter).toEqual(["==", "Hawaii", ["get", "value", ["object", ["get", "segmentBy"]]]]);
    });
});
