// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { testAPI } from "../DateFilter";
import {
    createDateFilter,
    clickDateFilterButton,
    clickStaticFilter,
    clickApplyButton,
    defaultDateFilterOptions,
    getRelativePresetByItem,
    getDateFilterButtonText,
    getAllStaticItemsLabels,
    getFilterTitle,
    isDateFilterBodyVisible,
    isDateFilterVisible,
} from "./extendedDateFilters_helpers";

describe("DateFilter", () => {
    describe("Configuration", () => {
        it("Should DateFilter render without crash", () => {
            createDateFilter();
        });

        it("Should DateFilter render with custom name", () => {
            const expectedLabel = "Custom filter name";
            const wrapper = createDateFilter({ customFilterName: expectedLabel });
            expect(getFilterTitle(wrapper)).toEqual(expectedLabel);
        });

        it("Should DateFilter render readonly", () => {
            const wrapper = createDateFilter({ dateFilterMode: "readonly" });
            clickDateFilterButton(wrapper);
            expect(isDateFilterBodyVisible(wrapper)).toBe(false);
        });

        it("Should DateFilter render hidden", () => {
            const wrapper = createDateFilter({ dateFilterMode: "hidden" });
            expect(isDateFilterVisible(wrapper)).toBe(false);
        });

        it("Should update selectedFilterOption after first render", () => {
            const wrapper = createDateFilter();
            expect(getDateFilterButtonText(wrapper)).toBe("All time");

            const selectedFilterOption = getRelativePresetByItem(
                "last-7-days",
                defaultDateFilterOptions.relativePreset["GDC.time.date"],
            );
            wrapper.setProps({ selectedFilterOption });
            expect(getDateFilterButtonText(wrapper)).toBe("Last 7 days");
        });
    });

    describe("Static date filters", () => {
        it.each([
            ["last-7-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-30-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-90-days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["this-month", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["last-month", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["last-12-months", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["this-quarter", defaultDateFilterOptions.relativePreset["GDC.time.quarter"]],
            ["last-quarter", defaultDateFilterOptions.relativePreset["GDC.time.quarter"]],
            ["last-4-quarters", defaultDateFilterOptions.relativePreset["GDC.time.quarter"]],
            ["this-year", defaultDateFilterOptions.relativePreset["GDC.time.year"]],
            ["last-year", defaultDateFilterOptions.relativePreset["GDC.time.year"]],
        ])("Should switch to static date filter to %s", (item: string, relativePreset: any[]) => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });

            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, item);
            clickApplyButton(wrapper);

            const expectedSelectedItem = getRelativePresetByItem(item, relativePreset);

            expect(onApply).toHaveBeenCalledTimes(1);
            expect(onApply).toBeCalledWith(expectedSelectedItem, false);
        });

        it.each([
            ["last-7-days", "Last 7 days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-30-days", "Last 30 days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["last-90-days", "Last 90 days", defaultDateFilterOptions.relativePreset["GDC.time.date"]],
            ["this-month", "This month", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["last-month", "Last month", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["last-12-months", "Last 12 months", defaultDateFilterOptions.relativePreset["GDC.time.month"]],
            ["this-quarter", "This quarter", defaultDateFilterOptions.relativePreset["GDC.time.quarter"]],
            ["last-quarter", "Last quarter", defaultDateFilterOptions.relativePreset["GDC.time.quarter"]],
            [
                "last-4-quarters",
                "Last 4 quarters",
                defaultDateFilterOptions.relativePreset["GDC.time.quarter"],
            ],
            ["this-year", "This year", defaultDateFilterOptions.relativePreset["GDC.time.year"]],
            ["last-year", "Last year", defaultDateFilterOptions.relativePreset["GDC.time.year"]],
        ])(
            "Should set correct button selected label %s",
            (item: string, label: string, relativePreset: any[]) => {
                const selectedFilterOption = getRelativePresetByItem(item, relativePreset);
                const wrapper = createDateFilter({ selectedFilterOption });
                expect(getDateFilterButtonText(wrapper)).toBe(label);
            },
        );

        it("Should static filters are sorted in ascending order", () => {
            const expextedItems = [
                "Last 7 days",
                "Last 30 days",
                "Last 90 days",
                "This month",
                "Last month",
                "Last 12 months",
                "This quarter",
                "Last quarter",
                "Last 4 quarters",
                "This year",
                "Last year",
            ];

            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            const staticItems = getAllStaticItemsLabels(wrapper);
            expect(staticItems).toEqual(expextedItems);
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
