// (C) 2019-2020 GoodData Corporation
import * as Operator from "../constants/measureValueFilterOperators";

const translationKeysDictionary = {
    [Operator.ALL]: "mvf.operator.all",
    [Operator.GREATER_THAN]: "mvf.operator.greaterThan",
    [Operator.GREATER_THAN_OR_EQUAL_TO]: "mvf.operator.greaterThanOrEqualTo",
    [Operator.LESS_THAN]: "mvf.operator.lessThan",
    [Operator.LESS_THAN_OR_EQUAL_TO]: "mvf.operator.lessThanOrEqualTo",
    [Operator.EQUAL_TO]: "mvf.operator.equalTo",
    [Operator.NOT_EQUAL_TO]: "mvf.operator.notEqualTo",
    [Operator.BETWEEN]: "mvf.operator.between",
    [Operator.NOT_BETWEEN]: "mvf.operator.notBetween",
};

export const getOperatorTranslationKey = (operator: string) => {
    return translationKeysDictionary[operator];
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
