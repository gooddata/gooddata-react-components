// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    getGeoData,
    isDataOfReasonableSize,
    isLocationMissing,
    calculateAverage,
    getFormatFromExecutionResponse,
} from "../../geoChart";
import { IGeoData } from "../../../interfaces/GeoChart";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./data";
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
            segmentBy: { index: 1, name: "Type" },
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
        it("should return expected value ", () => {
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
});
