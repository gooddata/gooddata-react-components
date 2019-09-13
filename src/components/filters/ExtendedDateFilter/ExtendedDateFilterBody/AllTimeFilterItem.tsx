// (C) 2019 GoodData Corporation
import React from "react";
import { FormattedMessage } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";
import cx from "classnames";
import { ListItem } from "../ListItem/ListItem";

interface IAllTimeFilterItemProps {
    filterOption: ExtendedDateFilters.IAllTimeDateFilter;
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
    className?: string;
    onSelectedFilterOptionChange: (option: ExtendedDateFilters.DateFilterOption) => void;
}

export const AllTimeFilterItem = ({
    className,
    filterOption,
    selectedFilterOption,
    onSelectedFilterOptionChange,
}: IAllTimeFilterItemProps) => (
    <ListItem
        isSelected={filterOption.localIdentifier === selectedFilterOption.localIdentifier}
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => onSelectedFilterOptionChange(filterOption)}
        className={cx("s-all-time", className)}
    >
        <FormattedMessage id="filters.allTime.title" />
    </ListItem>
);
