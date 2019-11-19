// (C) 2007-2019 GoodData Corporation
import * as Operators from "../../constants/measureValueFilterOperators";
import { getOperatorTranslationKey, getOperatorIcon } from "../measureValueFilterOperator";

describe("getOperatorTranslationKey", () => {
    it.each`
        operator                              | result
        ${Operators.ALL}                      | ${"mvf.operator.all"}
        ${Operators.GREATER_THAN}             | ${"mvf.operator.greaterThan"}
        ${Operators.GREATER_THAN_OR_EQUAL_TO} | ${"mvf.operator.greaterThanOrEqualTo"}
        ${Operators.LESS_THAN}                | ${"mvf.operator.lessThan"}
        ${Operators.LESS_THAN_OR_EQUAL_TO}    | ${"mvf.operator.lessThanOrEqualTo"}
        ${Operators.BETWEEN}                  | ${"mvf.operator.between"}
        ${Operators.NOT_BETWEEN}              | ${"mvf.operator.notBetween"}
    `("should return $result translation key for $operator operator", ({ operator, result }) => {
        expect(getOperatorTranslationKey(operator)).toBe(result);
    });
});

describe("getOperatorIcon", () => {
    it.each`
        operator                              | result
        ${Operators.ALL}                      | ${"all"}
        ${Operators.GREATER_THAN}             | ${"greater-than"}
        ${Operators.GREATER_THAN_OR_EQUAL_TO} | ${"greater-than-equal-to"}
        ${Operators.LESS_THAN}                | ${"less-than"}
        ${Operators.LESS_THAN_OR_EQUAL_TO}    | ${"less-than-equal-to"}
        ${Operators.BETWEEN}                  | ${"between"}
        ${Operators.NOT_BETWEEN}              | ${"not-between"}
    `("should return $result for $operator operator", ({ operator, result }) => {
        expect(getOperatorIcon(operator)).toBe(result);
    });
});
