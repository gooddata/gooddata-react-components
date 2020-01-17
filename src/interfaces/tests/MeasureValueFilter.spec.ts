// (C) 2007-2020 GoodData Corporation
import {
    isComparisonOperator,
    isRangeOperator,
    isComparisonCondition,
    isRangeCondition,
} from "../MeasureValueFilter";
import * as Operator from "../../constants/measureValueFilterOperators";
import { InvalidTypeGuardInputTestCases } from "../../helpers/model/tests/invalid_type_guard_mocks";
import { AFM } from "@gooddata/typings";

describe("isComparisonOperator", () => {
    it.each`
        operator                             | result
        ${Operator.GREATER_THAN}             | ${true}
        ${Operator.GREATER_THAN_OR_EQUAL_TO} | ${true}
        ${Operator.LESS_THAN}                | ${true}
        ${Operator.LESS_THAN_OR_EQUAL_TO}    | ${true}
        ${Operator.EQUAL_TO}                 | ${true}
        ${Operator.NOT_EQUAL_TO}             | ${true}
        ${Operator.BETWEEN}                  | ${false}
        ${Operator.NOT_BETWEEN}              | ${false}
        ${null}                              | ${false}
        ${undefined}                         | ${false}
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isComparisonOperator(operator)).toEqual(result);
    });
});

describe("isRangeOperator", () => {
    it.each`
        operator                             | result
        ${Operator.BETWEEN}                  | ${true}
        ${Operator.NOT_BETWEEN}              | ${true}
        ${Operator.GREATER_THAN}             | ${false}
        ${Operator.GREATER_THAN_OR_EQUAL_TO} | ${false}
        ${Operator.LESS_THAN}                | ${false}
        ${Operator.LESS_THAN_OR_EQUAL_TO}    | ${false}
        ${Operator.EQUAL_TO}                 | ${false}
        ${Operator.NOT_EQUAL_TO}             | ${false}
        ${"SOMETHING_ELSE"}                  | ${false}
        ${null}                              | ${false}
        ${undefined}                         | ${false}
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isRangeOperator(operator)).toEqual(result);
    });
});

const comparisonCondition: AFM.IComparisonCondition = {
    comparison: {
        operator: Operator.GREATER_THAN,
        value: 100,
    },
};

const rangeCondition: AFM.IRangeCondition = {
    range: {
        operator: Operator.BETWEEN,
        from: 100,
        to: 300,
    },
};

describe("isComparisonCondition", () => {
    const Scenarios: Array<[boolean, string, any]> = [
        ...InvalidTypeGuardInputTestCases,
        [true, "comparison measure value filter condition", comparisonCondition],
        [false, "range measure value filter condition", rangeCondition],
    ];

    it.each(Scenarios)("should return %s when input is %s", (expectedResult, _desc, input) => {
        expect(isComparisonCondition(input)).toBe(expectedResult);
    });
});

describe("isRangeCondition", () => {
    const Scenarios: Array<[boolean, string, any]> = [
        ...InvalidTypeGuardInputTestCases,
        [false, "comparison measure value filter condition", comparisonCondition],
        [true, "range measure value filter condition", rangeCondition],
    ];

    it.each(Scenarios)("should return %s when input is %s", (expectedResult, _desc, input) => {
        expect(isRangeCondition(input)).toBe(expectedResult);
    });
});
