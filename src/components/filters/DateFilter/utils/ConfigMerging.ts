// (C) 2019 GoodData Corporation
import flow = require("lodash/flow");
import uniqBy = require("lodash/uniqBy");
import * as stringify from "fast-json-stable-stringify";
import { ExtendedDateFilters } from "@gooddata/typings";
import { sanitizeDateFilterOption } from "./OptionSanitization";
// tslint:disable: ter-arrow-parens

type NonArrayFilterOptionKey = "absoluteForm" | "relativeForm" | "allTime";

type DashboardConfigMerger = (
    dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig,
) => (
    projectConfig: ExtendedDateFilters.IDateFilterConfigContent,
) => ExtendedDateFilters.IDateFilterConfigContent;

/**
 * Merges presets so that presets that are semantically unique are de-duplicated.
 * @param projectPresets
 * @param dashboardPresets
 */
const mergePresets = <
    T extends ExtendedDateFilters.IDateFilterAbsolutePreset | ExtendedDateFilters.IDateFilterRelativePreset
>(
    projectPresets: T[],
    dashboardPresets: T[],
): T[] => {
    const merged = [...(projectPresets || []), ...(dashboardPresets || [])].map(sanitizeDateFilterOption);

    return uniqBy(merged, stringify);
};

const addPresets: DashboardConfigMerger = dashboardConfig => projectConfig => {
    if (!dashboardConfig.addPresets) {
        return projectConfig;
    }

    const absolutePresets = mergePresets(
        projectConfig.absolutePresets,
        dashboardConfig.addPresets.absolutePresets,
    );
    const relativePresets = mergePresets(
        projectConfig.relativePresets,
        dashboardConfig.addPresets.relativePresets,
    );

    return {
        ...projectConfig,
        ...(absolutePresets.length ? { absolutePresets } : null),
        ...(relativePresets.length ? { relativePresets } : null),
    };
};

const hideNonArrayOptionType = (
    key: NonArrayFilterOptionKey,
): DashboardConfigMerger => dashboardConfig => projectConfig => {
    if (!projectConfig[key] || !projectConfig[key].visible || !dashboardConfig.hideOptions) {
        return projectConfig;
    }

    return dashboardConfig.hideOptions.includes(projectConfig[key].localIdentifier)
        ? {
              ...projectConfig,
              [key]: {
                  ...projectConfig[key],
                  visible: false,
              },
          }
        : projectConfig;
};

const hideAllTime = hideNonArrayOptionType("allTime");

const hideAbsoluteForm = hideNonArrayOptionType("absoluteForm");

const hideRelativeForm = hideNonArrayOptionType("relativeForm");

const hideRelativeFormGranularities: DashboardConfigMerger = dashboardConfig => projectConfig => {
    if (
        !projectConfig.relativeForm ||
        !projectConfig.relativeForm.visible ||
        !dashboardConfig.hideGranularities
    ) {
        return projectConfig;
    }

    const granularities = projectConfig.relativeForm.granularities.filter(
        granularity => !dashboardConfig.hideGranularities.includes(granularity),
    );

    return granularities.length > 0
        ? {
              ...projectConfig,
              relativeForm: {
                  ...projectConfig.relativeForm,
                  granularities,
              },
          }
        : projectConfig;
};

const hideAbsolutePresets: DashboardConfigMerger = dashboardConfig => projectConfig => {
    if (
        !projectConfig.absolutePresets ||
        !projectConfig.absolutePresets.length ||
        !dashboardConfig.hideOptions
    ) {
        return projectConfig;
    }

    const absolutePresets = projectConfig.absolutePresets.map(preset =>
        dashboardConfig.hideOptions.includes(preset.localIdentifier)
            ? {
                  ...preset,
                  visible: false,
              }
            : preset,
    );

    return {
        ...projectConfig,
        absolutePresets,
    };
};

const shouldHideRelativePreset = (
    preset: ExtendedDateFilters.IDateFilterRelativePreset,
    dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig,
): boolean => {
    const hideForGranularity =
        dashboardConfig.hideGranularities && dashboardConfig.hideGranularities.includes(preset.granularity);
    const hideForId =
        dashboardConfig.hideOptions && dashboardConfig.hideOptions.includes(preset.localIdentifier);

    return hideForGranularity || hideForId;
};

const hideRelativePresets: DashboardConfigMerger = dashboardConfig => projectConfig => {
    const canDashboardConfigHideRelativePreset =
        dashboardConfig.hideOptions || dashboardConfig.hideGranularities;

    if (
        !projectConfig.relativePresets ||
        !projectConfig.relativePresets.length ||
        !canDashboardConfigHideRelativePreset
    ) {
        return projectConfig;
    }

    const relativePresets = projectConfig.relativePresets.map(preset =>
        shouldHideRelativePreset(preset, dashboardConfig)
            ? {
                  ...preset,
                  visible: false,
              }
            : preset,
    );

    return {
        ...projectConfig,
        relativePresets,
    };
};

export const mergeProjectConfigWithDashboardConfig = (
    projectConfig: ExtendedDateFilters.IDateFilterConfigContent,
    dashboardConfig: ExtendedDateFilters.IDashboardDateFilterConfig,
): ExtendedDateFilters.IDateFilterConfigContent => {
    const pipeline = flow(
        addPresets(dashboardConfig),
        hideAllTime(dashboardConfig),
        hideAbsoluteForm(dashboardConfig),
        hideRelativeForm(dashboardConfig),
        hideRelativeFormGranularities(dashboardConfig),
        hideAbsolutePresets(dashboardConfig),
        hideRelativePresets(dashboardConfig),
    );

    return pipeline(projectConfig);
};
