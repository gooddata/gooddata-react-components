// (C) 2019-2020 GoodData Corporation
import invariant = require("invariant");
import { AFM } from "@gooddata/typings";
import { IValue, isComparisonOperator, isRangeOperator } from "../interfaces/MeasureValueFilter";
import * as Operator from "../constants/measureValueFilterOperators";

const buildFilter = (
    filter: AFM.IMeasureValueFilter,
    operator: string,
    value?: IValue,
): AFM.IMeasureValueFilter => {
    const condition = buildCondition(operator, value);
    return {
        measureValueFilter: {
            measure: filter.measureValueFilter.measure,
            ...condition,
        },
    };
};

const buildCondition = (operator: string, values?: IValue) => {
    if (isComparisonOperator(operator)) {
        const { value } = values;
        return {
            condition: {
                comparison: {
                    operator,
                    value: value || 0,
                },
            },
        };
    } else if (isRangeOperator(operator)) {
        const { from, to } = values;
        return {
            condition: {
                range: {
                    operator,
                    from: from || 0,
                    to: to || 0,
                },
            },
        };
    } else if (operator === Operator.ALL) {
        return {};
    }

    invariant(operator, `Operator ${operator} is not supported, filter could not be created`);
};

export default {
    buildFilter,
};
