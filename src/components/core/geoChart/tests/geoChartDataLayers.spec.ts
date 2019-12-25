// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushPinDataLayer } from "../geoChartDataLayers";
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
                            name: "Hawaii",
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

describe("createPushPinDataLayer", () => {
    const dataSourceName: string = "test_datasource";

    it("should return default color and size", () => {
        const geoDataIndex: IGeoDataIndex = {};
        const layer: mapboxgl.Layer = createPushPinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
        );

        expect(layer.paint["circle-color"]).toBe("rgb(197,236,248)");
        expect(layer.paint["circle-radius"]).toBe(8);
    });

    it("should return color palette and size scale", () => {
        const geoDataIndex: IGeoDataIndex = {
            size: 0,
            color: 1,
        };
        const layer: mapboxgl.Layer = createPushPinDataLayer(
            dataSourceName,
            getExecutionResult(),
            geoDataIndex,
        );

        expect(layer.paint["circle-color"]).toEqual([
            "step",
            ["get", "pushpinColorValue"],
            "#000000",
            179,
            "rgb(197,236,248)",
            316.66666666666663,
            "rgb(138,217,241)",
            454.3333333333333,
            "rgb(79,198,234)",
            592,
            "rgb(20,178,226)",
            729.6666666666666,
            "rgb(22,151,192)",
            867.3333333333333,
            "rgb(0,110,145)",
        ]);
        expect(layer.paint["circle-radius"]).toEqual({
            property: "pushpinSizeValue",
            stops: [[179, 8], [344.2, 9], [509.4, 12], [674.5999999999999, 16], [839.8, 25]],
        });
    });
});
