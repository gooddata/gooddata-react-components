// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";
import { Separator } from "@gooddata/goodstrap/lib/List/MenuList";

import OperatorDropdownItem from "./OperatorDropdownItem";
import * as Operator from "../../../constants/measureValueFilterOperators";

interface IOperatorDropdownBodyOwnProps {
    selectedOperator: string;
    onSelect: (operator: string) => void;
    onClose: () => void;
    alignTo: string;
}

type IOperatorDropdownBodyProps = IOperatorDropdownBodyOwnProps & WrappedComponentProps;

export class OperatorDropdownBody extends React.PureComponent<IOperatorDropdownBodyProps> {
    public render() {
        const { onSelect, onClose, selectedOperator, alignTo, intl } = this.props;

        return (
            <Overlay
                closeOnOutsideClick={true}
                alignTo={alignTo}
                alignPoints={[{ align: "bl tl" }]}
                onClose={onClose}
            >
                <div className="gd-dropdown overlay">
                    <div className="gd-mvf-operator-dropdown-body s-mvf-operator-dropdown-body">
                        <OperatorDropdownItem
                            operator={Operator.ALL}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <Separator />
                        <OperatorDropdownItem
                            operator={Operator.GREATER_THAN}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <OperatorDropdownItem
                            operator={Operator.GREATER_THAN_OR_EQUAL_TO}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <Separator />
                        <OperatorDropdownItem
                            operator={Operator.LESS_THAN}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <OperatorDropdownItem
                            operator={Operator.LESS_THAN_OR_EQUAL_TO}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <Separator />
                        <OperatorDropdownItem
                            operator={Operator.BETWEEN}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                            bubbleText={intl.formatMessage({ id: "mvf.operator.between.tooltip.bubble" })}
                        />
                        <OperatorDropdownItem
                            operator={Operator.NOT_BETWEEN}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                            bubbleText={intl.formatMessage({ id: "mvf.operator.notBetween.tooltip.bubble" })}
                        />
                        <Separator />
                        <OperatorDropdownItem
                            operator={Operator.EQUAL_TO}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                        <OperatorDropdownItem
                            operator={Operator.NOT_EQUAL_TO}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
                        />
                    </div>
                </div>
            </Overlay>
        );
    }
}

export default injectIntl(OperatorDropdownBody);
