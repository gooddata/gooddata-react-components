// (C) 2007-2019 GoodData Corporation
import { isComparisonTypeOperator, isRangeTypeOperator } from "../MeasureValueFilter";
import * as Operators from "../../constants/measureValueFilterOperators";

describe("isComparisonTypeOperator", () => {
    it.each`
        operator                              | result
        ${Operators.GREATER_THAN}             | ${true}
        ${Operators.GREATER_THAN_OR_EQUAL_TO} | ${true}
        ${Operators.LESS_THAN}                | ${true}
        ${Operators.LESS_THAN_OR_EQUAL_TO}    | ${true}
        ${Operators.BETWEEN}                  | ${false}
        ${Operators.NOT_BETWEEN}              | ${false}
        ${"SOMETHING_ELSE"}                   | ${false}
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isComparisonTypeOperator(operator)).toEqual(result);
    });
});

describe("isRangeTypeOperator", () => {
    it.each`
        operator                              | result
        ${Operators.BETWEEN}                  | ${true}
        ${Operators.NOT_BETWEEN}              | ${true}
        ${Operators.GREATER_THAN}             | ${false}
        ${Operators.GREATER_THAN_OR_EQUAL_TO} | ${false}
        ${Operators.LESS_THAN}                | ${false}
        ${Operators.LESS_THAN_OR_EQUAL_TO}    | ${false}
        ${"SOMETHING_ELSE"}                   | ${false}
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isRangeTypeOperator(operator)).toEqual(result);
    });
});
