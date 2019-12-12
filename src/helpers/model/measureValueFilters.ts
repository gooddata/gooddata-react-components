// (C) 2019 GoodData Corporation
import isEmpty = require("lodash/isEmpty");
import invariant = require("invariant");
import { AFM } from "@gooddata/typings";
import {
    IValue,
    IMeasureValueComparisonFilter,
    IMeasureValueRangeFilter,
    isRangeOperator,
    isComparisonOperator,
    MeasureValueFilterConditionOperator,
} from "../../interfaces/MeasureValueFilter";

const getComparisonFilter = (
    measureLocalIdentifier: string,
    operator: AFM.ComparisonConditionOperator,
    value: IValue,
): AFM.IMeasureValueFilter => ({
    measureValueFilter: {
        measure: {
            localIdentifier: measureLocalIdentifier,
        },
        condition: {
            comparison: {
                operator,
                value: (value && value.value) || 0,
            },
        },
    },
});

const getRangeFilter = (
    measureLocalIdentifier: string,
    operator: AFM.RangeConditionOperator,
    value: IValue,
): AFM.IMeasureValueFilter => ({
    measureValueFilter: {
        measure: {
            localIdentifier: measureLocalIdentifier,
        },
        condition: {
            range: {
                operator,
                from: (value && value.from) || 0,
                to: (value && value.to) || 0,
            },
        },
    },
});

function getFilter(measureLocalIdentifier: string, operator: string, value: IValue) {
    if (isComparisonOperator(operator)) {
        return getComparisonFilter(measureLocalIdentifier, operator, value);
    } else if (isRangeOperator(operator)) {
        return getRangeFilter(measureLocalIdentifier, operator, value);
    }
    invariant(operator, `Operator ${operator} is not supported, filter could not be created`);
}

const isComparisonCondition = (
    condition: AFM.MeasureValueFilterCondition,
): condition is AFM.IComparisonCondition =>
    !isEmpty(condition) && (condition as AFM.IComparisonCondition).comparison !== undefined;

const isRangeCondition = (condition: AFM.MeasureValueFilterCondition): condition is AFM.IRangeCondition =>
    !isEmpty(condition) && (condition as AFM.IRangeCondition).range !== undefined;

const isMeasureValueComparisonFilter = (
    filter: AFM.IMeasureValueFilter,
): filter is IMeasureValueComparisonFilter =>
    AFM.isMeasureValueFilter(filter) &&
    isComparisonCondition((filter as IMeasureValueComparisonFilter).measureValueFilter.condition);

const isMeasureValueRangeFilter = (filter: AFM.IMeasureValueFilter): filter is IMeasureValueRangeFilter =>
    AFM.isMeasureValueFilter(filter) &&
    isRangeCondition((filter as IMeasureValueRangeFilter).measureValueFilter.condition);

function getOperator(filter: AFM.IMeasureValueFilter): MeasureValueFilterConditionOperator {
    if (isMeasureValueComparisonFilter(filter)) {
        return filter.measureValueFilter.condition.comparison.operator;
    } else if (isMeasureValueRangeFilter(filter)) {
        return filter.measureValueFilter.condition.range.operator;
    }
    return null;
}

function getValue(filter: AFM.IMeasureValueFilter): IValue {
    if (isMeasureValueComparisonFilter(filter)) {
        return { value: filter.measureValueFilter.condition.comparison.value };
    } else if (isMeasureValueRangeFilter(filter)) {
        const { from, to } = filter.measureValueFilter.condition.range;
        return { from, to };
    }
    return null;
}

export const measureValueFilter = {
    isComparisonCondition,
    isRangeCondition,
    isComparisonOperator,
    isRangeOperator,
    isMeasureValueComparisonFilter,
    isMeasureValueRangeFilter,
    getFilter,
    getOperator,
    getValue,
};
