// (C) 2019 GoodData Corporation
import * as Operator from "../constants/measureValueFilterOperators";

export const getOperatorTranslationKey = (operator: string) => {
    const translationKeysDictionary = {
        [Operator.ALL]: "all",
        [Operator.GREATER_THAN]: "greaterThan",
        [Operator.GREATER_THAN_OR_EQUAL_TO]: "greaterThanOrEqualTo",
        [Operator.LESS_THAN]: "lessThan",
        [Operator.LESS_THAN_OR_EQUAL_TO]: "lessThanOrEqualTo",
        [Operator.EQUAL_TO]: "equalTo",
        [Operator.NOT_EQUAL_TO]: "notEqualTo",
        [Operator.BETWEEN]: "between",
        [Operator.NOT_BETWEEN]: "notBetween",
    };

    return `mvf.operator.${translationKeysDictionary[operator]}`;
};

export const getOperatorIcon = (operator: string) => {
    const iconNamesDictionary = {
        [Operator.ALL]: "all",
        [Operator.GREATER_THAN]: "greater-than",
        [Operator.GREATER_THAN_OR_EQUAL_TO]: "greater-than-equal-to",
        [Operator.LESS_THAN]: "less-than",
        [Operator.LESS_THAN_OR_EQUAL_TO]: "less-than-equal-to",
        [Operator.EQUAL_TO]: "equal-to",
        [Operator.NOT_EQUAL_TO]: "not-equal-to",
        [Operator.BETWEEN]: "between",
        [Operator.NOT_BETWEEN]: "not-between",
    };

    return iconNamesDictionary[operator];
};
