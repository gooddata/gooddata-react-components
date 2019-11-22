// (C) 2019 GoodData Corporation
import * as React from "react";
import { AFM } from "@gooddata/typings";

import { IValue } from "../../../interfaces/MeasureValueFilter";
import { measureValueFilter as Model } from "../../../helpers/model/measureValueFilters";
import { Dropdown } from "./Dropdown";

export interface IDropdownProps {
    filter?: AFM.IMeasureValueFilter;
    onApply: (filter: AFM.IMeasureValueFilter) => void;
    onCancel: () => void;
    measureIdentifier: string;
    locale?: string;
    anchorEl?: EventTarget | string;
}

export class DropdownAfmWrapper extends React.PureComponent<IDropdownProps> {
    public render() {
        const { filter, onCancel, locale, anchorEl } = this.props;

        return (
            <Dropdown
                onApply={this.onApply}
                onCancel={onCancel}
                operator={(filter && Model.measureValueFilterOperator(filter)) || null}
                value={(filter && Model.measureValueFilterValue(filter)) || null}
                locale={locale}
                anchorEl={anchorEl}
            />
        );
    }

    private onApply = (operator: string, value: IValue) => {
        const { measureIdentifier, onApply } = this.props;

        if (operator === null) {
            onApply(null);
        } else {
            const filter = Model.getFilter(measureIdentifier, operator, value);
            onApply(filter);
        }
    };
}
