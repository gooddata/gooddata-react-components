// (C) 2019 GoodData Corporation
import * as Operators from "../constants/measureValueFilterOperators";

export const getOperatorTranslationKey = (operator: string) => {
    const translationKeysDictionary = {
        [Operators.ALL]: "all",
        [Operators.GREATER_THAN]: "greaterThan",
        [Operators.GREATER_THAN_OR_EQUAL_TO]: "greaterThanOrEqualTo",
        [Operators.LESS_THAN]: "lessThan",
        [Operators.LESS_THAN_OR_EQUAL_TO]: "lessThanOrEqualTo",
        [Operators.BETWEEN]: "between",
        [Operators.NOT_BETWEEN]: "notBetween",
    };

    return `mvf.operator.${translationKeysDictionary[operator]}`;
};

export const getOperatorIcon = (operator: string) => {
    const iconNamesDictionary = {
        [Operators.ALL]: "all",
        [Operators.GREATER_THAN]: "greater-than",
        [Operators.GREATER_THAN_OR_EQUAL_TO]: "greater-than-equal-to",
        [Operators.LESS_THAN]: "less-than",
        [Operators.LESS_THAN_OR_EQUAL_TO]: "less-than-equal-to",
        [Operators.BETWEEN]: "between",
        [Operators.NOT_BETWEEN]: "not-between",
    };

    return iconNamesDictionary[operator];
};
