// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";

const max = <T>(a: T, b: T): T => (a > b ? a : b);
const min = <T>(a: T, b: T): T => (a <= b ? a : b);

export const sanitizeDateFilterOption = <
    T extends
        | ExtendedDateFilters.RelativeDateFilterOption
        | ExtendedDateFilters.AbsoluteDateFilterOption
        | ExtendedDateFilters.IDateFilterAbsolutePreset
        | ExtendedDateFilters.IDateFilterRelativePreset
>(
    option: T,
): T => ({
    ...option,
    from: min(option.from, option.to),
    to: max(option.from, option.to),
});
