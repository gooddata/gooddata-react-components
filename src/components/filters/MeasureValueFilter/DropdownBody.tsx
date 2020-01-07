// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "@gooddata/goodstrap/lib/Button/Button";

import { IntlWrapper } from "../../core/base/IntlWrapper";
import OperatorDropdown from "./OperatorDropdown";
import RangeInput from "./RangeInput";
import ComparisonInput from "./ComparisonInput";
import { IValue, isComparisonOperator, isRangeOperator } from "../../../interfaces/MeasureValueFilter";
import * as Operator from "../../../constants/measureValueFilterOperators";

export interface IInputProps {
    value?: IValue;
    onChange: (value: IValue) => void;
    onEnterKeyPress?: () => void;
}

export interface IDropdownBodyOwnProps {
    operator?: string;
    value?: IValue;
    locale?: string;
    onCancel?: () => void;
    onApply: (operator: string, value: IValue) => void;
}

export type IDropdownBodyProps = IDropdownBodyOwnProps & WrappedComponentProps;

interface IDropdownBodyState {
    operator: string;
    value: IValue;
}

class DropdownBodyWrapped extends React.PureComponent<IDropdownBodyProps, IDropdownBodyState> {
    constructor(props: IDropdownBodyProps) {
        super(props);

        const { operator, value } = props;

        this.state = {
            operator: operator || Operator.ALL,
            value: value || {},
        };
    }

    public render() {
        const { onCancel, intl } = this.props;
        const { operator } = this.state;

        return (
            <div className="gd-mvf-dropdown-body gd-dialog gd-dropdown overlay s-mvf-dropdown-body">
                <div className="gd-mvf-dropdown-content">
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
        const {
            operator,
            value: { value = null, from = null, to = null },
        } = this.state;

        if (isComparisonOperator(operator)) {
            return (
                <ComparisonInput
                    value={value}
                    onValueChange={this.handleValueChange}
                    onEnterKeyPress={this.onApply}
                />
            );
        } else if (isRangeOperator(operator)) {
            return (
                <RangeInput
                    from={from}
                    to={to}
                    onFromChange={this.handleFromChange}
                    onToChange={this.handleToChange}
                    onEnterKeyPress={this.onApply}
                />
            );
        }

        return null;
    };

    private isApplyButtonDisabled = () => {
        return false;
    };

    private handleOperatorSelection = (operator: string) => this.setState({ operator });

    private handleValueChange = (value: number) => this.setState({ value: { ...this.state.value, value } });

    private handleFromChange = (from: number) => this.setState({ value: { ...this.state.value, from } });

    private handleToChange = (to: number) => this.setState({ value: { ...this.state.value, to } });

    private onApply = () => this.props.onApply(this.state.operator, this.state.value);
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
