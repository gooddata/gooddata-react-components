// (C) 2019 GoodData Corporation
import * as React from "react";
import kebabCase = require("lodash/kebabCase");
import cx from "classnames";
import { ExtendedDateFilters } from "@gooddata/typings";
import { ListItem } from "../ListItem/ListItem";
import { DateFilterTextLocalized } from "../DateFilterTextLocalized/DateFilterTextLocalized";

interface IAbsolutePresetFilterItemsProps {
    filterOptions: ExtendedDateFilters.IAbsoluteDateFilterPreset[];
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
    className?: string;
    onSelectedFilterOptionChange: (option: ExtendedDateFilters.DateFilterOption) => void;
}

export const AbsolutePresetFilterItems: React.FC<IAbsolutePresetFilterItemsProps> = ({
    filterOptions,
    selectedFilterOption,
    onSelectedFilterOptionChange,
    className,
}) => (
    <>
        {filterOptions.map(item => (
            <ListItem
                key={item.localIdentifier}
                isSelected={item.localIdentifier === selectedFilterOption.localIdentifier}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => onSelectedFilterOptionChange(item)}
                className={cx(`s-absolute-preset-${kebabCase(item.localIdentifier)}`, className)}
            >
                <DateFilterTextLocalized filter={item} />
            </ListItem>
        ))}
    </>
);
