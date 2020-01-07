// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushpinDataLayer } from "../geoChartDataLayers";
import { IGeoDataIndex } from "../../../../interfaces/GeoChart";

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
        const geoDataIndex: IGeoDataIndex = {};
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
        );

        expect(layer.paint["circle-color"]).toBe("rgb(20,178,226)");
        expect(layer.paint["circle-radius"]).toBe(10);
        expect(layer.paint["circle-stroke-color"]).toBe("rgb(20,178,226)");
    });

    it("should return boder, color palette and size scale", () => {
        const geoDataIndex: IGeoDataIndex = {
            size: 0,
            color: 1,
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
        );

        expect(layer.paint["circle-color"]).toEqual([
            "step",
            ["get", "pushpinColorValue"],
            "rgb(20,178,226)",
            179,
            "rgb(215,242,250)",
            316.67,
            "rgb(177,230,245)",
            454.33,
            "rgb(138,217,241)",
            592,
            "rgb(98,203,236)",
            729.67,
            "rgb(60,191,231)",
            867.33,
            "rgb(20,178,226)",
        ]);
        expect(layer.paint["circle-radius"]).toEqual({
            property: "pushpinSizeValue",
            stops: [[179, 10], [316.67, 28], [454.33, 46], [592, 64], [729.67, 82], [867.33, 100]],
        });
        expect(layer.paint["circle-stroke-color"]).toEqual("rgb(20,178,226)");
    });

    it("should return border and color palette with segmentBy", () => {
        const geoDataIndex: IGeoDataIndex = {
            size: 0,
            color: 1,
            segmentBy: 1,
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
        );

        expect(layer.paint["circle-color"]).toEqual([
            "match",
            ["get", "pushpinSegmentByValue"],
            "Hawaii",
            [
                "step",
                ["get", "pushpinColorValue"],
                "rgb(20,178,226)",
                179,
                "rgb(215,242,250)",
                316.67,
                "rgb(177,230,245)",
                454.33,
                "rgb(138,217,241)",
                592,
                "rgb(98,203,236)",
                729.67,
                "rgb(60,191,231)",
                867.33,
                "rgb(20,178,226)",
            ],
            "Another County",
            [
                "step",
                ["get", "pushpinColorValue"],
                "rgb(20,178,226)",
                179,
                "rgb(212,244,236)",
                316.67,
                "rgb(171,235,217)",
                454.33,
                "rgb(128,224,198)",
                592,
                "rgb(84,213,179)",
                729.67,
                "rgb(43,204,160)",
                867.33,
                "rgb(0,193,141)",
            ],
            "rgb(20,178,226)",
        ]);

        expect(layer.paint["circle-stroke-color"]).toEqual([
            "match",
            ["get", "pushpinSegmentByValue"],
            "Hawaii",
            "rgb(20,178,226)",
            "Another County",
            "rgb(0,193,141)",
            "rgb(20,178,226)",
        ]);
    });

    it("should return filter", () => {
        const geoDataIndex: IGeoDataIndex = {};
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
            "Hawaii",
        );

        expect(layer.filter).toEqual(["==", "Hawaii", ["get", "pushpinSegmentByValue"]]);
    });
});
