// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { AFM } from "@gooddata/typings";
import {
    IValue,
    MeasureValueFilterConditionOperator,
    IMeasureValueRangeFilter,
    IMeasureValueComparisonFilter,
} from "../../../interfaces/MeasureValueFilter";
import { Dropdown } from "./Dropdown";
import Factory from "../../../factory/measureValueFilterFactory";

export interface IDropdownProps {
    filter: AFM.IMeasureValueFilter;
    onApply: (filter: AFM.IMeasureValueFilter) => void;
    onCancel: () => void;
    locale?: string;
    anchorEl?: EventTarget | string;
}

export class DropdownAfmWrapper extends React.PureComponent<IDropdownProps> {
    public render() {
        const { filter, onCancel, locale, anchorEl } = this.props;

        return (
            <Dropdown
                onApply={this.onApply}
                onCancel={onCancel}
                operator={extractOperator(filter)}
                value={extractValue(filter)}
                locale={locale}
                anchorEl={anchorEl}
            />
        );
    }

    private onApply = (operator: string, value: IValue) => {
        const { onApply, filter } = this.props;
        const updatedFilter = Factory.buildFilter(filter, operator, value);
        onApply(updatedFilter);
    };
}

export const isMeasureValueComparisonFilter = (
    filter: AFM.IMeasureValueFilter,
): filter is IMeasureValueComparisonFilter =>
    AFM.isMeasureValueFilter(filter) &&
    AFM.isComparisonCondition((filter as IMeasureValueComparisonFilter).measureValueFilter.condition);

export const isMeasureValueRangeFilter = (
    filter: AFM.IMeasureValueFilter,
): filter is IMeasureValueRangeFilter =>
    AFM.isMeasureValueFilter(filter) &&
    AFM.isRangeCondition((filter as IMeasureValueRangeFilter).measureValueFilter.condition);

export const extractOperator = (filter: AFM.IMeasureValueFilter): MeasureValueFilterConditionOperator => {
    if (isMeasureValueComparisonFilter(filter)) {
        return filter.measureValueFilter.condition.comparison.operator;
    } else if (isMeasureValueRangeFilter(filter)) {
        return filter.measureValueFilter.condition.range.operator;
    }
    return null;
};

export const extractValue = (filter: AFM.IMeasureValueFilter): IValue => {
    if (isMeasureValueComparisonFilter(filter)) {
        return { value: filter.measureValueFilter.condition.comparison.value };
    } else if (isMeasureValueRangeFilter(filter)) {
        const { from, to } = filter.measureValueFilter.condition.range;
        return { from, to };
    }
    return null;
};
