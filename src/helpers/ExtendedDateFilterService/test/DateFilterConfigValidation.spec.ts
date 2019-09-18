// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { validateDateFilterConfig, isSelectedOptionValid } from "../DateFilterConfigValidation";
import { allTime, absoluteForm, year2019, relativeForm, lastMonth } from "./DateFilterConfigFixtures";

describe("validateDateFilterConfig", () => {
    it("should validate valid config", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            absoluteForm,
            absolutePresets: [year2019],
            relativeForm,
            relativePresets: [lastMonth],
            selectedOption: allTime.localIdentifier,
        };

        const actual = validateDateFilterConfig(projectConfig);
        expect(actual).toEqual("Valid");
    });

    it("should not validate falsy config", () => {
        const actual = validateDateFilterConfig(undefined);
        expect(actual).toEqual("NoConfigProvided");
    });

    it("should not validate config with no visible options", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                ...allTime,
                visible: false,
            },
            absoluteForm: {
                ...absoluteForm,
                visible: false,
            },
            absolutePresets: [
                {
                    ...year2019,
                    visible: false,
                },
            ],
            relativeForm: {
                ...relativeForm,
                visible: false,
            },
            relativePresets: [
                {
                    ...lastMonth,
                    visible: false,
                },
            ],
            selectedOption: allTime.localIdentifier,
        };

        const actual = validateDateFilterConfig(projectConfig);
        expect(actual).toEqual("NoVisibleOptions");
    });

    it("should not validate config with relative form with no granularities as the only visible option", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                ...allTime,
                visible: false,
            },
            absoluteForm: {
                ...absoluteForm,
                visible: false,
            },
            absolutePresets: [
                {
                    ...year2019,
                    visible: false,
                },
            ],
            relativeForm: {
                ...relativeForm,
                granularities: [],
            },
            relativePresets: [
                {
                    ...lastMonth,
                    visible: false,
                },
            ],
            selectedOption: allTime.localIdentifier,
        };

        const actual = validateDateFilterConfig(projectConfig);
        expect(actual).toEqual("NoVisibleOptions");
    });

    it("should not validate config with non-unique localIdentifiers", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                ...allTime,
                localIdentifier: "FOO",
            },
            absoluteForm: {
                ...absoluteForm,
                localIdentifier: "FOO",
            },
            selectedOption: "FOO",
        };

        const actual = validateDateFilterConfig(projectConfig);
        expect(actual).toEqual("ConflictingIdentifiers");
    });
});

describe("isSelectedOptionValid", () => {
    it("should validate config with visible selected option", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            absoluteForm,
            selectedOption: allTime.localIdentifier,
        };

        const actual = isSelectedOptionValid(projectConfig);
        expect(actual).toEqual(true);
    });

    it("should not validate config with selected option not visible", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                ...allTime,
                visible: false,
            },
            absoluteForm,
            selectedOption: allTime.localIdentifier,
        };

        const actual = isSelectedOptionValid(projectConfig);
        expect(actual).toEqual(false);
    });

    it("should not validate config with non-existing selected option", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                ...allTime,
                visible: false,
            },
            absoluteForm,
            selectedOption: "INVALID",
        };

        const actual = isSelectedOptionValid(projectConfig);
        expect(actual).toEqual(false);
    });
});
