// (C) 2019-2020 GoodData Corporation
import * as React from "react";

import { AFM, VisualizationInput } from "@gooddata/typings";

import { Dropdown } from "./Dropdown";
import {
    getMeasureValueFilterCondition,
    IMeasureValueFilterValue,
    isComparisonCondition,
    isRangeCondition,
} from "../../../interfaces/MeasureValueFilter";

export interface IDropdownProps {
    filter: VisualizationInput.IMeasureValueFilter;
    onApply: (filter: AFM.IMeasureValueFilter) => void;
    onCancel: () => void;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    anchorEl?: EventTarget | string;
}

function getOperator(condition: AFM.MeasureValueFilterCondition): string {
    if (isComparisonCondition(condition)) {
        return condition.comparison.operator;
    } else if (isRangeCondition(condition)) {
        return condition.range.operator;
    }
    return null;
}

function getValue(condition: AFM.MeasureValueFilterCondition): IMeasureValueFilterValue {
    if (isComparisonCondition(condition)) {
        return { value: condition.comparison.value };
    } else if (isRangeCondition(condition)) {
        const { from, to } = condition.range;
        return { from, to };
    }
    return null;
}

export class DropdownAfmWrapper extends React.PureComponent<IDropdownProps> {
    public render() {
        const { filter, onCancel, usePercentage, warningMessage, locale, anchorEl } = this.props;
        const condition = filter ? filter.measureValueFilter.condition : null;

        return (
            <Dropdown
                onApply={this.onApply}
                onCancel={onCancel}
                operator={getOperator(condition)}
                value={getValue(condition)}
                usePercentage={usePercentage}
                warningMessage={warningMessage}
                locale={locale}
                anchorEl={anchorEl}
            />
        );
    }

    private onApply = (operator: string, value: IMeasureValueFilterValue) => {
        const { filter, onApply } = this.props;

        const condition = getMeasureValueFilterCondition(operator, value);

        let resultFilter;
        if (condition === null) {
            resultFilter = {
                measureValueFilter: {
                    measure: filter.measureValueFilter.measure,
                },
            };
        } else {
            resultFilter = {
                measureValueFilter: {
                    ...filter.measureValueFilter,
                    condition,
                },
            };
        }

        onApply(resultFilter);
    };
}
