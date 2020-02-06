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

// The platform supports 6 decimal places
const MAX_DECIMAL_PLACES = 6;

export interface IDropdownBodyOwnProps {
    operator?: string;
    value?: IMeasureValueFilterValue;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    disableAutofocus?: boolean;
    onCancel?: () => void;
    onApply: (operator: string, value: IMeasureValueFilterValue) => void;
    separators?: ISeparators;
}

export type IDropdownBodyProps = IDropdownBodyOwnProps & WrappedComponentProps;

interface IDropdownBodyState {
    operator: string;
    value: IMeasureValueFilterValue;
}

class DropdownBodyWrapped extends React.PureComponent<IDropdownBodyProps, IDropdownBodyState> {
    constructor(props: IDropdownBodyProps) {
        super(props);

        const { operator, value, usePercentage } = props;

        this.state = {
            operator: operator || Operator.ALL,
            value: (usePercentage ? this.convertToPercentageValue(value, operator) : value) || {},
        };
    }

    public render() {
        const { onCancel, warningMessage, intl } = this.props;
        const { operator } = this.state;

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
                        <div className="gd-mvf-dropdown-section">{this.renderInputSection()}</div>
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

        if (this.props.value === null) {
            return false;
        }

        if (this.state.operator !== this.props.operator) {
            return false;
        }

        return value === this.props.value.value;
    }

    private isApplyButtonDisabledForRange() {
        const { from = null, to = null } = this.state.value;

        if (from === null || to === null) {
            return true;
        }

        if (this.props.value === null) {
            return false;
        }

        if (this.state.operator !== this.props.operator) {
            return false;
        }

        return from === this.props.value.from && to === this.props.value.to;
    }

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

        const { usePercentage } = this.props;

        const operator = this.state.operator === Operator.ALL ? null : this.state.operator;

        const value = usePercentage
            ? this.convertToRawValue(this.state.value, this.state.operator)
            : this.state.value;

        this.props.onApply(operator, value);
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
