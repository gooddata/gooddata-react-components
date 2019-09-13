// (C) 2019 GoodData Corporation
import React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";
import { getDateFilterTitle } from "../../../../helpers/ExtendedDateFilterService/Translations/DateFilterTitle";

interface IDateFilterTextLocalizedProps {
    filter: ExtendedDateFilters.DateFilterOption;
    excludeCurrentPeriod: boolean;
}

type DateFilterTextLocalizedComponentProps = IDateFilterTextLocalizedProps & InjectedIntlProps;

const DateFilterTextLocalizedComponent = ({
    filter,
    excludeCurrentPeriod,
    intl,
}: DateFilterTextLocalizedComponentProps) => <>{getDateFilterTitle(filter, excludeCurrentPeriod, intl)}</>;

export const DateFilterTextLocalized = injectIntl<IDateFilterTextLocalizedProps>(
    DateFilterTextLocalizedComponent,
);
