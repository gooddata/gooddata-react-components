// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { AFM } from "@gooddata/typings";

import { Dropdown } from "./Dropdown";
import {
    getMeasureValueFilterCondition,
    IMeasureValueFilterValue,
    isComparisonCondition,
    isRangeCondition,
} from "../../../interfaces/MeasureValueFilter";
import { IMeasureValueFilterCommonProps } from "./typings";

export interface IMeasureValueFilterDropdownProps extends IMeasureValueFilterCommonProps {
    onCancel: () => void;
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

function getTreatNullAsZeroValue(
    condition: AFM.MeasureValueFilterCondition,
    treatNullAsZeroDefaultValue: boolean,
): boolean {
    if (!condition) {
        return treatNullAsZeroDefaultValue !== undefined && treatNullAsZeroDefaultValue;
    }

    return (
        (isComparisonCondition(condition) && condition.comparison.treatNullValuesAs !== undefined) ||
        (isRangeCondition(condition) && condition.range.treatNullValuesAs !== undefined) ||
        false
    );
}

export class MeasureValueFilterDropdown extends React.PureComponent<IMeasureValueFilterDropdownProps> {
    public static defaultProps: Partial<IMeasureValueFilterDropdownProps> = {
        displayTreatNullAsZeroOption: false,
        treatNullAsZeroDefaultValue: false,
    };

    public render() {
        const {
            filter,
            onCancel,
            usePercentage,
            warningMessage,
            locale,
            anchorEl,
            separators,
            displayTreatNullAsZeroOption,
            treatNullAsZeroDefaultValue,
        } = this.props;
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
                separators={separators}
                displayTreatNullAsZeroOption={displayTreatNullAsZeroOption}
                treatNullAsZeroValue={getTreatNullAsZeroValue(condition, treatNullAsZeroDefaultValue)}
            />
        );
    }

    private onApply = (operator: string, value: IMeasureValueFilterValue, treatNullValuesAsZero: boolean) => {
        const { filter, onApply } = this.props;

        const condition = getMeasureValueFilterCondition(operator, value, treatNullValuesAsZero);

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
