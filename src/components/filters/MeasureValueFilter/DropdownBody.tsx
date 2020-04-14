// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "@gooddata/goodstrap/lib/Button/Button";

import { ISeparators } from "./separators";
import { IntlWrapper } from "../../core/base/IntlWrapper";
import OperatorDropdown from "./OperatorDropdown";
import RangeInput from "./RangeInput";
import ComparisonInput from "./ComparisonInput";
import {
    IMeasureValueFilterValue,
    isComparisonOperator,
    isRangeOperator,
} from "../../../interfaces/MeasureValueFilter";
import * as Operator from "../../../constants/measureValueFilterOperators";
import TreatNullValuesAsZeroCheckbox from "./TreatNullValuesAsZeroCheckbox";

// The platform supports 6 decimal places
const MAX_DECIMAL_PLACES = 6;

interface IDropdownBodyOwnProps {
    operator?: string;
    value?: IMeasureValueFilterValue;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    disableAutofocus?: boolean;
    onCancel?: () => void;
    onApply: (operator: string, value: IMeasureValueFilterValue, treatNullValuesAsZero: boolean) => void;
    separators?: ISeparators;
    displayTreatNullAsZeroOption?: boolean;
    treatNullAsZeroValue?: boolean;
}

type IDropdownBodyProps = IDropdownBodyOwnProps & WrappedComponentProps;

interface IDropdownBodyState {
    operator: string;
    value: IMeasureValueFilterValue;
    enabledTreatNullValuesAsZero: boolean;
}

class DropdownBodyWrapped extends React.PureComponent<IDropdownBodyProps, IDropdownBodyState> {
    constructor(props: IDropdownBodyProps) {
        super(props);

        const { operator, value, usePercentage, treatNullAsZeroValue } = props;

        this.state = {
            operator: operator || Operator.ALL,
            value: (usePercentage ? this.convertToPercentageValue(value, operator) : value) || {},
            enabledTreatNullValuesAsZero: treatNullAsZeroValue,
        };
    }

    public render() {
        const { onCancel, warningMessage, displayTreatNullAsZeroOption, intl } = this.props;
        const { operator, enabledTreatNullValuesAsZero } = this.state;

        return (
            <div className="gd-mvf-dropdown-body gd-dialog gd-dropdown overlay s-mvf-dropdown-body">
                <div className="gd-mvf-dropdown-content">
                    {warningMessage && (
                        <div className="gd-mvf-dropdown-section">
                            <div className="gd-mvf-warning-message s-mvf-warning-message">
                                {warningMessage}
                            </div>
                        </div>
                    )}
                    <div className="gd-mvf-dropdown-section">
                        <OperatorDropdown onSelect={this.handleOperatorSelection} operator={operator} />
                    </div>

                    {operator !== Operator.ALL && (
                        <div className="gd-mvf-dropdown-section">
                            {this.renderInputSection()}
                            {displayTreatNullAsZeroOption && (
                                <TreatNullValuesAsZeroCheckbox
                                    onChange={this.handleTreatNullAsZeroClicked}
                                    checked={enabledTreatNullValuesAsZero}
                                    intl={intl}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="gd-mvf-dropdown-footer">
                    <Button
                        className="gd-button-secondary gd-button-small s-mvf-dropdown-cancel"
                        onClick={onCancel}
                        value={intl.formatMessage({ id: "cancel" })}
                    />
                    <Button
                        className="gd-button-action gd-button-small s-mvf-dropdown-apply"
                        onClick={this.onApply}
                        value={intl.formatMessage({ id: "apply" })}
                        disabled={this.isApplyButtonDisabled()}
                    />
                </div>
            </div>
        );
    }

    private renderInputSection = () => {
        const { usePercentage, disableAutofocus, separators } = this.props;
        const {
            operator,
            value: { value = null, from = null, to = null },
        } = this.state;

        if (isComparisonOperator(operator)) {
            return (
                <ComparisonInput
                    value={value}
                    usePercentage={usePercentage}
                    onValueChange={this.handleValueChange}
                    onEnterKeyPress={this.onApply}
                    disableAutofocus={disableAutofocus}
                    separators={separators}
                />
            );
        } else if (isRangeOperator(operator)) {
            return (
                <RangeInput
                    from={from}
                    to={to}
                    usePercentage={usePercentage}
                    onFromChange={this.handleFromChange}
                    onToChange={this.handleToChange}
                    onEnterKeyPress={this.onApply}
                    disableAutofocus={disableAutofocus}
                    separators={separators}
                />
            );
        }

        return null;
    };

    private isApplyButtonDisabledForComparison() {
        const { value = null } = this.state.value;

        if (value === null) {
            return true;
        }

        if (this.props.value === null || this.isChanged()) {
            return false;
        }

        if (this.props.usePercentage) {
            return value === this.round(this.props.value.value * 100);
        }

        return value === this.props.value.value;
    }

    private isApplyButtonDisabledForRange() {
        const { from = null, to = null } = this.state.value;

        if (from === null || to === null) {
            return true;
        }

        if (this.props.value === null || this.isChanged()) {
            return false;
        }

        if (this.props.usePercentage) {
            return (
                from === this.round(this.props.value.from * 100) &&
                to === this.round(this.props.value.to * 100)
            );
        }

        return from === this.props.value.from && to === this.props.value.to;
    }

    private isChanged = () =>
        this.state.operator !== this.props.operator ||
        this.state.enabledTreatNullValuesAsZero !== this.props.treatNullAsZeroValue;

    private isApplyButtonDisabledForAll() {
        return this.props.operator === Operator.ALL;
    }

    private isApplyButtonDisabled = () => {
        const { operator } = this.state;

        if (isComparisonOperator(operator)) {
            return this.isApplyButtonDisabledForComparison();
        }

        if (isRangeOperator(operator)) {
            return this.isApplyButtonDisabledForRange();
        }

        return this.isApplyButtonDisabledForAll();
    };

    private handleOperatorSelection = (operator: string) => this.setState({ operator });

    private handleValueChange = (value: number) => {
        this.setState({ value: { ...this.state.value, value } });
    };

    private handleFromChange = (from: number) => {
        this.setState({ value: { ...this.state.value, from } });
    };

    private handleToChange = (to: number) => {
        this.setState({ value: { ...this.state.value, to } });
    };

    private handleTreatNullAsZeroClicked = (checked: boolean) => {
        this.setState({ enabledTreatNullValuesAsZero: checked });
    };

    private round = (n: number): number => parseFloat(n.toFixed(MAX_DECIMAL_PLACES));

    private convertToRawValue = (
        value: IMeasureValueFilterValue,
        operator: string,
    ): IMeasureValueFilterValue => {
        if (!value || operator === Operator.ALL) {
            return value;
        }
        return isComparisonOperator(operator)
            ? { value: this.round(value.value / 100) }
            : { from: this.round(value.from / 100), to: this.round(value.to / 100) };
    };

    private convertToPercentageValue = (
        value: IMeasureValueFilterValue,
        operator: string,
    ): IMeasureValueFilterValue => {
        if (!value || operator === Operator.ALL) {
            return value;
        }
        return isComparisonOperator(operator)
            ? { value: this.round(value.value * 100) }
            : { from: this.round(value.from * 100), to: this.round(value.to * 100) };
    };

    private onApply = () => {
        if (this.isApplyButtonDisabled()) {
            return;
        }

        const { enabledTreatNullValuesAsZero, operator: stateOperator, value: stateValue } = this.state;
        const { usePercentage } = this.props;

        const operator = stateOperator === Operator.ALL ? null : stateOperator;
        const value = usePercentage ? this.convertToRawValue(stateValue, stateOperator) : stateValue;

        this.props.onApply(operator, value, enabledTreatNullValuesAsZero);
    };
}

export const DropdownBodyWithIntl = injectIntl(DropdownBodyWrapped);

export class DropdownBody extends React.PureComponent<IDropdownBodyOwnProps> {
    public render() {
        return (
            <IntlWrapper locale={this.props.locale}>
                <DropdownBodyWithIntl {...this.props} />
            </IntlWrapper>
        );
    }
}
