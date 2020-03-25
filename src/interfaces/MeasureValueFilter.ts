// (C) 2019-2020 GoodData Corporation
import isEmpty = require("lodash/isEmpty");

import { AFM } from "@gooddata/typings";
import * as Operator from "../constants/measureValueFilterOperators";

export interface IMeasureValueFilterValue {
    value?: number;
    from?: number;
    to?: number;
}

export const isComparisonOperator = (operator: string): operator is AFM.ComparisonConditionOperator =>
    operator === Operator.GREATER_THAN ||
    operator === Operator.GREATER_THAN_OR_EQUAL_TO ||
    operator === Operator.LESS_THAN ||
    operator === Operator.LESS_THAN_OR_EQUAL_TO ||
    operator === Operator.EQUAL_TO ||
    operator === Operator.NOT_EQUAL_TO;

export const isRangeOperator = (operator: string): operator is AFM.RangeConditionOperator =>
    operator === Operator.BETWEEN || operator === Operator.NOT_BETWEEN;

export const isComparisonCondition = (
    condition: AFM.MeasureValueFilterCondition,
): condition is AFM.IComparisonCondition =>
    !isEmpty(condition) && (condition as AFM.IComparisonCondition).comparison !== undefined;

export const isRangeCondition = (
    condition: AFM.MeasureValueFilterCondition,
): condition is AFM.IRangeCondition =>
    !isEmpty(condition) && (condition as AFM.IRangeCondition).range !== undefined;

export const getMeasureValueFilterCondition = (
    operator: string,
    value: IMeasureValueFilterValue,
    treatNullValuesAsZero: boolean,
): AFM.MeasureValueFilterCondition => {
    const treatNullValuesAsProperty = treatNullValuesAsZero ? { treatNullValuesAs: 0 } : {};

    if (isComparisonOperator(operator)) {
        return {
            comparison: {
                operator,
                value: value.value || 0,
                ...treatNullValuesAsProperty,
            },
        };
    } else if (isRangeOperator(operator)) {
        return {
            range: {
                operator,
                from: value.from || 0,
                to: value.to || 0,
                ...treatNullValuesAsProperty,
            },
        };
    }

    return null;
};
