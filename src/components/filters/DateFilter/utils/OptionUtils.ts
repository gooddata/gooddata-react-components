// (C) 2007-2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

export const getDateFilterOptionGranularity = (
    dateFilterOption: ExtendedDateFilters.DateFilterOption,
): ExtendedDateFilters.DateFilterGranularity =>
    dateFilterOption.type === "relativeForm" || dateFilterOption.type === "relativePreset"
        ? dateFilterOption.granularity
        : undefined;
