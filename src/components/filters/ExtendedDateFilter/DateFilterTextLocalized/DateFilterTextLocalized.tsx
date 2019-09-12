// (C) 2019 GoodData Corporation
import React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";
import { getDateFilterTitle } from "../../../../helpers/ExtendedDateFilterService/Translations/DateFilterTitle";

interface IDateFilterTextLocalizedProps {
    filter: ExtendedDateFilters.DateFilterOption;
    excludeCurrentPeriod: boolean;
}

const DateFilterTextLocalizedComponent: React.FC<IDateFilterTextLocalizedProps & InjectedIntlProps> = ({
    filter,
    excludeCurrentPeriod,
    intl,
}) => <>{getDateFilterTitle(filter, excludeCurrentPeriod, intl)}</>;

export const DateFilterTextLocalized = injectIntl<IDateFilterTextLocalizedProps>(
    DateFilterTextLocalizedComponent,
);
