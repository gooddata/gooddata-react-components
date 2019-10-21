// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { getDateFilterTitle } from "../DateFilterTitle";
import {
    allTimeFilter,
    absoluteFormFilter,
    absoluteFormFilterOneDay,
    absolutePresetFilter,
    relativePresetFilter,
} from "./fixtures";
import { serializingTranslator } from "../Translators";

describe("getDateFilterTitle", () => {
    it("should return the correct translation for allTime filter", () => {
        const expected = "filters.allTime.title__undefined";
        const actual = getDateFilterTitle(allTimeFilter, serializingTranslator);
        expect(actual).toEqual(expected);
    });

    it("should return the correct translation for absolute form filter", () => {
        // make sure the formatter receives proper formatting options
        const expectedOptions = { year: "numeric", month: "numeric", day: "numeric" };
        const expectedFrom = `2019-01-01__${JSON.stringify(expectedOptions)}`;
        const expectedTo = `2019-02-01__${JSON.stringify(expectedOptions)}`;
        const expected = `${expectedFrom}\u2013${expectedTo}`;
        const actual = getDateFilterTitle(absoluteFormFilter, serializingTranslator);
        expect(actual).toEqual(expected);
    });

    it("should return the correct translation for absolute form filter for one day", () => {
        // make sure the formatter receives proper formatting options
        const expectedOptions = { year: "numeric", month: "numeric", day: "numeric" };
        const expected = `2019-01-01__${JSON.stringify(expectedOptions)}`;
        const actual = getDateFilterTitle(absoluteFormFilterOneDay, serializingTranslator);
        expect(actual).toEqual(expected);
    });

    it("should return the correct translation for absolute preset filter", () => {
        const expected = "foo";
        const actual = getDateFilterTitle(absolutePresetFilter, serializingTranslator);
        expect(actual).toEqual(expected);
    });

    type RelativeFilterTestData = [number, number, ExtendedDateFilters.DateFilterGranularity, string, any];
    it.each([
        // days
        [0, 0, "GDC.time.date", "filters.thisDay.title", undefined],
        [-1, -1, "GDC.time.date", "filters.lastDay.title", undefined],
        [1, 1, "GDC.time.date", "filters.nextDay.title", undefined],
        [-6, 0, "GDC.time.date", "filters.lastNDays", { n: 7 }],
        [0, 6, "GDC.time.date", "filters.nextNDays", { n: 7 }],
        [-6, -2, "GDC.time.date", "filters.interval.days.past", { from: 6, to: 2 }],
        [2, 6, "GDC.time.date", "filters.interval.days.future", { from: 2, to: 6 }],
        [-5, 5, "GDC.time.date", "filters.interval.days.mixed", { from: 5, to: 5 }],
        // weeks
        [0, 0, "GDC.time.week_us", "filters.thisWeek.title", undefined],
        [-1, -1, "GDC.time.week_us", "filters.lastWeek.title", undefined],
        [1, 1, "GDC.time.week_us", "filters.nextWeek.title", undefined],
        [-6, 0, "GDC.time.week_us", "filters.lastNWeeks", { n: 7 }],
        [0, 6, "GDC.time.week_us", "filters.nextNWeeks", { n: 7 }],
        [-6, -2, "GDC.time.week_us", "filters.interval.weeks.past", { from: 6, to: 2 }],
        [2, 6, "GDC.time.week_us", "filters.interval.weeks.future", { from: 2, to: 6 }],
        [-5, 5, "GDC.time.week_us", "filters.interval.weeks.mixed", { from: 5, to: 5 }],
        // months
        [0, 0, "GDC.time.month", "filters.thisMonth.title", undefined],
        [-1, -1, "GDC.time.month", "filters.lastMonth.title", undefined],
        [1, 1, "GDC.time.month", "filters.nextMonth.title", undefined],
        [-6, 0, "GDC.time.month", "filters.lastNMonths", { n: 7 }],
        [0, 6, "GDC.time.month", "filters.nextNMonths", { n: 7 }],
        [-6, -2, "GDC.time.month", "filters.interval.months.past", { from: 6, to: 2 }],
        [2, 6, "GDC.time.month", "filters.interval.months.future", { from: 2, to: 6 }],
        [-5, 5, "GDC.time.month", "filters.interval.months.mixed", { from: 5, to: 5 }],
        // quarters
        [0, 0, "GDC.time.quarter", "filters.thisQuarter.title", undefined],
        [-1, -1, "GDC.time.quarter", "filters.lastQuarter.title", undefined],
        [1, 1, "GDC.time.quarter", "filters.nextQuarter.title", undefined],
        [-6, 0, "GDC.time.quarter", "filters.lastNQuarters", { n: 7 }],
        [0, 6, "GDC.time.quarter", "filters.nextNQuarters", { n: 7 }],
        [-6, -2, "GDC.time.quarter", "filters.interval.quarters.past", { from: 6, to: 2 }],
        [2, 6, "GDC.time.quarter", "filters.interval.quarters.future", { from: 2, to: 6 }],
        [-5, 5, "GDC.time.quarter", "filters.interval.quarters.mixed", { from: 5, to: 5 }],
        // years
        [0, 0, "GDC.time.year", "filters.thisYear.title", undefined],
        [-1, -1, "GDC.time.year", "filters.lastYear.title", undefined],
        [1, 1, "GDC.time.year", "filters.nextYear.title", undefined],
        [-6, 0, "GDC.time.year", "filters.lastNYears", { n: 7 }],
        [0, 6, "GDC.time.year", "filters.nextNYears", { n: 7 }],
        [-6, -2, "GDC.time.year", "filters.interval.years.past", { from: 6, to: 2 }],
        [2, 6, "GDC.time.year", "filters.interval.years.future", { from: 2, to: 6 }],
        [-5, 5, "GDC.time.year", "filters.interval.years.mixed", { from: 5, to: 5 }],
    ] as RelativeFilterTestData[])(
        "should return the correct translation for relative form filter (from: %i, to: %i, granularity: %s)",
        (
            from: number,
            to: number,
            granularity: ExtendedDateFilters.DateFilterGranularity,
            expectedId: string,
            expectedValues: {},
        ) => {
            const filter: ExtendedDateFilters.IRelativeDateFilterForm = {
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity,
                from,
                to,
                availableGranularities: [granularity],
                name: "",
                visible: true,
            };

            const expected = `${expectedId}__${JSON.stringify(expectedValues)}`;
            const actual = getDateFilterTitle(filter, serializingTranslator);
            expect(actual).toEqual(expected);
        },
    );

    type RelativeFilterExcludeTestData = [
        number,
        number,
        ExtendedDateFilters.DateFilterGranularity,
        string,
        any
    ];
    it.each([
        // days
        [0, 0, "GDC.time.date", "filters.thisDay.title", undefined],
        [-1, -1, "GDC.time.date", "filters.lastDay.title", undefined],
        [1, 1, "GDC.time.date", "filters.nextDay.title", undefined],
        [-7, -1, "GDC.time.date", "filters.interval.days.past", { from: 7, to: 1 }],
        [-6, 0, "GDC.time.date", "filters.lastNDays", { n: 7 }],
        // weeks
        [0, 0, "GDC.time.week_us", "filters.thisWeek.title", undefined],
        [-1, -1, "GDC.time.week_us", "filters.lastWeek.title", undefined],
        [1, 1, "GDC.time.week_us", "filters.nextWeek.title", undefined],
        [-7, -1, "GDC.time.week_us", "filters.interval.weeks.past", { from: 7, to: 1 }],
        [-6, 0, "GDC.time.week_us", "filters.lastNWeeks", { n: 7 }],
        // months
        [0, 0, "GDC.time.month", "filters.thisMonth.title", undefined],
        [-1, -1, "GDC.time.month", "filters.lastMonth.title", undefined],
        [1, 1, "GDC.time.month", "filters.nextMonth.title", undefined],
        [-7, -1, "GDC.time.month", "filters.interval.months.past", { from: 7, to: 1 }],
        [-6, 0, "GDC.time.month", "filters.lastNMonths", { n: 7 }],
        // quarters
        [0, 0, "GDC.time.quarter", "filters.thisQuarter.title", undefined],
        [-1, -1, "GDC.time.quarter", "filters.lastQuarter.title", undefined],
        [1, 1, "GDC.time.quarter", "filters.nextQuarter.title", undefined],
        [-7, -1, "GDC.time.quarter", "filters.interval.quarters.past", { from: 7, to: 1 }],
        [-6, 0, "GDC.time.quarter", "filters.lastNQuarters", { n: 7 }],
        // years
        [0, 0, "GDC.time.year", "filters.thisYear.title", undefined],
        [-1, -1, "GDC.time.year", "filters.lastYear.title", undefined],
        [1, 1, "GDC.time.year", "filters.nextYear.title", undefined],
        [-7, -1, "GDC.time.year", "filters.interval.years.past", { from: 7, to: 1 }],
        [-6, 0, "GDC.time.year", "filters.lastNYears", { n: 7 }],
    ] as RelativeFilterExcludeTestData[])(
        "should return the correct translation for relative form filter (from: %i, to: %i, granularity: %s)",
        (
            from: number,
            to: number,
            granularity: ExtendedDateFilters.DateFilterGranularity,
            expectedId: string,
            expectedValues: {},
        ) => {
            const filter: ExtendedDateFilters.IRelativeDateFilterForm = {
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity,
                from,
                to,
                availableGranularities: [granularity],
                name: "",
                visible: true,
            };

            const expected = `${expectedId}__${JSON.stringify(expectedValues)}`;
            const actual = getDateFilterTitle(filter, serializingTranslator);
            expect(actual).toEqual(expected);
        },
    );

    it("should return the correct translation for relative preset filter with name", () => {
        const expected = "foo";
        const actual = getDateFilterTitle(relativePresetFilter, serializingTranslator);
        expect(actual).toEqual(expected);
    });

    it("should return the correct translation for relative preset filter with empty name", () => {
        const filter = { ...relativePresetFilter, name: "" };
        const expectedId = "filters.interval.days.mixed";
        const expectedValues = { from: 5, to: 5 };
        const expected = `${expectedId}__${JSON.stringify(expectedValues)}`;
        const actual = getDateFilterTitle(filter, serializingTranslator);
        expect(actual).toEqual(expected);
    });
});
