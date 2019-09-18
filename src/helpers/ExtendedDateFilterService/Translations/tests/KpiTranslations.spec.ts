// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { allTimeFilter, absoluteFormFilter, absolutePresetFilter, relativeFormFilter } from "./fixtures";
import { getKpiPopLabel, getKpiAlertTranslationData, KpiAlertTranslationData } from "../KpiTranslations";
import { serializingTranslator } from "../Translators";

describe("getKpiPopLabel", () => {
    it("should return the correct popLabel for lastYear comparison", () => {
        const expected = "filters.allTime.lastYear__undefined";
        const actual = getKpiPopLabel(allTimeFilter, "lastYear", serializingTranslator);
        expect(actual).toEqual(expected);
    });

    describe("previousPeriod comparison", () => {
        it("should return the correct popLabel for allTime filter", () => {
            const expected = "filters.allTime.previousPeriod__undefined";
            const actual = getKpiPopLabel(allTimeFilter, "previousPeriod", serializingTranslator);
            expect(actual).toEqual(expected);
        });

        it("should return the correct popLabel for absoluteForm filter", () => {
            const expected = "filters.allTime.previousPeriod__undefined";
            const actual = getKpiPopLabel(absoluteFormFilter, "previousPeriod", serializingTranslator);
            expect(actual).toEqual(expected);
        });

        it("should return the correct popLabel for absolutePreset filter", () => {
            const expected = "filters.allTime.previousPeriod__undefined";
            const actual = getKpiPopLabel(absolutePresetFilter, "previousPeriod", serializingTranslator);
            expect(actual).toEqual(expected);
        });

        it("should return the correct popLabel for relativeForm filter", () => {
            const expectedId = "filters.day.previousPeriod";
            const expectedValues = { n: 11 };
            const expected = `${expectedId}__${JSON.stringify(expectedValues)}`;
            const actual = getKpiPopLabel(relativeFormFilter, "previousPeriod", serializingTranslator);
            expect(actual).toEqual(expected);
        });

        it("should return the correct popLabel for relativePreset filter", () => {
            const filter: ExtendedDateFilters.IRelativeDateFilterPreset = {
                localIdentifier: "RELATIVE_PRESET_FOO",
                type: "relativePreset",
                from: -5,
                to: 5,
                granularity: "GDC.time.date",
                name: "Foo",
                visible: true,
            };

            const expectedId = "filters.day.previousPeriod";
            const expectedValues = { n: 11 };
            const expected = `${expectedId}__${JSON.stringify(expectedValues)}`;
            const actual = getKpiPopLabel(filter, "previousPeriod", serializingTranslator);
            expect(actual).toEqual(expected);
        });
    });
});

const generateRelativePreset = (
    from: number,
    to: number,
    granularity: ExtendedDateFilters.DateFilterGranularity,
): ExtendedDateFilters.DateFilterOption => {
    return {
        localIdentifier: "id",
        from,
        to,
        type: "relativePreset",
        granularity,
        name: "Preset",
        visible: true,
    };
};

type TranslationTestPair = [ExtendedDateFilters.DateFilterOption, KpiAlertTranslationData];

describe("getKpiAlertTranslationData", () => {
    it("should return null for unsupported filter", () => {
        const res = getKpiAlertTranslationData(
            {
                type: "allTime",
                localIdentifier: "id",
                name: "All time",
                visible: true,
            },
            serializingTranslator,
        );
        expect(res).toEqual(null);
    });

    const testedData: TranslationTestPair[] = [
        [
            generateRelativePreset(0, 0, "GDC.time.week_us"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset",
                rangeText: "filters.thisWeek.title__undefined",
            },
        ],
        [
            generateRelativePreset(-1, -1, "GDC.time.week_us"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset",
                rangeText: "filters.lastWeek.title__undefined",
            },
        ],

        [
            generateRelativePreset(-6, 0, "GDC.time.date"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset",
                rangeText: 'filters.lastNDays__{"n":7}',
            },
        ],
        [
            generateRelativePreset(-6, -1, "GDC.time.date"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset.inPeriod",
                rangeText: 'filters.interval.days.past__{"from":6,"to":1}',
            },
        ],

        [
            generateRelativePreset(-11, 0, "GDC.time.month"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset",
                rangeText: 'filters.lastNMonths__{"n":12}',
            },
        ],

        [
            generateRelativePreset(-3, 3, "GDC.time.month"),
            {
                intlIdRoot: "filters.alertMessage.relativePreset.inPeriod",
                rangeText: 'filters.interval.months.mixed__{"from":3,"to":3}',
            },
        ],
    ];
    it.each(testedData)(
        "should take relative relativePreset filter %o and return intl data %o",
        (input, output) => {
            expect(getKpiAlertTranslationData(input, serializingTranslator)).toEqual(output);
        },
    );
});
