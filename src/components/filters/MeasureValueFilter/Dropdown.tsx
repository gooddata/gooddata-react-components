// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";

import { ISeparators } from "./separators";
import { IntlWrapper } from "../../core/base/IntlWrapper";
import { IMeasureValueFilterValue } from "../../../interfaces/MeasureValueFilter";

import { DropdownBody } from "./DropdownBody";
import * as Operator from "../../../constants/measureValueFilterOperators";
import { DROPDOWN_ALIGMENTS } from "../../../internal/components/configurationControls/DropdownControl";

interface IDropdownOwnProps {
    onApply: (operator: string, value: IMeasureValueFilterValue, treatNullValuesAsZero: boolean) => void;
    onCancel: () => void;
    operator?: string;
    value?: IMeasureValueFilterValue;
    usePercentage?: boolean;
    warningMessage?: string;
    locale?: string;
    anchorEl: EventTarget | string;
    separators?: ISeparators;
    displayTreatNullAsZeroOption?: boolean;
    treatNullAsZeroValue?: boolean;
}

type IDropdownProps = IDropdownOwnProps & WrappedComponentProps;

interface IDropdownState {
    displayDropdown: boolean;
}

class DropdownWrapped extends React.PureComponent<IDropdownProps, IDropdownState> {
    public static defaultProps: Partial<IDropdownProps> = {
        value: {},
        operator: null,
        displayTreatNullAsZeroOption: false,
        treatNullAsZeroValue: false,
    };

    public render() {
        const {
            operator,
            value,
            usePercentage,
            warningMessage,
            locale,
            onCancel,
            anchorEl,
            separators,
            displayTreatNullAsZeroOption,
            treatNullAsZeroValue,
        } = this.props;

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
                    separators={separators}
                    displayTreatNullAsZeroOption={displayTreatNullAsZeroOption}
                    treatNullAsZeroValue={treatNullAsZeroValue}
                />
            </Overlay>
        );
    }

    private onApply = (operator: string, value: IMeasureValueFilterValue, treatNullValuesAsZero: boolean) => {
        this.props.onApply(operator, value, treatNullValuesAsZero);
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
