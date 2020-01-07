// (C) 2019-2020 GoodData Corporation
import invariant = require("invariant");
import { AFM } from "@gooddata/typings";
import { IValue, isRangeOperator, isComparisonOperator } from "../../interfaces/MeasureValueFilter";

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

export function measureValueFilter(measureLocalIdentifier: string, operator: string, value: IValue) {
    if (isComparisonOperator(operator)) {
        return getComparisonFilter(measureLocalIdentifier, operator, value);
    } else if (isRangeOperator(operator)) {
        return getRangeFilter(measureLocalIdentifier, operator, value);
    }
    invariant(operator, `Operator ${operator} is not supported, filter could not be created`);
}

export const getDefaultFilter = (measureLocalIdentifier: string) => ({
    measureValueFilter: {
        measure: {
            localIdentifier: measureLocalIdentifier,
        },
    },
});
