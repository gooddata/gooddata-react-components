// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { testAPI } from "../DateFilter";
import {
    createDateFilter,
    clickDateFilterButton,
    clickStaticFilter,
    clickApplyButton,
    defaultDateFilterOptions,
    getRelativePresetByLocalIdentifier,
    getLocalIdentifierFromItem,
} from "./extendedDateFilters_helpers";

describe("DateFilter", () => {
    describe("Configuration", () => {
        it("DateFilter render without crash", () => {
            createDateFilter();
        });
    });

    describe("Static date filters", () => {
        it.each([
            ["last-7-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-30-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-90-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
        ])("Switch to static date filter to %s", (item: string, relativePreset: any[]) => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, item);
            clickApplyButton(wrapper);

            expect(onApply).toHaveBeenCalledTimes(1);

            const expectedSelectedItem = getRelativePresetByLocalIdentifier(
                getLocalIdentifierFromItem(item),
                relativePreset,
            );
            expect(onApply).toBeCalledWith(expectedSelectedItem, false);
        });
    });
});

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
        const normalizedOption: ExtendedDateFilters.IRelativeDateFilterForm = testAPI.normalizeSelectedFilterOption(
            sampleUnsortedFloatingRangeFormOption,
        ) as any;
        expect(normalizedOption.from < normalizedOption.to).toBe(true);
    });

    it("should not update floating range from and to fields if already in correct order", () => {
        const actual = testAPI.normalizeSelectedFilterOption(sampleFloatingRangeFormOption);
        expect(actual).toBe(sampleFloatingRangeFormOption);
    });

    it("should leave other options as is", () => {
        const actual = testAPI.normalizeSelectedFilterOption(sampleFloatingRangePresetOption);
        expect(actual).toBe(sampleFloatingRangePresetOption);
    });
});
