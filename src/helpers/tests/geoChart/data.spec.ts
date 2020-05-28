// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import {
    COLOR_ITEM,
    LOCATION_ITEM,
    SEGMENT_BY_ITEM,
    SIZE_ITEM,
    TOOLTIP_TEXT_ITEM,
    COLOR_BUCKET_WITH_ITEM_BY_IDENTIFIER,
    LOCATION_BUCKET_WITH_ITEM_BY_IDENTIFIER,
    SEGMENT_BUCKET_WITH_ITEM_BY_IDENTIFIER,
    SIZE_BUCKET_WITH_ITEM_BY_IDENTIFIER,
    TOOLTIP_BUCKET_WITH_ITEM_BY_IDENTIFIER,
} from "./fixtures";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";
import { getGeoData, getLocation, getGeoBucketsFromMdObject } from "../../geoChart/data";

describe("getLocation", () => {
    it("should return { lat, lng } from location string", () => {
        const location = getLocation("44.500000;-89.500000");
        expect(location).toEqual({
            lat: 44.5,
            lng: -89.5,
        });
    });

    it.each(["", "123"])("should return null when input is '%s'", (input: string) => {
        const location = getLocation(input);
        expect(location).toEqual(null);
    });
});

describe("geoChartData", () => {
    it("should return geoData with empty bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(),
            executionResult: getExecutionResult(),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({});
    });

    it("should return geoData with full bucket by uri DF", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, true, true, true, true),
            executionResult: getExecutionResult(true, true, true, true, true, 5),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [NaN, 6832, 3294, 8340, 957],
                format: "#,##0",
                index: 1,
                name: "Area",
            },
            location: {
                data: [
                    {
                        lat: 44.5,
                        lng: -89.5,
                    },
                    {
                        lat: 39,
                        lng: -80.5,
                    },
                    {
                        lat: 44,
                        lng: -72.699997,
                    },
                    {
                        lat: 31,
                        lng: -100,
                    },
                    {
                        lat: 44.5,
                        lng: -100,
                    },
                ],
                index: 0,
                name: "State",
            },
            segment: {
                data: ["General Goods", "General Goods", "General Goods", "General Goods", "General Goods"],
                uris: [
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                ],
                index: 1,
                name: "Type",
            },
            size: {
                data: [1005, 943, NaN, 4726, 1719],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: ["Wisconsin", "West Virginia", "Vermont", "Texas", "South Dakota"],
                index: 2,
                name: "State",
            },
        });
    });

    it("should return geoData with full bucket by identifier DF", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_BUCKET_WITH_ITEM_BY_IDENTIFIER,
            SEGMENT_BUCKET_WITH_ITEM_BY_IDENTIFIER,
            TOOLTIP_BUCKET_WITH_ITEM_BY_IDENTIFIER,
            SIZE_BUCKET_WITH_ITEM_BY_IDENTIFIER,
            COLOR_BUCKET_WITH_ITEM_BY_IDENTIFIER,
        ];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, true, true, true, true),
            executionResult: getExecutionResult(true, true, true, true, true, 5),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [NaN, 6832, 3294, 8340, 957],
                format: "#,##0",
                index: 1,
                name: "Area",
            },
            location: {
                data: [
                    {
                        lat: 44.5,
                        lng: -89.5,
                    },
                    {
                        lat: 39,
                        lng: -80.5,
                    },
                    {
                        lat: 44,
                        lng: -72.699997,
                    },
                    {
                        lat: 31,
                        lng: -100,
                    },
                    {
                        lat: 44.5,
                        lng: -100,
                    },
                ],
                index: 0,
                name: "State",
            },
            segment: {
                data: ["General Goods", "General Goods", "General Goods", "General Goods", "General Goods"],
                uris: [
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                    "/gdc/md/storybook/obj/23/elements?id=1",
                ],
                index: 1,
                name: "Type",
            },
            size: {
                data: [1005, 943, NaN, 4726, 1719],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: ["Wisconsin", "West Virginia", "Vermont", "Texas", "South Dakota"],
                index: 2,
                name: "State",
            },
        });
    });

    it("should return geoData with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM, TOOLTIP_TEXT_ITEM, LOCATION_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, true, true, false),
            executionResult: getExecutionResult(true, false, true, true, false, 5),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            location: {
                data: [
                    {
                        lat: 44.5,
                        lng: -89.5,
                    },
                    {
                        lat: 39,
                        lng: -80.5,
                    },
                    {
                        lat: 44,
                        lng: -72.699997,
                    },
                    {
                        lat: 31,
                        lng: -100,
                    },
                    {
                        lat: 44.5,
                        lng: -100,
                    },
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [1005, 943, NaN, 4726, 1719],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: ["Wisconsin", "West Virginia", "Vermont", "Texas", "South Dakota"],
                index: 1,
                name: "State",
            },
        });
    });

    it("should return geoData with location, color, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, COLOR_ITEM, SIZE_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, false, true, true),
            executionResult: getExecutionResult(true, false, false, true, true, 5),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [NaN, 6832, 3294, 8340, 957],
                format: "#,##0",
                index: 1,
                name: "Area",
            },
            location: {
                data: [
                    {
                        lat: 44.5,
                        lng: -89.5,
                    },
                    {
                        lat: 39,
                        lng: -80.5,
                    },
                    {
                        lat: 44,
                        lng: -72.699997,
                    },
                    {
                        lat: 31,
                        lng: -100,
                    },
                    {
                        lat: 44.5,
                        lng: -100,
                    },
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [1005, 943, NaN, 4726, 1719],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
        });
    });
});

describe("getGeoBucketsFromMdObject", () => {
    const attributeGeo1 = {
        visualizationAttribute: {
            localIdentifier: "localIdentifier123",
            displayForm: {
                uri: "/gdc/displayform/geo1",
            },
        },
    };
    const attributeGeo2 = {
        visualizationAttribute: {
            localIdentifier: "tooltipText",
            displayForm: {
                uri: "/gdc/displayform/geo2",
            },
        },
    };

    it("should return buckets have tooltip text when geo pushpin has location item", () => {
        const mdObject = {
            visualizationClass: {
                uri: "/gdc/visualizationclass/1",
            },
            buckets: [
                {
                    localIdentifier: "location",
                    items: [attributeGeo1],
                },
            ],
            properties: '{"controls":{"tooltipText":"/gdc/displayform/geo2"}}',
        };
        const buckets = getGeoBucketsFromMdObject(mdObject);
        expect(buckets).toEqual([
            {
                localIdentifier: "location",
                items: [attributeGeo1],
            },
            {
                localIdentifier: "tooltipText",
                items: [attributeGeo2],
            },
        ]);
    });

    it("should return buckets without tooltip text when geo pushpin does not have location item", () => {
        const mdObject = {
            visualizationClass: {
                uri: "/gdc/visualizationclass/1",
            },
            buckets: [
                {
                    localIdentifier: "size",
                    items: [attributeGeo1],
                },
            ],
        };
        const buckets = getGeoBucketsFromMdObject(mdObject);
        expect(buckets).toEqual([
            {
                localIdentifier: "size",
                items: [attributeGeo1],
            },
        ]);
    });
});
