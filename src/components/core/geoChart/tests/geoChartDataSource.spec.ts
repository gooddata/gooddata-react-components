// (C) 2019-2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { Execution } from "@gooddata/typings";
import { createPushpinDataSource } from "../geoChartDataSource";
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
        const geoDataIndex: IGeoDataIndex = {};
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(), geoDataIndex);

        expect(source.data).toEqual({
            type: "FeatureCollection",
            features: [],
        });
    });

    it("should return color palette and size scale", () => {
        const geoDataIndex: IGeoDataIndex = {
            size: 0,
            color: 1,
            location: 0,
            segmentBy: 1,
            tooltipText: 2,
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(getExecutionResult(), geoDataIndex);

        expect(source.data).toEqual({
            type: "FeatureCollection",
            features: [
                {
                    geometry: {
                        coordinates: [-155.6254, 19.0415],
                        type: "Point",
                    },
                    properties: {
                        City: "Discovery Harbour",
                        pushpinColorValue: 1005,
                        pushpinSegmentByValue: "Hawaii",
                        pushpinSizeValue: 1005,
                    },
                    type: "Feature",
                },
                {
                    geometry: {
                        coordinates: [-155.5751, 19.0698],
                        type: "Point",
                    },
                    properties: {
                        City: "Naalehu",
                        pushpinColorValue: 943,
                        pushpinSegmentByValue: "Hawaii",
                        pushpinSizeValue: 943,
                    },
                    type: "Feature",
                },
                {
                    geometry: {
                        coordinates: [-155.6143, 19.0716],
                        type: "Point",
                    },
                    properties: {
                        City: "Waiohinu",
                        pushpinColorValue: 179,
                        pushpinSegmentByValue: "Other county",
                        pushpinSizeValue: 179,
                    },
                    type: "Feature",
                },
            ],
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
        const geoDataIndex: IGeoDataIndex = {
            location: 0,
        };
        const source: mapboxgl.GeoJSONSourceRaw = createPushpinDataSource(noMeasureExecResult, geoDataIndex);

        expect(source.data).toEqual({
            features: [
                {
                    geometry: { coordinates: [-155.6254, 19.0415], type: "Point" },
                    properties: {
                        City: "",
                        pushpinColorValue: undefined,
                        pushpinSegmentByValue: "",
                        pushpinSizeValue: 10,
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.5751, 19.0698], type: "Point" },
                    properties: {
                        City: "",
                        pushpinColorValue: undefined,
                        pushpinSegmentByValue: "",
                        pushpinSizeValue: 10,
                    },
                    type: "Feature",
                },
                {
                    geometry: { coordinates: [-155.6143, 19.0716], type: "Point" },
                    properties: {
                        City: "",
                        pushpinColorValue: undefined,
                        pushpinSegmentByValue: "",
                        pushpinSizeValue: 10,
                    },
                    type: "Feature",
                },
            ],
            type: "FeatureCollection",
        });
    });
});
