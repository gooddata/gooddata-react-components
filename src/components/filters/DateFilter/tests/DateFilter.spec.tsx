// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { testAPI } from "../DateFilter";
import {
    createDateFilter,
    clickDateFilterButton,
    clickStaticFilter,
    clickApplyButton,
    defaultDateFilterOptions,
    getPresetByItem,
    getDateFilterButtonText,
    getAllStaticItemsLabels,
    getFilterTitle,
    isDateFilterBodyVisible,
    isDateFilterVisible,
    clickCancelButton,
    openAbsoluteFormFilter,
    writeToAbsoluteFormInputFrom,
    dateToAbsoluteInputFormat,
    writeToAbsoluteFormInputTo,
    getAbsoluteFormInputFromValue,
    getTodayDate,
    getMonthAgo,
    getAbsoluteFormInputToValue,
    openRelativeFormFilter,
    getRelativeFormInputFromValue,
    getRelativeFormInputToValue,
    isExcludeCurrentPeriodDisabled,
    setExcludeCurrentPeriodCheckBox,
    isExcludeCurrentPeriodChecked,
    clickAllTime,
    getSelectedItemText,
    setPropsFromOnApply,
    clickRelativeFormGranularity,
    isRelativeFormGranularitySelected,
    setRelativeFormInputs,
    clickAbsoluteFilter,
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

            const selectedFilterOption = getPresetByItem(
                "last-7-days",
                defaultDateFilterOptions.relativePreset["GDC.time.date"],
            );
            wrapper.setProps({ selectedFilterOption });
            expect(getDateFilterButtonText(wrapper)).toBe("Last 7 days");
        });
    });

    describe("cancel", () => {
        it("Should close DateFilter when cancel button clicked ", async () => {
            const onCancel = jest.fn();
            const wrapper = createDateFilter({ onCancel });
            clickDateFilterButton(wrapper);
            clickCancelButton(wrapper);
            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(isDateFilterBodyVisible(wrapper)).toBe(false);
        });

        it("Should not call onApply when we change filter and press cancel", async () => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-7-days");
            clickCancelButton(wrapper);

            expect(onApply).toHaveBeenCalledTimes(0);
            expect(isDateFilterBodyVisible(wrapper)).toBe(false);
        });

        it("Should reset absolute filter form when cancel clicked", async () => {
            const wrapper = createDateFilter();
            openAbsoluteFormFilter(wrapper);
            writeToAbsoluteFormInputFrom(wrapper, dateToAbsoluteInputFormat("2017-01-01"));
            writeToAbsoluteFormInputTo(wrapper, dateToAbsoluteInputFormat("2018-01-01"));
            clickCancelButton(wrapper);

            openAbsoluteFormFilter(wrapper);

            const today = getTodayDate();
            const monthAgo = getMonthAgo();

            expect(getAbsoluteFormInputFromValue(wrapper)).toEqual(dateToAbsoluteInputFormat(monthAgo));
            expect(getAbsoluteFormInputToValue(wrapper)).toEqual(dateToAbsoluteInputFormat(today));
        });

        it("Should reset relative filter form when cancel clicked", async () => {
            const wrapper = createDateFilter();
            openRelativeFormFilter(wrapper);

            setRelativeFormInputs(wrapper, "-2", "2");

            clickCancelButton(wrapper);

            openRelativeFormFilter(wrapper);

            expect(getRelativeFormInputFromValue(wrapper)).toEqual("");
            expect(getRelativeFormInputToValue(wrapper)).toEqual("");
        });
    });

    describe("reopening", () => {
        it("Should keep all time selected when reopening", async () => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });

            clickDateFilterButton(wrapper);
            clickAllTime(wrapper);
            clickApplyButton(wrapper);

            setPropsFromOnApply(wrapper, onApply, 0);

            expect(getDateFilterButtonText(wrapper)).toEqual("All time");

            clickDateFilterButton(wrapper);

            expect(getSelectedItemText(wrapper)).toEqual("All time");
        });

        it("Should keep relative preset selected when reopening", async () => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });

            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-month");
            clickApplyButton(wrapper);

            setPropsFromOnApply(wrapper, onApply, 0);

            expect(getDateFilterButtonText(wrapper)).toEqual("Last month");

            clickDateFilterButton(wrapper);

            expect(getSelectedItemText(wrapper)).toEqual("Last month");
        });

        it("Should keep absolute form selected and filled when reopening", async () => {
            const fromInputValue = dateToAbsoluteInputFormat("2017-01-01");
            const toInputValue = dateToAbsoluteInputFormat("2018-01-01");

            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });

            openAbsoluteFormFilter(wrapper);
            writeToAbsoluteFormInputFrom(wrapper, fromInputValue);
            writeToAbsoluteFormInputTo(wrapper, toInputValue);
            clickApplyButton(wrapper);

            setPropsFromOnApply(wrapper, onApply, 0);

            expect(getDateFilterButtonText(wrapper)).toEqual("1/1/2017–1/1/2018");

            clickDateFilterButton(wrapper);

            expect(getSelectedItemText(wrapper)).toEqual("Static period");
            expect(getAbsoluteFormInputFromValue(wrapper)).toEqual(fromInputValue);
            expect(getAbsoluteFormInputToValue(wrapper)).toEqual(toInputValue);
        });

        it("Should keep relative form selected and filled when reopening", async () => {
            const onApply = jest.fn();
            const wrapper = createDateFilter({ onApply });

            openRelativeFormFilter(wrapper);
            clickRelativeFormGranularity(wrapper, "year");

            setRelativeFormInputs(wrapper, "-2", "2");

            clickApplyButton(wrapper);
            expect(onApply).toHaveBeenCalledTimes(1);
            setPropsFromOnApply(wrapper, onApply, 0);

            clickDateFilterButton(wrapper);
            expect(isRelativeFormGranularitySelected(wrapper, "year")).toBe(true);
            expect(getSelectedItemText(wrapper)).toEqual("Floating range");
            expect(getRelativeFormInputFromValue(wrapper)).toEqual("2 years ago");
            expect(getRelativeFormInputToValue(wrapper)).toEqual("2 years ahead");
        });
    });

    describe("exclude", () => {
        it("Should has for 'All time' option Exclude current period disabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(true);
        });

        it("Should has for selected option ending in today Exclude current period enabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-12-months");
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(false);
        });

        it("Should has for selected option not ending in today Exclude current period enabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-month");
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(true);
        });

        it("Should has for selected option only for today Exclude current period enabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "this-year");
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(true);
        });

        it("Should has for selected option 'Relative filter form' Exclude current period disabled", async () => {
            const wrapper = createDateFilter();
            openRelativeFormFilter(wrapper);
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(true);
        });

        it("Should has for selected option 'Absolute filter form' Exclude current period disabled", async () => {
            const wrapper = createDateFilter();
            openAbsoluteFormFilter(wrapper);
            expect(isExcludeCurrentPeriodDisabled(wrapper)).toBe(true);
        });

        it("Should not unchecked when switching from preset with Exclude current period checked to a preset that has it enabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-12-months");
            setExcludeCurrentPeriodCheckBox(wrapper, true);
            expect(isExcludeCurrentPeriodChecked(wrapper)).toBe(true);
            clickStaticFilter(wrapper, "last-7-days");
            expect(isExcludeCurrentPeriodChecked(wrapper)).toBe(true);
        });

        it("Should unchecked when switching from preset with Exclude current period checked to a preset that has it disabled", async () => {
            const wrapper = createDateFilter();
            clickDateFilterButton(wrapper);
            clickStaticFilter(wrapper, "last-12-months");
            setExcludeCurrentPeriodCheckBox(wrapper, true);
            expect(isExcludeCurrentPeriodChecked(wrapper)).toBe(true);
            clickStaticFilter(wrapper, "last-month");
            expect(isExcludeCurrentPeriodChecked(wrapper)).toBe(false);
        });

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
        ])(
            "Should switch to static date filter to %s  with exclude this period checked",
            (item: string, relativePreset: any[]) => {
                const onApply = jest.fn();
                const wrapper = createDateFilter({ onApply });

                clickDateFilterButton(wrapper);
                clickStaticFilter(wrapper, item);
                setExcludeCurrentPeriodCheckBox(wrapper, true);
                expect(isExcludeCurrentPeriodChecked(wrapper)).toBe(true);
                clickApplyButton(wrapper);

                const expectedSelectedItem = getPresetByItem(item, relativePreset);
                expect(onApply).toHaveBeenCalledTimes(1);
                expect(onApply).toBeCalledWith(expectedSelectedItem, true);
            },
        );
    });

    describe("Relative presets", () => {
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

            const expectedSelectedItem = getPresetByItem(item, relativePreset);

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
                const selectedFilterOption = getPresetByItem(item, relativePreset);
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

    describe("Absolute presets", () => {
        it.each([["christmas-2019"], ["year-2018"]])(
            "Should switch to static date filter to %s",
            (item: string) => {
                const onApply = jest.fn();
                const wrapper = createDateFilter({ onApply });

                clickDateFilterButton(wrapper);

                clickAbsoluteFilter(wrapper, item);
                clickApplyButton(wrapper);

                const expectedSelectedItem = getPresetByItem(item, defaultDateFilterOptions.absolutePreset);

                expect(onApply).toHaveBeenCalledTimes(1);
                expect(onApply).toBeCalledWith(expectedSelectedItem, false);
            },
        );
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
