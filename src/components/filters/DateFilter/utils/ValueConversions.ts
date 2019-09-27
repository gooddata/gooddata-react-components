// (C) 2007-2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

type OptionToValueConversion = (
    value: ExtendedDateFilters.DateFilterOption,
) => ExtendedDateFilters.IDateFilterValue | undefined;

const filterOptionToFilterValueConversions: {
    [T in ExtendedDateFilters.OptionType]: OptionToValueConversion
} = {
    absoluteForm: (value: ExtendedDateFilters.IAbsoluteDateFilterForm) => ({
        from: value.from,
        to: value.to,
        granularity: "GDC.time.date",
        optionLocalIdentifier: value.localIdentifier,
        type: "absolute",
    }),
    absolutePreset: (value: ExtendedDateFilters.IAbsoluteDateFilterPreset) => ({
        from: value.from,
        to: value.to,
        granularity: "GDC.time.date",
        optionLocalIdentifier: value.localIdentifier,
        type: "absolute",
    }),
    allTime: () => undefined,
    relativeForm: (value: ExtendedDateFilters.IRelativeDateFilterForm) => ({
        from: value.from.toString(),
        to: value.to.toString(),
        granularity: value.granularity,
        optionLocalIdentifier: value.localIdentifier,
        type: "relative",
    }),
    relativePreset: (value: ExtendedDateFilters.IRelativeDateFilterPreset) => ({
        from: value.from.toString(),
        to: value.to.toString(),
        granularity: value.granularity,
        optionLocalIdentifier: value.localIdentifier,
        type: "relative",
    }),
};

export const mapDateFilterOptionToDateFilterValue = (
    dateFilterOption: ExtendedDateFilters.DateFilterOption,
): ExtendedDateFilters.IDateFilterValue =>
    filterOptionToFilterValueConversions[dateFilterOption.type](dateFilterOption);
