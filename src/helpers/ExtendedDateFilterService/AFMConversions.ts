// (C) 2007-2019 GoodData Corporation
import { AFM, ExtendedDateFilters } from "@gooddata/typings";

export const ALL_TIME_GRANULARITY = "ALL_TIME_GRANULARITY";

export const mapAllTimeFilterToAfm = (dateDataSetId: string): AFM.IRelativeDateFilter => ({
    relativeDateFilter: {
        dataSet: {
            uri: dateDataSetId,
        },
        granularity: ALL_TIME_GRANULARITY, // special case for Data-layer
        from: 0,
        to: 0,
    },
});

export const mapAbsoluteFilterToAfm = (
    value: ExtendedDateFilters.AbsoluteDateFilterOption,
    dateDataSetId: string,
): AFM.IAbsoluteDateFilter => ({
    absoluteDateFilter: {
        dataSet: {
            uri: dateDataSetId,
        },
        from: value.from,
        to: value.to,
    },
});

export const mapRelativeFilterToAfm = (
    value: ExtendedDateFilters.RelativeDateFilterOption,
    dateDataSetId: string,
): AFM.IRelativeDateFilter => ({
    relativeDateFilter: {
        dataSet: {
            uri: dateDataSetId,
        },
        from: value.from,
        to: value.to,
        granularity: value.granularity,
    },
});
