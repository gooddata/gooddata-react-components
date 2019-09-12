// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

/**
 * Returns the date filter option with excludeCurrentPeriod applied if applicable.
 */
export const applyExcludeCurrentPeriod = (
    dateFilterOption: ExtendedDateFilters.DateFilterOption | undefined,
    excludeCurrentPeriod: boolean,
): ExtendedDateFilters.DateFilterOption => {
    if (!dateFilterOption || !excludeCurrentPeriod) {
        return dateFilterOption;
    }

    switch (dateFilterOption.type) {
        case "allTime":
        case "absoluteForm":
        case "absolutePreset":
        case "relativeForm":
            return dateFilterOption;

        case "relativePreset":
            const { from, to } = dateFilterOption;
            const shouldExcludeCurrent = to === 0 && from < to;

            return {
                ...dateFilterOption,
                to: shouldExcludeCurrent ? -1 : to,
            };

        default:
            throw new Error("Unknown date filter value type");
    }
};
