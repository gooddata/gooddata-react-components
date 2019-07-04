// (C) 2019 GoodData Corporation
import * as fixtures from "../../../../../stories/test_data/fixtures";
import { STACK_BY_DIMENSION_INDEX } from "../../chart/constants";
import { isDerivedMeasure } from "../chart";

describe("isDerivedMeasure", () => {
    it("should return true if measureItem was defined as a popMeasure", () => {
        const measureItem =
            fixtures.barChartWithPopMeasureAndViewByAttribute.executionResponse.dimensions[
                STACK_BY_DIMENSION_INDEX
            ].headers[0].measureGroupHeader.items[0];
        const { afm } = fixtures.barChartWithPopMeasureAndViewByAttribute.executionRequest;
        expect(isDerivedMeasure(measureItem, afm)).toEqual(true);
    });

    it("should return true if measureItem was defined as a previousPeriodMeasure", () => {
        const measureItem =
            fixtures.barChartWithPreviousPeriodMeasure.executionResponse.dimensions[STACK_BY_DIMENSION_INDEX]
                .headers[0].measureGroupHeader.items[0];
        const { afm } = fixtures.barChartWithPreviousPeriodMeasure.executionRequest;
        expect(isDerivedMeasure(measureItem, afm)).toEqual(true);
    });

    it("should return false if measureItem was defined as a simple measure", () => {
        const measureItem =
            fixtures.barChartWithPopMeasureAndViewByAttribute.executionResponse.dimensions[
                STACK_BY_DIMENSION_INDEX
            ].headers[0].measureGroupHeader.items[1];
        const { afm } = fixtures.barChartWithPopMeasureAndViewByAttribute.executionRequest;

        expect(isDerivedMeasure(measureItem, afm)).toEqual(false);
    });
});
