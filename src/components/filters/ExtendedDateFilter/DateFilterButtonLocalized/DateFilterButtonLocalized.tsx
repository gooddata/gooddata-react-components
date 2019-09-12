// (C) 2007-2019 GoodData Corporation
import React from "react";
import { FormattedMessage } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";
import { DateFilterButton } from "../DateFilterButton/DateFilterButton";
import { DateFilterTextLocalized } from "../DateFilterTextLocalized/DateFilterTextLocalized";

export interface IDateFilterButtonLocalizedProps {
    dateFilterOption: ExtendedDateFilters.DateFilterOption;
    isOpen?: boolean;
    isMobile: boolean;
    excludeCurrentPeriod?: boolean;
    customFilterName?: string;
    disabled?: boolean;
}

export const DateFilterButtonLocalized: React.FC<IDateFilterButtonLocalizedProps> = ({
    dateFilterOption,
    isOpen = false,
    isMobile = true,
    excludeCurrentPeriod = false,
    customFilterName,
    disabled,
}) => {
    return (
        <DateFilterButton
            title={customFilterName || <FormattedMessage id="dateFilterDropdown.title" />}
            isOpen={isOpen}
            isMobile={isMobile}
            disabled={disabled}
        >
            <span className="s-button-text">
                <DateFilterTextLocalized
                    filter={dateFilterOption}
                    excludeCurrentPeriod={excludeCurrentPeriod}
                />
            </span>
        </DateFilterButton>
    );
};
