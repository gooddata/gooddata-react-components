// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import {
    canExcludeCurrentPeriod,
    normalizeSelectedFilterOption,
    applyExcludeCurrentPeriod,
} from "../ExtendedDateFilter";

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

describe("canExcludeCurrentPeriod", () => {
    it.each([
        [
            false,
            "allTime",
            {
                type: "allTime",
                name: "filters.allTime.title",
                localIdentifier: "ALL_TIME",
                visible: true,
            },
        ],
        [
            true,
            "relativePreset ending in today",
            {
                from: -29,
                to: 0,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "LAST_30_DAYS",
                visible: true,
            },
        ],
        [
            false,
            "invisible relativePreset ending in today",
            {
                from: -29,
                to: 0,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "LAST_30_DAYS",
                visible: false,
            },
        ],
        [
            false,
            "relativePreset not ending in today",
            {
                from: -29,
                to: 10,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "FOO",
                visible: true,
            },
        ],
        [
            false,
            "relativePreset ending for just today",
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "TODAY",
                visible: true,
            },
        ],
        [
            false,
            "relativeForm",
            {
                from: -299,
                to: 10,
                granularity: "GDC.time.date",
                type: "relativeForm",
                localIdentifier: "RELATIVE_FORM",
                visible: true,
            },
        ],
        [
            false,
            "absoluteForm",
            {
                from: "2019-01-01",
                to: "2019-01-02",
                type: "absoluteForm",
                localIdentifier: "ABSOLUTE_FORM",
                visible: true,
            },
        ],
        [
            false,
            "absolutePreset",
            {
                from: "2019-01-01",
                to: "2019-01-02",
                type: "absolutePreset",
                localIdentifier: "FOO",
                visible: true,
            },
        ],
    ])("should return %p for %s", (expected: boolean, _, input: ExtendedDateFilters.DateFilterOption) => {
        const actual = canExcludeCurrentPeriod(input);
        expect(actual).toEqual(expected);
    });
});

describe("applyExcludeCurrentPeriod", () => {
    it("should do nothing when passed excludeCurrentPeriod: false", () => {
        const input: ExtendedDateFilters.IRelativeDateFilterPreset = {
            from: -29,
            to: 0,
            granularity: "GDC.time.date",
            type: "relativePreset",
            name: "filters.last30days.title",
            localIdentifier: "LAST_30_DAYS",
            visible: true,
        };
        const actual = applyExcludeCurrentPeriod(input, false);
        expect(actual).toEqual(input);
    });

    it.each([
        [
            "allTime",
            {
                type: "allTime",
                name: "filters.allTime.title",
                localIdentifier: "ALL_TIME",
            },
        ],
        [
            "relativePreset ending in today",
            {
                from: -29,
                to: 0,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "LAST_30_DAYS",
            },
            {
                from: -29,
                to: -1,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "LAST_30_DAYS",
            },
        ],
        [
            "relativePreset not ending in today",
            {
                from: -29,
                to: 10,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "FOO",
            },
        ],
        [
            "relativePreset ending for just today",
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.date",
                type: "relativePreset",
                name: "filters.last30days.title",
                localIdentifier: "TODAY",
            },
        ],
        [
            "relativeForm",
            {
                from: -299,
                to: 10,
                granularity: "GDC.time.date",
                type: "relativeForm",
                localIdentifier: "RELATIVE_FORM",
            },
        ],
        [
            "absoluteForm",
            {
                from: "2019-01-01",
                to: "2019-01-02",
                type: "absoluteForm",
                localIdentifier: "ABSOLUTE_FORM",
            },
        ],
        [
            "absolutePreset",
            {
                from: "2019-01-01",
                to: "2019-01-02",
                type: "absolutePreset",
                localIdentifier: "FOO",
            },
        ],
    ])(
        "should handle %s properly",
        (
            _,
            input: ExtendedDateFilters.DateFilterOption,
            expected: ExtendedDateFilters.DateFilterOption = input,
        ) => {
            const actual = applyExcludeCurrentPeriod(input, true);
            expect(actual).toEqual(expected);
        },
    );
});
