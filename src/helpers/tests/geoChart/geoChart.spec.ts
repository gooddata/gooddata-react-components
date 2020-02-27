// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    getGeoData,
    isDataOfReasonableSize,
    isChartConfig,
    isGeoConfig,
    isClusteringAllowed,
    isLocationMissing,
    calculateAverage,
    getFormatFromExecutionResponse,
} from "../../geoChart";
import { IChartConfig } from "../../../interfaces/Config";
import { IGeoConfig, IGeoData } from "../../../interfaces/GeoChart";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./fixtures";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";

describe("getGeoData", () => {
    it("should return geoData with full bucket", () => {
        const buckets: VisualizationObject.IBucket[] = [
            LOCATION_ITEM,
            SEGMENT_BY_ITEM,
            TOOLTIP_TEXT_ITEM,
            SIZE_ITEM,
            COLOR_ITEM,
        ];

        const executionResponse = getExecutionResponse(true, true, true, true, true);

        expect(getGeoData(buckets, executionResponse.dimensions)).toEqual({
            color: { index: 1, name: "Area" },
            location: { index: 0, name: "State" },
            segment: { index: 1, name: "Type" },
            size: { index: 0, name: "Population" },
            tooltipText: { index: 2, name: "State" },
        });
    });

    it("should return geoData with location, tooltipText, size", () => {
        const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM, TOOLTIP_TEXT_ITEM, LOCATION_ITEM];

        const executionResponse = getExecutionResponse(true, false, true, true, false);

        expect(getGeoData(buckets, executionResponse.dimensions)).toEqual({
            location: { index: 0, name: "State" },
            size: { index: 0, name: "Population" },
            tooltipText: { index: 1, name: "State" },
        });
    });

    it("should return geoData with location, color, size", () => {
        const buckets: VisualizationObject.IBucket[] = [LOCATION_ITEM, COLOR_ITEM, SIZE_ITEM];

        const executionResponse = getExecutionResponse(true, false, false, true, true);

        expect(getGeoData(buckets, executionResponse.dimensions)).toEqual({
            color: { index: 1, name: "Area" },
            location: { index: 0, name: "State" },
            size: { index: 0, name: "Population" },
        });
    });

    describe("isDataOfReasonableSize", () => {
        it.each([[51, true], [49, false]])(
            "should return isDataOfReasonableSize is %s",
            (limit: number, expectedResult: boolean) => {
                const geoData: IGeoData = { location: { index: 0, name: "location" } };
                const executionResult = getExecutionResult(true);
                expect(isDataOfReasonableSize(executionResult, geoData, limit)).toEqual(expectedResult);
            },
        );
    });

    describe("isLocationMissing", () => {
        it("should return false if location is in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [
                LOCATION_ITEM,
                SEGMENT_BY_ITEM,
                TOOLTIP_TEXT_ITEM,
                SIZE_ITEM,
                COLOR_ITEM,
            ];
            expect(isLocationMissing(buckets)).toBe(false);
        });

        it("should return true if location is not in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
            expect(isLocationMissing(buckets)).toBe(true);
        });
    });

    describe("calculateAverage", () => {
        it("should return expected value", () => {
            const values: number[] = [1, 2, 3, 4, 5, 6];
            expect(calculateAverage(values)).toEqual(3.5);
        });
    });

    describe("getFormatFromExecutionResponse", () => {
        it("should return format of Size Measure ", () => {
            const executionResponse = getExecutionResponse(true, false, false, true, false);
            expect(getFormatFromExecutionResponse(0, executionResponse)).toEqual("#,##0");
        });
    });

    describe("isClusteringAllowed", () => {
        it.each([
            [
                false,
                "size measure",
                {
                    location: { index: 0, name: "location" },
                    size: { index: 0, name: "size" },
                },
            ],
            [
                false,
                "color measure",
                {
                    location: { index: 0, name: "location" },
                    color: { index: 1, name: "color" },
                },
            ],
            [
                false,
                "segment attribute",
                {
                    location: { index: 0, name: "location" },
                    segment: { index: 1, name: "segment" },
                },
            ],
            [
                true,
                "no others",
                {
                    location: { index: 0, name: "location" },
                },
            ],
        ])(
            "should return %s when %s is in bucket",
            (expectedValue: boolean, _description: string, geoData: IGeoData) => {
                expect(isClusteringAllowed(geoData)).toEqual(expectedValue);
            },
        );
    });

    describe("isChartConfig", () => {
        it.each([[false, { mapboxToken: "abc" }], [true, {}]])(
            "should return isChartConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isChartConfig(config)).toEqual(expectedValue);
            },
        );
    });

    describe("isGeoConfig", () => {
        it.each([[false, {}], [true, { mapboxToken: "abc" }]])(
            "should return isGeoConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isGeoConfig(config)).toEqual(expectedValue);
            },
        );
    });
});
