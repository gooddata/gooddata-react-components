// (C) 2019 GoodData Corporation
import isEmpty = require("lodash/isEmpty");
import invariant = require("invariant");
import { AFM } from "@gooddata/typings";
import {
    IValue,
    IMeasureValueComparisonFilter,
    IMeasureValueRangeFilter,
    isRangeTypeOperator,
    isComparisonTypeOperator,
    MeasureValueFilterConditionOperator,
} from "../../interfaces/MeasureValueFilter";
import { getQualifier } from "./utils";

const getComparisonFilter = (
    identifier: string,
    operator: AFM.ComparisonConditionOperator,
    value: IValue,
): AFM.IMeasureValueFilter => ({
    measureValueFilter: {
        measure: getQualifier(identifier),
        condition: {
            comparison: {
                operator,
                value: (value && value.value) || 0,
            },
        },
    },
});

const getRangeFilter = (
    identifier: string,
    operator: AFM.RangeConditionOperator,
    value: IValue,
): AFM.IMeasureValueFilter => ({
    measureValueFilter: {
        measure: getQualifier(identifier),
        condition: {
            range: {
                operator,
                from: (value && value.from) || 0,
                to: (value && value.to) || 0,
            },
        },
    },
});

function getFilter(identifier: string, operator: string, value: IValue) {
    if (isComparisonTypeOperator(operator)) {
        return getComparisonFilter(identifier, operator, value);
    } else if (isRangeTypeOperator(operator)) {
        return getRangeFilter(identifier, operator, value);
    }

    invariant(operator, `Operator ${operator} is not supported, filter could not be created`);
}

const isComparisonCondition = (condition: any): condition is AFM.IComparisonCondition =>
    !isEmpty(condition) && typeof (condition as AFM.IComparisonCondition).comparison !== "undefined";

const isRangeCondition = (condition: any): condition is AFM.IRangeCondition =>
    !isEmpty(condition) && typeof (condition as AFM.IRangeCondition).range !== "undefined";

const isMeasureValueComparisonFilter = (obj: any): obj is IMeasureValueComparisonFilter =>
    !isEmpty(obj) &&
    isComparisonCondition((obj as IMeasureValueComparisonFilter).measureValueFilter.condition);

const isMeasureValueRangeFilter = (obj: any): obj is IMeasureValueRangeFilter =>
    !isEmpty(obj) && isRangeCondition((obj as IMeasureValueRangeFilter).measureValueFilter.condition);

function measureValueFilterOperator(filter: AFM.IMeasureValueFilter): MeasureValueFilterConditionOperator {
    if (isMeasureValueComparisonFilter(filter)) {
        return filter.measureValueFilter.condition.comparison.operator;
    } else if (isMeasureValueRangeFilter(filter)) {
        return filter.measureValueFilter.condition.range.operator;
    }

    return null;
}

function measureValueFilterValue(filter: AFM.IMeasureValueFilter): IValue {
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
    isComparisonTypeOperator,
    isRangeTypeOperator,
    getFilter,
    isMeasureValueComparisonFilter,
    isMeasureValueRangeFilter,
    measureValueFilterOperator,
    measureValueFilterValue,
};
