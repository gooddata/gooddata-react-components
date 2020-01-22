// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";

import { IntlWrapper } from "../../core/base/IntlWrapper";
import { IValue } from "../../../interfaces/MeasureValueFilter";
import { DropdownBody } from "./DropdownBody";
import * as Operator from "../../../constants/measureValueFilterOperators";
import { DROPDOWN_ALIGMENTS } from "../../../internal/components/configurationControls/DropdownControl";

export interface IDropdownOwnProps {
    onApply: (operator: string, value?: IValue) => void;
    onCancel: () => void;
    operator?: string;
    value?: IValue;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    anchorEl: EventTarget | string;
}

export type IDropdownProps = IDropdownOwnProps & WrappedComponentProps;

interface IDropdownState {
    displayDropdown: boolean;
}

class DropdownWrapped extends React.PureComponent<IDropdownProps, IDropdownState> {
    public static defaultProps: Partial<IDropdownProps> = {
        value: {},
        operator: null,
    };

    public render() {
        const { operator, value, usePercentage, warningMessage, locale, onCancel, anchorEl } = this.props;

        const selectedOperator = operator !== null ? operator : Operator.ALL;

        return (
            <Overlay
                alignTo={anchorEl}
                alignPoints={DROPDOWN_ALIGMENTS}
                closeOnOutsideClick={true}
                closeOnParentScroll={true}
                closeOnMouseDrag={true}
                onClose={onCancel}
            >
                <DropdownBody
                    operator={selectedOperator}
                    value={value}
                    usePercentage={usePercentage}
                    warningMessage={warningMessage}
                    locale={locale}
                    onCancel={onCancel}
                    onApply={this.onApply}
                />
            </Overlay>
        );
    }

    private onApply = (operator: string, value?: IValue) => {
        this.props.onApply(operator, value);
    };
}

export const DropdownWithIntl = injectIntl(DropdownWrapped);

export class Dropdown extends React.PureComponent<IDropdownOwnProps, IDropdownState> {
    public render() {
        return (
            <IntlWrapper locale={this.props.locale}>
                <DropdownWithIntl {...this.props} />
            </IntlWrapper>
        );
    }
}
