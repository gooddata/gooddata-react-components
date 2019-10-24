// (C) 2007-2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

export const getDateFilterOptionGranularity = (
    dateFilterOption: ExtendedDateFilters.DateFilterOption,
): ExtendedDateFilters.DateFilterGranularity =>
    ExtendedDateFilters.isRelativeDateFilterForm(dateFilterOption) ||
    ExtendedDateFilters.isRelativeDateFilterPreset(dateFilterOption)
        ? dateFilterOption.granularity
        : undefined;
