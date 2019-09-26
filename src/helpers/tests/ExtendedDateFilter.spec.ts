// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { canExcludeCurrentPeriod } from "../ExtendedDateFilter";

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
