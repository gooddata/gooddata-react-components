// (C) 2007-2019 GoodData Corporation
import { isComparisonOperator, isRangeOperator } from "../MeasureValueFilter";
import * as Operator from "../../constants/measureValueFilterOperators";

describe("isComparisonTypeOperator", () => {
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
        ${"SOMETHING_ELSE"}                  | ${false}
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isComparisonOperator(operator)).toEqual(result);
    });
});

describe("isRangeTypeOperator", () => {
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
    `("should return $result for given $operator operator", ({ operator, result }) => {
        expect(isRangeOperator(operator)).toEqual(result);
    });
});
