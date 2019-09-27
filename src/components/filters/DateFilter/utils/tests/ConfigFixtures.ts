// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

export const allTime: ExtendedDateFilters.IDateFilterAllTime = {
    localIdentifier: "ALL_TIME",
    name: "",
    visible: true,
};

export const year2019: ExtendedDateFilters.IDateFilterAbsolutePreset = {
    from: "2019-01-01",
    localIdentifier: "YEAR_2019",
    name: "",
    to: "2019-12-31",
    visible: true,
};

export const absoluteForm: ExtendedDateFilters.IDateFilterAbsoluteForm = {
    localIdentifier: "ABSOLUTE_FORM",
    name: "",
    visible: true,
};

export const lastMonth: ExtendedDateFilters.IDateFilterRelativePreset = {
    from: -1,
    to: -1,
    granularity: "GDC.time.month",
    localIdentifier: "LAST_MONTH",
    name: "",
    visible: true,
};

export const lastYear: ExtendedDateFilters.IDateFilterRelativePreset = {
    from: -1,
    to: -1,
    granularity: "GDC.time.year",
    localIdentifier: "LAST_YEAR",
    name: "",
    visible: true,
};

export const relativeForm: ExtendedDateFilters.IDateFilterRelativeForm = {
    granularities: ["GDC.time.year", "GDC.time.month"],
    localIdentifier: "RELATIVE_FORM",
    name: "",
    visible: true,
};
