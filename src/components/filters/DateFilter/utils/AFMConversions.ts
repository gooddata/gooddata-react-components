// (C) 2007-2019 GoodData Corporation
import { AFM, ExtendedDateFilters } from "@gooddata/typings";
import { applyExcludeCurrentPeriod } from "./PeriodExlusion";
import DateFilterOption = ExtendedDateFilters.DateFilterOption;

export const mapAbsoluteFilterToAfm = (
    value: ExtendedDateFilters.AbsoluteDateFilterOption,
    dataSet: AFM.ObjQualifier,
): AFM.IAbsoluteDateFilter => ({
    absoluteDateFilter: {
        dataSet,
        from: value.from,
        to: value.to,
    },
});

export const mapRelativeFilterToAfm = (
    value: ExtendedDateFilters.RelativeDateFilterOption,
    dataSet: AFM.ObjQualifier,
): AFM.IRelativeDateFilter => ({
    relativeDateFilter: {
        dataSet,
        from: value.from,
        to: value.to,
        granularity: value.granularity,
    },
});

export const mapOptionToAfm = (
    value: DateFilterOption,
    dateDataSet: AFM.ObjQualifier,
    excludeCurrentPeriod: boolean,
) => {
    const excludeApplied = applyExcludeCurrentPeriod(value, excludeCurrentPeriod);

    if (ExtendedDateFilters.isAllTimeDateFilter(excludeApplied)) {
        return null;
    }

    if (ExtendedDateFilters.isAbsoluteDateFilterOption(excludeApplied)) {
        return mapAbsoluteFilterToAfm(excludeApplied, dateDataSet);
    }

    if (ExtendedDateFilters.isRelativeDateFilterOption(excludeApplied)) {
        return mapRelativeFilterToAfm(excludeApplied, dateDataSet);
    }

    throw new Error("Uknown date filter value provided");
};
