// (C) 2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import * as Operator from "../constants/measureValueFilterOperators";

export interface IValue {
    value?: number;
    from?: number;
    to?: number;
}

export type MeasureValueFilterConditionOperator =
    | AFM.ComparisonConditionOperator
    | AFM.RangeConditionOperator;

export const isComparisonOperator = (operator: string): operator is AFM.ComparisonConditionOperator =>
    operator === Operator.GREATER_THAN ||
    operator === Operator.GREATER_THAN_OR_EQUAL_TO ||
    operator === Operator.LESS_THAN ||
    operator === Operator.LESS_THAN_OR_EQUAL_TO ||
    operator === Operator.EQUAL_TO ||
    operator === Operator.NOT_EQUAL_TO;

export const isRangeOperator = (operator: string): operator is AFM.RangeConditionOperator =>
    operator === Operator.BETWEEN || operator === Operator.NOT_BETWEEN;

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
