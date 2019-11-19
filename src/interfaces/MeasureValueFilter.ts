// (C) 2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import * as Operators from "../constants/measureValueFilterOperators";

export interface IValue {
    value?: number;
    from?: number;
    to?: number;
}

export type MeasureValueFilterConditionOperator =
    | AFM.ComparisonConditionOperator
    | AFM.RangeConditionOperator;

export const isComparisonTypeOperator = (operator: string): operator is AFM.ComparisonConditionOperator =>
    operator === Operators.GREATER_THAN ||
    operator === Operators.GREATER_THAN_OR_EQUAL_TO ||
    operator === Operators.LESS_THAN ||
    operator === Operators.LESS_THAN_OR_EQUAL_TO;

export const isRangeTypeOperator = (operator: string): operator is AFM.RangeConditionOperator =>
    operator === Operators.BETWEEN || operator === Operators.NOT_BETWEEN;

export interface IMeasureValueComparisonFilter {
    measureValueFilter: {
        measure: AFM.Qualifier;
        condition: AFM.IComparisonCondition;
    };
}

export interface IMeasureValueRangeFilter {
    measureValueFilter: {
        measure: AFM.Qualifier;
        condition: AFM.IRangeCondition;
    };
}
