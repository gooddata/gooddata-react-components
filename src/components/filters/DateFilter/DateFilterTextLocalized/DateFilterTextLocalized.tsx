// (C) 2019 GoodData Corporation
import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { ExtendedDateFilters, Localization } from "@gooddata/typings";
import { getDateFilterTitle } from "../utils/Translations/DateFilterTitle";

interface IDateFilterTextLocalizedProps {
    filter: ExtendedDateFilters.DateFilterOption;
}

const DateFilterTextLocalizedComponent: React.FC<IDateFilterTextLocalizedProps & InjectedIntlProps> = ({
    filter,
    intl,
}) => <>{getDateFilterTitle(filter, intl.locale as Localization.ILocale)}</>;

export const DateFilterTextLocalized = injectIntl<IDateFilterTextLocalizedProps>(
    DateFilterTextLocalizedComponent,
);
