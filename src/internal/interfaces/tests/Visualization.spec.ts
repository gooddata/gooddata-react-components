// (C) 2019 GoodData Corporation
import { InvalidTypeGuardInputTestCases } from "../../../helpers/model/tests/invalid_type_guard_mocks";
import { isDateFilter, isAttributeFilter, isMeasureValueFilter } from "../Visualization";
import { dateFilter, attributeFilter, measureValueFilter } from "../../mocks/referencePointMocks";

describe("Visualization typeguards", () => {
    describe("isDateFilter", () => {
        const Scenarios: Array<[boolean, string, any]> = [
            ...InvalidTypeGuardInputTestCases,
            [true, "date filter", dateFilter],
            [false, "attribute filter", attributeFilter],
            [false, "measure value filter", measureValueFilter],
        ];

        it.each(Scenarios)("should return %s when input is %s", (expectedResult, _desc, input) => {
            expect(isDateFilter(input)).toBe(expectedResult);
        });
    });

    describe("isAttributeFilter", () => {
        const Scenarios: Array<[boolean, string, any]> = [
            ...InvalidTypeGuardInputTestCases,
            [false, "date filter", dateFilter],
            [true, "attribute filter", attributeFilter],
            [false, "measure value filter", measureValueFilter],
        ];

        it.each(Scenarios)("should return %s when input is %s", (expectedResult, _desc, input) => {
            expect(isAttributeFilter(input)).toBe(expectedResult);
        });
    });

    describe("isMeasureValueFilter", () => {
        const Scenarios: Array<[boolean, string, any]> = [
            ...InvalidTypeGuardInputTestCases,
            [false, "date filter", dateFilter],
            [false, "attribute filter", attributeFilter],
            [true, "measure value filter", measureValueFilter],
        ];

        it.each(Scenarios)("should return %s when input is %s", (expectedResult, _desc, input) => {
            expect(isMeasureValueFilter(input)).toBe(expectedResult);
        });
    });
});
