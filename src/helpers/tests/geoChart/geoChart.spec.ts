// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { getGeoData, isDataOfReasonableSize } from "../../geoChart";
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
});
