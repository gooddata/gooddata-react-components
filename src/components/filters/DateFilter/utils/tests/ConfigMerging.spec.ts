// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import { mergeProjectConfigWithDashboardConfig } from "../ConfigMerging";
import {
    relativeForm,
    lastMonth,
    lastYear,
    allTime,
    absoluteForm,
    year2019,
} from "./ConfigFixtures";

describe("mergeProjectConfigWithDashboardConfig", () => {
    it("should properly hide granularities", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            relativeForm,
            relativePresets: [lastMonth, lastYear],
            selectedOption: relativeForm.localIdentifier,
        };

        const dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig = {
            hideGranularities: ["GDC.time.month"],
            mode: "active",
            filterName: "",
        };

        const expected: ExtendedDateFilters.IDateFilterConfigContent = {
            relativeForm: {
                ...relativeForm,
                granularities: ["GDC.time.year"],
            },
            relativePresets: [
                {
                    ...lastMonth,
                    visible: false,
                },
                lastYear,
            ],
            selectedOption: relativeForm.localIdentifier,
        };

        const actual = mergeProjectConfigWithDashboardConfig(projectConfig, dashboardConfig);
        expect(actual).toEqual(expected);
    });

    it("should properly hide options", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            absoluteForm,
            absolutePresets: [year2019],
            relativeForm,
            relativePresets: [lastMonth],
            selectedOption: allTime.localIdentifier,
        };

        const dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig = {
            hideOptions: [allTime.localIdentifier, absoluteForm.localIdentifier, year2019.localIdentifier],
            mode: "active",
            filterName: "",
        };

        const expected: ExtendedDateFilters.IDateFilterConfigContent = {
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
            relativeForm,
            relativePresets: [lastMonth],
            selectedOption: allTime.localIdentifier,
        };

        const actual = mergeProjectConfigWithDashboardConfig(projectConfig, dashboardConfig);
        expect(actual).toEqual(expected);
    });

    it("should properly add presets", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            selectedOption: allTime.localIdentifier,
        };

        const dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig = {
            addPresets: {
                absolutePresets: [year2019],
                relativePresets: [lastMonth],
            },
            mode: "active",
            filterName: "",
        };

        const expected: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            absolutePresets: [year2019],
            relativePresets: [lastMonth],
            selectedOption: allTime.localIdentifier,
        };

        const actual = mergeProjectConfigWithDashboardConfig(projectConfig, dashboardConfig);
        expect(actual).toEqual(expected);
    });

    it("should properly add presets with duplicities", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            selectedOption: allTime.localIdentifier,
        };

        const dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig = {
            addPresets: {
                absolutePresets: [year2019, year2019],
                relativePresets: [lastMonth],
            },
            mode: "active",
            filterName: "",
        };

        const expected: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            absolutePresets: [year2019],
            relativePresets: [lastMonth],
            selectedOption: allTime.localIdentifier,
        };

        const actual = mergeProjectConfigWithDashboardConfig(projectConfig, dashboardConfig);
        expect(actual).toEqual(expected);
    });

    it("should hide added presets for granularities (RAIL-1599)", () => {
        const projectConfig: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            selectedOption: allTime.localIdentifier,
        };

        const dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig = {
            addPresets: {
                relativePresets: [lastMonth, lastYear],
            },
            hideGranularities: ["GDC.time.month"],
            mode: "active",
            filterName: "",
        };

        const expected: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime,
            relativePresets: [{ ...lastMonth, visible: false }, lastYear],
            selectedOption: allTime.localIdentifier,
        };

        const actual = mergeProjectConfigWithDashboardConfig(projectConfig, dashboardConfig);
        expect(actual).toEqual(expected);
    });
});
