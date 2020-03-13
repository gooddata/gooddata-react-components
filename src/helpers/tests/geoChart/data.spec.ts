// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./fixtures";
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

    it("should return geoData with full bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, true, true, true, true),
            executionResult: getExecutionResult(true, true, true, true, true),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [
                    NaN,
                    6832,
                    3294,
                    8340,
                    957,
                    NaN,
                    253,
                    1047,
                    7520,
                    22220,
                    18,
                    2282,
                    5602,
                    150,
                    1242,
                    1782,
                    NaN,
                    2299,
                    596,
                    12064,
                    869,
                    433,
                    1605,
                    11107,
                    45703,
                    8732,
                    2627,
                    1381,
                    11564,
                    2288,
                    3500,
                    3310,
                    5302,
                    3836,
                    1938,
                    1560,
                    1766,
                    3949,
                    772,
                    709,
                    3060,
                    838,
                    2844,
                    1719,
                    4726,
                    179,
                    943,
                    1005,
                ],
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
                    {
                        lat: 41.700001,
                        lng: -71.5,
                    },
                    {
                        lat: 44,
                        lng: -120.5,
                    },
                    {
                        lat: 43,
                        lng: -75,
                    },
                    {
                        lat: 44,
                        lng: -71.5,
                    },
                    {
                        lat: 41.5,
                        lng: -100,
                    },
                    {
                        lat: 38.5,
                        lng: -98,
                    },
                    {
                        lat: 33,
                        lng: -90,
                    },
                    {
                        lat: 40,
                        lng: -89,
                    },
                    {
                        lat: 39,
                        lng: -75.5,
                    },
                    {
                        lat: 41.599998,
                        lng: -72.699997,
                    },
                    {
                        lat: 34.799999,
                        lng: -92.199997,
                    },
                    {
                        lat: 40.273502,
                        lng: -86.126976,
                    },
                    {
                        lat: 38.573936,
                        lng: -92.60376,
                    },
                    {
                        lat: 27.994402,
                        lng: -81.760254,
                    },
                    {
                        lat: 39.876019,
                        lng: -117.224121,
                    },
                    {
                        lat: 45.367584,
                        lng: -68.972168,
                    },
                    {
                        lat: 44.182205,
                        lng: -84.506836,
                    },
                    {
                        lat: 33.247875,
                        lng: -83.441162,
                    },
                    {
                        lat: 35.860119,
                        lng: -86.660156,
                    },
                    {
                        lat: 37.926868,
                        lng: -78.024902,
                    },
                    {
                        lat: 39.833851,
                        lng: -74.871826,
                    },
                    {
                        lat: 37.839333,
                        lng: -84.27002,
                    },
                    {
                        lat: 47.650589,
                        lng: -100.437012,
                    },
                    {
                        lat: 46.39241,
                        lng: -94.63623,
                    },
                    {
                        lat: 36.084621,
                        lng: -96.921387,
                    },
                    {
                        lat: 46.96526,
                        lng: -109.533691,
                    },
                    {
                        lat: 47.751076,
                        lng: -120.740135,
                    },
                    {
                        lat: 39.41922,
                        lng: -111.950684,
                    },
                    {
                        lat: 39.113014,
                        lng: -105.358887,
                    },
                    {
                        lat: 40.367474,
                        lng: -82.996216,
                    },
                    {
                        lat: 32.31823,
                        lng: -86.902298,
                    },
                    {
                        lat: 42.032974,
                        lng: -93.581543,
                    },
                    {
                        lat: 34.307144,
                        lng: -106.018066,
                    },
                    {
                        lat: 33.836082,
                        lng: -81.163727,
                    },
                    {
                        lat: 41.203323,
                        lng: -77.194527,
                    },
                    {
                        lat: 34.048927,
                        lng: -111.093735,
                    },
                    {
                        lat: 39.045753,
                        lng: -76.641273,
                    },
                    {
                        lat: 42.407211,
                        lng: -71.382439,
                    },
                    {
                        lat: 36.778259,
                        lng: -119.417931,
                    },
                    {
                        lat: 44.068203,
                        lng: -114.742043,
                    },
                    {
                        lat: 43.07597,
                        lng: -107.290283,
                    },
                    {
                        lat: 35.782169,
                        lng: -80.793457,
                    },
                    {
                        lat: 30.39183,
                        lng: -92.329102,
                    },
                ],
                index: 0,
                name: "State",
            },
            segment: {
                data: [
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "General Goods",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                    "Toy Store",
                ],
                index: 1,
                name: "Type",
            },
            size: {
                data: [
                    1005,
                    943,
                    NaN,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    570,
                    1121,
                    1605,
                    NaN,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    NaN,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    NaN,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: [
                    "Wisconsin",
                    "West Virginia",
                    "Vermont",
                    "Texas",
                    "South Dakota",
                    "Rhode Island",
                    "Oregon",
                    "New York",
                    "New Hampshire",
                    "Nebraska",
                    "Kansas",
                    "Mississippi",
                    "Illinois",
                    "Delaware",
                    "Connecticut",
                    "Arkansas",
                    "Indiana",
                    "Missouri",
                    "Florida",
                    "Nevada",
                    "Maine",
                    "Michigan",
                    "Georgia",
                    "Tennessee",
                    "Virginia",
                    "New Jersey",
                    "Kentucky",
                    "North Dakota",
                    "Minnesota",
                    "Oklahoma",
                    "Montana",
                    "Washington",
                    "Utah",
                    "Colorado",
                    "Ohio",
                    "Alabama",
                    "Iowa",
                    "New Mexico",
                    "South Carolina",
                    "Pennsylvania",
                    "Arizona",
                    "Maryland",
                    "Massachusetts",
                    "California",
                    "Idaho",
                    "Wyoming",
                    "North Carolina",
                    "Louisiana",
                ],
                index: 2,
                name: "State",
            },
        });
    });

    it("should return geoData with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM, TOOLTIP_TEXT_ITEM, LOCATION_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, true, true, false),
            executionResult: getExecutionResult(true, false, true, true, false),
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
                    {
                        lat: 41.700001,
                        lng: -71.5,
                    },
                    {
                        lat: 44,
                        lng: -120.5,
                    },
                    {
                        lat: 43,
                        lng: -75,
                    },
                    {
                        lat: 44,
                        lng: -71.5,
                    },
                    {
                        lat: 41.5,
                        lng: -100,
                    },
                    {
                        lat: 38.5,
                        lng: -98,
                    },
                    {
                        lat: 33,
                        lng: -90,
                    },
                    {
                        lat: 40,
                        lng: -89,
                    },
                    {
                        lat: 39,
                        lng: -75.5,
                    },
                    {
                        lat: 41.599998,
                        lng: -72.699997,
                    },
                    {
                        lat: 34.799999,
                        lng: -92.199997,
                    },
                    {
                        lat: 40.273502,
                        lng: -86.126976,
                    },
                    {
                        lat: 38.573936,
                        lng: -92.60376,
                    },
                    {
                        lat: 27.994402,
                        lng: -81.760254,
                    },
                    {
                        lat: 39.876019,
                        lng: -117.224121,
                    },
                    {
                        lat: 45.367584,
                        lng: -68.972168,
                    },
                    {
                        lat: 44.182205,
                        lng: -84.506836,
                    },
                    {
                        lat: 33.247875,
                        lng: -83.441162,
                    },
                    {
                        lat: 35.860119,
                        lng: -86.660156,
                    },
                    {
                        lat: 37.926868,
                        lng: -78.024902,
                    },
                    {
                        lat: 39.833851,
                        lng: -74.871826,
                    },
                    {
                        lat: 37.839333,
                        lng: -84.27002,
                    },
                    {
                        lat: 47.650589,
                        lng: -100.437012,
                    },
                    {
                        lat: 46.39241,
                        lng: -94.63623,
                    },
                    {
                        lat: 36.084621,
                        lng: -96.921387,
                    },
                    {
                        lat: 46.96526,
                        lng: -109.533691,
                    },
                    {
                        lat: 47.751076,
                        lng: -120.740135,
                    },
                    {
                        lat: 39.41922,
                        lng: -111.950684,
                    },
                    {
                        lat: 39.113014,
                        lng: -105.358887,
                    },
                    {
                        lat: 40.367474,
                        lng: -82.996216,
                    },
                    {
                        lat: 32.31823,
                        lng: -86.902298,
                    },
                    {
                        lat: 42.032974,
                        lng: -93.581543,
                    },
                    {
                        lat: 34.307144,
                        lng: -106.018066,
                    },
                    {
                        lat: 33.836082,
                        lng: -81.163727,
                    },
                    {
                        lat: 41.203323,
                        lng: -77.194527,
                    },
                    {
                        lat: 34.048927,
                        lng: -111.093735,
                    },
                    {
                        lat: 39.045753,
                        lng: -76.641273,
                    },
                    {
                        lat: 42.407211,
                        lng: -71.382439,
                    },
                    {
                        lat: 36.778259,
                        lng: -119.417931,
                    },
                    {
                        lat: 44.068203,
                        lng: -114.742043,
                    },
                    {
                        lat: 43.07597,
                        lng: -107.290283,
                    },
                    {
                        lat: 35.782169,
                        lng: -80.793457,
                    },
                    {
                        lat: 30.39183,
                        lng: -92.329102,
                    },
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [
                    1005,
                    943,
                    NaN,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    570,
                    1121,
                    1605,
                    NaN,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    NaN,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    NaN,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
                format: "#,##0",
                index: 0,
                name: "Population",
            },
            tooltipText: {
                data: [
                    "Wisconsin",
                    "West Virginia",
                    "Vermont",
                    "Texas",
                    "South Dakota",
                    "Rhode Island",
                    "Oregon",
                    "New York",
                    "New Hampshire",
                    "Nebraska",
                    "Kansas",
                    "Mississippi",
                    "Illinois",
                    "Delaware",
                    "Connecticut",
                    "Arkansas",
                    "Indiana",
                    "Missouri",
                    "Florida",
                    "Nevada",
                    "Maine",
                    "Michigan",
                    "Georgia",
                    "Tennessee",
                    "Virginia",
                    "New Jersey",
                    "Kentucky",
                    "North Dakota",
                    "Minnesota",
                    "Oklahoma",
                    "Montana",
                    "Washington",
                    "Utah",
                    "Colorado",
                    "Ohio",
                    "Alabama",
                    "Iowa",
                    "New Mexico",
                    "South Carolina",
                    "Pennsylvania",
                    "Arizona",
                    "Maryland",
                    "Massachusetts",
                    "California",
                    "Idaho",
                    "Wyoming",
                    "North Carolina",
                    "Louisiana",
                ],
                index: 1,
                name: "State",
            },
        });
    });

    it("should return geoData with location, color, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, COLOR_ITEM, SIZE_ITEM];
        const execution: Execution.IExecutionResponses = {
            executionResponse: getExecutionResponse(true, false, false, true, true),
            executionResult: getExecutionResult(true, false, false, true, true),
        };

        const geoData = getGeoData(buckets, execution);
        expect(geoData).toEqual({
            color: {
                data: [
                    NaN,
                    6832,
                    3294,
                    8340,
                    957,
                    NaN,
                    253,
                    1047,
                    7520,
                    22220,
                    18,
                    2282,
                    5602,
                    150,
                    1242,
                    1782,
                    NaN,
                    2299,
                    596,
                    12064,
                    869,
                    433,
                    1605,
                    11107,
                    45703,
                    8732,
                    2627,
                    1381,
                    11564,
                    2288,
                    3500,
                    3310,
                    5302,
                    3836,
                    1938,
                    1560,
                    1766,
                    3949,
                    772,
                    709,
                    3060,
                    838,
                    2844,
                    1719,
                    4726,
                    179,
                    943,
                    1005,
                ],
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
                    {
                        lat: 41.700001,
                        lng: -71.5,
                    },
                    {
                        lat: 44,
                        lng: -120.5,
                    },
                    {
                        lat: 43,
                        lng: -75,
                    },
                    {
                        lat: 44,
                        lng: -71.5,
                    },
                    {
                        lat: 41.5,
                        lng: -100,
                    },
                    {
                        lat: 38.5,
                        lng: -98,
                    },
                    {
                        lat: 33,
                        lng: -90,
                    },
                    {
                        lat: 40,
                        lng: -89,
                    },
                    {
                        lat: 39,
                        lng: -75.5,
                    },
                    {
                        lat: 41.599998,
                        lng: -72.699997,
                    },
                    {
                        lat: 34.799999,
                        lng: -92.199997,
                    },
                    {
                        lat: 40.273502,
                        lng: -86.126976,
                    },
                    {
                        lat: 38.573936,
                        lng: -92.60376,
                    },
                    {
                        lat: 27.994402,
                        lng: -81.760254,
                    },
                    {
                        lat: 39.876019,
                        lng: -117.224121,
                    },
                    {
                        lat: 45.367584,
                        lng: -68.972168,
                    },
                    {
                        lat: 44.182205,
                        lng: -84.506836,
                    },
                    {
                        lat: 33.247875,
                        lng: -83.441162,
                    },
                    {
                        lat: 35.860119,
                        lng: -86.660156,
                    },
                    {
                        lat: 37.926868,
                        lng: -78.024902,
                    },
                    {
                        lat: 39.833851,
                        lng: -74.871826,
                    },
                    {
                        lat: 37.839333,
                        lng: -84.27002,
                    },
                    {
                        lat: 47.650589,
                        lng: -100.437012,
                    },
                    {
                        lat: 46.39241,
                        lng: -94.63623,
                    },
                    {
                        lat: 36.084621,
                        lng: -96.921387,
                    },
                    {
                        lat: 46.96526,
                        lng: -109.533691,
                    },
                    {
                        lat: 47.751076,
                        lng: -120.740135,
                    },
                    {
                        lat: 39.41922,
                        lng: -111.950684,
                    },
                    {
                        lat: 39.113014,
                        lng: -105.358887,
                    },
                    {
                        lat: 40.367474,
                        lng: -82.996216,
                    },
                    {
                        lat: 32.31823,
                        lng: -86.902298,
                    },
                    {
                        lat: 42.032974,
                        lng: -93.581543,
                    },
                    {
                        lat: 34.307144,
                        lng: -106.018066,
                    },
                    {
                        lat: 33.836082,
                        lng: -81.163727,
                    },
                    {
                        lat: 41.203323,
                        lng: -77.194527,
                    },
                    {
                        lat: 34.048927,
                        lng: -111.093735,
                    },
                    {
                        lat: 39.045753,
                        lng: -76.641273,
                    },
                    {
                        lat: 42.407211,
                        lng: -71.382439,
                    },
                    {
                        lat: 36.778259,
                        lng: -119.417931,
                    },
                    {
                        lat: 44.068203,
                        lng: -114.742043,
                    },
                    {
                        lat: 43.07597,
                        lng: -107.290283,
                    },
                    {
                        lat: 35.782169,
                        lng: -80.793457,
                    },
                    {
                        lat: 30.39183,
                        lng: -92.329102,
                    },
                ],
                index: 0,
                name: "State",
            },
            size: {
                data: [
                    1005,
                    943,
                    NaN,
                    4726,
                    1719,
                    2844,
                    838,
                    3060,
                    709,
                    772,
                    3949,
                    1766,
                    1560,
                    1938,
                    3836,
                    5302,
                    3310,
                    3500,
                    2288,
                    11564,
                    1381,
                    2627,
                    8732,
                    570,
                    1121,
                    1605,
                    NaN,
                    869,
                    12064,
                    596,
                    2299,
                    335,
                    1782,
                    1242,
                    NaN,
                    5602,
                    2282,
                    18,
                    22220,
                    7520,
                    1047,
                    NaN,
                    116,
                    957,
                    8340,
                    3294,
                    6832,
                    528,
                ],
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
