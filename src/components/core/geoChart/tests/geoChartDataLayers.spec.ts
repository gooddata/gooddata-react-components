// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { createClusterLayers, createPushpinDataLayer } from "../geoChartDataLayers";
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
            segmentBy: {
                index: 1,
                name: "segmentBy",
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
            ["get", "value", ["object", ["get", "size"]]],
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
            location: {
                index: 0,
                name: "location",
            },
            segmentBy: {
                index: 1,
                name: "segmentBy",
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
            segmentBy: {
                index: 1,
                name: "segmentBy",
            },
        };
        const layer: mapboxgl.Layer = createPushpinDataLayer(
            dataSourceName,
            getExecutionResult(true, true, false, true, true),
            geoData,
            "Hawaii",
        );

        expect(layer.filter).toEqual(["==", "Hawaii", ["get", "value", ["object", ["get", "segmentBy"]]]]);
    });

    describe("createClusterLayers", () => {
        it("should return cluster layers", () => {
            const layers: mapboxgl.Layer[] = createClusterLayers(dataSourceName);

            expect(layers[0]).toEqual({
                filter: ["has", "point_count"],
                id: "gdcClusters",
                paint: { "circle-color": "rgb(20,178,226)", "circle-radius": 30 },
                source: "test_datasource",
                type: "circle",
            });
            expect(layers[1]).toEqual({
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
            expect(layers[2]).toEqual({
                filter: ["!", ["has", "point_count"]],
                id: "gdcPushpins",
                paint: {
                    "circle-color": [
                        "string",
                        ["get", "background", ["object", ["get", "color"]]],
                        "rgb(20,178,226)",
                    ],
                    "circle-radius": 10,
                    "circle-stroke-color": [
                        "string",
                        ["get", "border", ["object", ["get", "color"]]],
                        "rgb(20,178,226)",
                    ],
                    "circle-stroke-width": 1,
                },
                source: "test_datasource",
                type: "circle",
            });
        });
    });
});
