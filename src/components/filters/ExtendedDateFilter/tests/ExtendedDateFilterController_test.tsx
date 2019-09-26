// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { normalizeSelectedFilterOption } from "../../../../helpers/ExtendedDateFilter";

describe("normalizeSelectedFilterOption", () => {
    const sampleFloatingRangeFormOption: ExtendedDateFilters.IRelativeDateFilterForm = {
        from: -2,
        to: 0,
        granularity: "GDC.time.date",
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        availableGranularities: ["GDC.time.date"],
        name: "",
        visible: true,
    };

    const sampleUnsortedFloatingRangeFormOption: ExtendedDateFilters.IRelativeDateFilterForm = {
        from: 99,
        to: -2,
        granularity: "GDC.time.date",
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        availableGranularities: ["GDC.time.date"],
        name: "",
        visible: true,
    };

    const sampleFloatingRangePresetOption: ExtendedDateFilters.IRelativeDateFilterPreset = {
        from: -11,
        to: 0,
        granularity: "GDC.time.month",
        localIdentifier: "LAST_12_MONTHS",
        type: "relativePreset",
        name: "",
        visible: true,
    };

    it("should sort floating range from and to fields", () => {
        const normalizedOption: ExtendedDateFilters.IRelativeDateFilterForm = normalizeSelectedFilterOption(
            sampleUnsortedFloatingRangeFormOption,
        ) as any;
        expect(normalizedOption.from < normalizedOption.to).toBe(true);
    });

    it("should not update floating range from and to fields if already in correct order", () => {
        const actual = normalizeSelectedFilterOption(sampleFloatingRangeFormOption);
        expect(actual).toBe(sampleFloatingRangeFormOption);
    });

    it("should leave other options as is", () => {
        const actual = normalizeSelectedFilterOption(sampleFloatingRangePresetOption);
        expect(actual).toBe(sampleFloatingRangePresetOption);
    });
});
