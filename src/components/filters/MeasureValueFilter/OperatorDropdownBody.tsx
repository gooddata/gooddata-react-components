// (C) 2019 GoodData Corporation
import * as React from "react";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";
import { Separator } from "@gooddata/goodstrap/lib/List/MenuList";

import OperatorDropdownItem from "./OperatorDropdownItem";
import * as Operator from "../../../constants/measureValueFilterOperators";

export interface IOperatorDropdownBodyProps {
    selectedOperator: string;
    onSelect: (operator: string) => void;
    onClose: () => void;
    alignTo: string;
}

export default class OperatorDropdownBody extends React.PureComponent<IOperatorDropdownBodyProps> {
    public render() {
        const { onSelect, onClose, selectedOperator, alignTo } = this.props;

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
                        />
                        <OperatorDropdownItem
                            operator={Operator.NOT_BETWEEN}
                            selectedOperator={selectedOperator}
                            onClick={onSelect}
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
