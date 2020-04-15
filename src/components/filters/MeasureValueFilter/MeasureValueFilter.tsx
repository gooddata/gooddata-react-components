// (C) 2020 GoodData Corporation
import * as React from "react";
import noop = require("lodash/noop");
import { AFM } from "@gooddata/typings";

import { MeasureValueFilterDropdown } from "./MeasureValueFilterDropdown";
import MeasureValueFilterButton from "./MeasureValueFilterButton";
import { IMeasureValueFilterCommonProps } from "./typings";

export interface IMeasureValueFilterProps extends IMeasureValueFilterCommonProps {
    buttonTitle: string;
    onCancel?: () => void;
}

interface IMeasureValueFilterState {
    displayDropdown: boolean;
}

export class MeasureValueFilter extends React.PureComponent<
    IMeasureValueFilterProps,
    IMeasureValueFilterState
> {
    public static defaultProps: Partial<IMeasureValueFilterProps> = {
        onCancel: noop,
    };

    public state: IMeasureValueFilterState = {
        displayDropdown: false,
    };

    private buttonRef = React.createRef<HTMLDivElement>();

    public render() {
        const { displayDropdown } = this.state;
        const {
            filter,
            buttonTitle,
            usePercentage,
            warningMessage,
            locale,
            separators,
            displayTreatNullAsZeroOption,
            treatNullAsZeroDefaultValue,
        } = this.props;

        return (
            <React.Fragment>
                <div ref={this.buttonRef}>
                    <MeasureValueFilterButton
                        onClick={this.toggleDropdown}
                        isActive={displayDropdown}
                        buttonTitle={buttonTitle}
                    />
                </div>
                {displayDropdown ? (
                    <MeasureValueFilterDropdown
                        onApply={this.onApply}
                        onCancel={this.onCancel}
                        filter={filter}
                        usePercentage={usePercentage}
                        warningMessage={warningMessage}
                        locale={locale}
                        separators={separators}
                        displayTreatNullAsZeroOption={displayTreatNullAsZeroOption}
                        treatNullAsZeroDefaultValue={treatNullAsZeroDefaultValue}
                        anchorEl={this.buttonRef.current}
                    />
                ) : null}
            </React.Fragment>
        );
    }

    private onApply = (filter: AFM.IMeasureValueFilter) => {
        this.closeDropdown();
        this.props.onApply(filter);
    };

    private onCancel = () => {
        this.closeDropdown();
        this.props.onCancel();
    };

    private closeDropdown = () => {
        this.setState({ displayDropdown: false });
    };

    private toggleDropdown = () => {
        this.setState(state => ({ ...state, displayDropdown: !state.displayDropdown }));
    };
}
