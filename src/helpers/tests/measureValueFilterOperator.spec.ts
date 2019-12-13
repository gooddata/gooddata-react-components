// (C) 2007-2019 GoodData Corporation
import * as Operator from "../../constants/measureValueFilterOperators";
import { getOperatorTranslationKey, getOperatorIcon } from "../measureValueFilterOperator";

describe("getOperatorTranslationKey", () => {
    it.each`
        operator                             | result
        ${Operator.ALL}                      | ${"mvf.operator.all"}
        ${Operator.GREATER_THAN}             | ${"mvf.operator.greaterThan"}
        ${Operator.GREATER_THAN_OR_EQUAL_TO} | ${"mvf.operator.greaterThanOrEqualTo"}
        ${Operator.LESS_THAN}                | ${"mvf.operator.lessThan"}
        ${Operator.LESS_THAN_OR_EQUAL_TO}    | ${"mvf.operator.lessThanOrEqualTo"}
        ${Operator.EQUAL_TO}                 | ${"mvf.operator.equalTo"}
        ${Operator.NOT_EQUAL_TO}             | ${"mvf.operator.notEqualTo"}
        ${Operator.BETWEEN}                  | ${"mvf.operator.between"}
        ${Operator.NOT_BETWEEN}              | ${"mvf.operator.notBetween"}
    `("should return $result translation key for $operator operator", ({ operator, result }) => {
        expect(getOperatorTranslationKey(operator)).toBe(result);
    });
});

describe("getOperatorIcon", () => {
    it.each`
        operator                             | result
        ${Operator.ALL}                      | ${"all"}
        ${Operator.GREATER_THAN}             | ${"greater-than"}
        ${Operator.GREATER_THAN_OR_EQUAL_TO} | ${"greater-than-equal-to"}
        ${Operator.LESS_THAN}                | ${"less-than"}
        ${Operator.LESS_THAN_OR_EQUAL_TO}    | ${"less-than-equal-to"}
        ${Operator.EQUAL_TO}                 | ${"equal-to"}
        ${Operator.NOT_EQUAL_TO}             | ${"not-equal-to"}
        ${Operator.BETWEEN}                  | ${"between"}
        ${Operator.NOT_BETWEEN}              | ${"not-between"}
    `("should return $result for $operator operator", ({ operator, result }) => {
        expect(getOperatorIcon(operator)).toBe(result);
    });
});
