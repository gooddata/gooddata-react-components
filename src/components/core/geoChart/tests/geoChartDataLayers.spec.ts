// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import {
    createPushpinDataLayer,
    createClusterLabels,
    createClusterPoints,
    createUnclusterPoints,
} from "../geoChartDataLayers";
import { IGeoData } from "../../../../interfaces/GeoChart";
import { getExecutionResult } from "../../../../../stories/data/geoChart";

describe("createPushpinDataLayer", () => {
    const dataSourceName: string = "test_datasource";

    it("should return default border, color and size", () => {
        const geoData: IGeoData = {
            location: {
                index: 0,
                name: "location",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(true),
            geoData,
        );

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
            location: {
                index: 0,
                name: "location",
            },
            segment: {
                index: 1,
                name: "segment",
            },
            tooltipText: {
                index: 2,
                name: "tooltipText",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(true, true, true, true, true),
            geoData,
        );

        expect(layer.paint["circle-color"]).toEqual([
            "string",
            ["get", "background", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
        expect(layer.paint["circle-radius"]).toEqual([
            "step",
            ["get", "pushpinRadius"],
            10,
            18,
            10,
            7632.17,
            28,
            15246.33,
            46,
            22860.5,
            64,
            30474.67,
            82,
            38088.83,
            100,
        ]);
        expect(layer.paint["circle-stroke-color"]).toEqual([
            "string",
            ["get", "border", ["object", ["get", "color"]]],
            "rgb(20,178,226)",
        ]);
    });

    it("should return border and color palette with segment", () => {
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
            segment: {
                index: 1,
                name: "segment",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(true, true, false, true, true),
            geoData,
        );

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
            segment: {
                index: 1,
                name: "segment",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(true, true, false, true, true),
            geoData,
            "Hawaii",
        );

        expect(layer.filter).toEqual(["==", "Hawaii", ["get", "value", ["object", ["get", "segment"]]]]);
    });

    describe("Cluster Layers", () => {
        it("should create cluster point layer", () => {
            expect(createClusterPoints("test_datasource")).toEqual({
                filter: ["has", "point_count"],
                id: "gdcClusters",
                paint: {
                    "circle-color": ["step", ["get", "point_count"], "#00D398", 9, "#F38700", 99, "#E84C3C"],
                    "circle-radius": ["step", ["get", "point_count"], 30, 99, 50],
                    "circle-stroke-color": [
                        "step",
                        ["get", "point_count"],
                        "#00D398",
                        9,
                        "#F38700",
                        99,
                        "#E84C3C",
                    ],
                    "circle-stroke-opacity": 0.2,
                    "circle-stroke-width": 8,
                },
                source: "test_datasource",
                type: "circle",
            });
        });

        it("should create clustered label layer", () => {
            expect(createClusterLabels("test_datasource")).toEqual({
                filter: ["has", "point_count"],
                id: "gdcClusterLabels",
                layout: {
                    "text-allow-overlap": true,
                    "text-field": "{point_count_abbreviated}",
                    "text-size": 14,
                },
                paint: {
                    "text-color": "#fff",
                },
                source: "test_datasource",
                type: "symbol",
            });
        });

        it("should create unclustered points layer", () => {
            expect(createUnclusterPoints("test_datasource")).toEqual({
                filter: ["!", ["has", "point_count"]],
                id: "gdcPushpins",
                paint: {
                    "circle-color": "rgb(20,178,226)",
                    "circle-radius": 10,
                    "circle-stroke-color": "rgb(20,178,226)",
                    "circle-stroke-width": 1,
                },
                source: "test_datasource",
                type: "circle",
            });
        });
    });
});
