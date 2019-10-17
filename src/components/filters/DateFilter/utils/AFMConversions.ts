// (C) 2007-2019 GoodData Corporation
import { AFM, ExtendedDateFilters } from "@gooddata/typings";
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

export const mapOptionToAfm = (value: DateFilterOption, dateDataSet: AFM.ObjQualifier) => {
    if (ExtendedDateFilters.isAllTimeDateFilter(value)) {
        return null;
    }

    if (ExtendedDateFilters.isAbsoluteDateFilterOption(value)) {
        return mapAbsoluteFilterToAfm(value, dateDataSet);
    }

    if (ExtendedDateFilters.isRelativeDateFilterOption(value)) {
        return mapRelativeFilterToAfm(value, dateDataSet);
    }

    throw new Error("Uknown date filter value provided");
};
