// (C) 2019 GoodData Corporation
import * as React from "react";
import { AFM } from "@gooddata/typings";

import { IValue } from "../../../interfaces/MeasureValueFilter";
import { measureValueFilter as Model } from "../../../helpers/model/measureValueFilters";
import { Dropdown } from "./Dropdown";

export interface IDropdownProps {
    filter?: AFM.IMeasureValueFilter;
    button?: React.ComponentType<any>;
    onApply: (filter: AFM.IMeasureValueFilter, measureIdentifier: string) => void;
    locale?: string;
    measureTitle?: string;
    measureIdentifier: string;
    displayDropdown?: boolean;
}

export class DropdownAfmWrapper extends React.PureComponent<IDropdownProps> {
    public render() {
        const { button, measureTitle, locale, filter, displayDropdown } = this.props;

        return (
            <Dropdown
                displayDropdown={displayDropdown}
                button={button}
                onApply={this.onApply}
                measureTitle={measureTitle}
                locale={locale}
                operator={(filter && Model.measureValueFilterOperator(filter)) || null}
                value={(filter && Model.measureValueFilterValue(filter)) || null}
            />
        );
    }

    private onApply = (operator: string, value: IValue) => {
        const { measureIdentifier, onApply } = this.props;

        if (operator === null) {
            onApply(null, measureIdentifier);
        } else {
            const filter = Model.getFilter(measureIdentifier, operator, value);
            onApply(filter, measureIdentifier);
        }
    };
}
