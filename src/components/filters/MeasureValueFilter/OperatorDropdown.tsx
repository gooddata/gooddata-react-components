// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import classNames from "classnames";
import capitalize = require("lodash/capitalize");
import { string as stringUtils } from "@gooddata/js-utils";
import Button from "@gooddata/goodstrap/lib/Button/Button";

import OperatorDropdownBody from "./OperatorDropdownBody";
import { getOperatorTranslationKey, getOperatorIcon } from "../../../helpers/measureValueFilterOperator";

interface IOperatorDropdownOwnProps {
    onSelect: (operator: string) => void;
    operator: string;
}

type IOperatorDropdownProps = IOperatorDropdownOwnProps & WrappedComponentProps;

interface IOperatorDropdownState {
    opened: boolean;
}

export class OperatorDropdown extends React.PureComponent<IOperatorDropdownProps, IOperatorDropdownState> {
    public state: IOperatorDropdownState = {
        opened: false,
    };

    public render = () => (
        <>
            {this.renderDropdownButton()}
            {this.state.opened ? (
                <OperatorDropdownBody
                    alignTo={".gd-mvf-operator-dropdown-button"}
                    onSelect={this.handleOperatorSelected}
                    selectedOperator={this.props.operator}
                    onClose={this.closeOperatorDropdown}
                />
            ) : null}
        </>
    );

    private renderDropdownButton() {
        const { intl, operator } = this.props;
        const { opened } = this.state;

        const title = capitalize(intl.formatMessage({ id: getOperatorTranslationKey(operator) }));

        const buttonClasses = classNames(
            "gd-mvf-operator-dropdown-button",
            "s-mvf-operator-dropdown-button",
            `s-mvf-operator-dropdown-button-${stringUtils.simplifyText(operator)}`,
            "gd-button-primary",
            "gd-button-small",
            {
                "button-dropdown": true,
                "is-dropdown-open": opened,
                "is-active": opened,
            },
        );

        return (
            <Button
                title={title}
                className={buttonClasses}
                value={title}
                onClick={this.handleOperatorDropdownButtonClick}
                iconLeft={`icon-${getOperatorIcon(operator)}`}
                iconRight={opened ? "icon-navigateup" : "icon-navigatedown"}
            />
        );
    }

    private handleOperatorSelected = (operator: string) => {
        this.closeOperatorDropdown();
        this.props.onSelect(operator);
    };

    private closeOperatorDropdown = () => this.setState({ opened: false });

    private handleOperatorDropdownButtonClick = () =>
        this.setState(state => ({ ...state, opened: !state.opened }));
}

export default injectIntl(OperatorDropdown);
