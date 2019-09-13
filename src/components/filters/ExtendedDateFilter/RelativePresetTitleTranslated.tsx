// (C) 2007-2019 GoodData Corporation
import React from "react";
import { FormattedMessage } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";

const intlIdDict: { [key in ExtendedDateFilters.DateFilterGranularity]: string } = {
    "GDC.time.date": "filters.day.title",
    "GDC.time.week_us": "filters.week.title",
    "GDC.time.month": "filters.month.title",
    "GDC.time.quarter": "filters.quarter.title",
    "GDC.time.year": "filters.year.title",
};

interface IRelativePresetTitleTranslatedProps {
    granularity: ExtendedDateFilters.DateFilterGranularity;
}

export const RelativePresetTitleTranslated = ({ granularity }: IRelativePresetTitleTranslatedProps) => {
    const intlId = intlIdDict[granularity] || null;
    if (!intlId) {
        return null;
    }

    return <FormattedMessage id={intlId} />;
};
