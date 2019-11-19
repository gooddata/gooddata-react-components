// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import classNames from "classnames";
import noop = require("lodash/noop");
import capitalize = require("lodash/capitalize");
import { string as stringUtils } from "@gooddata/js-utils";

import { getOperatorTranslationKey, getOperatorIcon } from "../../../helpers/measureValueFilterOperator";

export interface IOperatorDropdownItemOwnProps {
    selectedOperator: string;
    operator: string;
    onClick: (identifier: string) => void;
}

export type IOperatorDropdownItemProps = IOperatorDropdownItemOwnProps & InjectedIntlProps;

export class OperatorDropdownItem extends React.PureComponent<IOperatorDropdownItemProps> {
    public static defaultProps: any = {
        onClick: noop,
    };

    public render() {
        const { intl, operator, selectedOperator } = this.props;

        const className = classNames(
            "gd-list-item",
            "gd-list-item-shortened",
            `s-mvf-operator-${stringUtils.simplifyText(operator)}`,
            {
                "is-selected": selectedOperator === operator,
            },
        );

        const title = intl.formatMessage({ id: getOperatorTranslationKey(operator) });

        return (
            <div className={className} onClick={this.handleOnClick}>
                <div className={`icon-${getOperatorIcon(operator)}`} title={title} />
                <span title={title}>{capitalize(title)}</span>
            </div>
        );
    }

    public handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const { operator, onClick } = this.props;
        onClick(operator);
        e.preventDefault();
    };
}

export default injectIntl(OperatorDropdownItem);
