// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { getGeoData } from "../../geoChart";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./data";
import { getExecutionResponse } from "../../../../stories/data/geoChart";

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
});
