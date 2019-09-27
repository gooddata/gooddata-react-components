// (C) 2019 GoodData Corporation
import * as moment from "moment";
import groupBy = require("lodash/groupBy");
import { ExtendedDateFilters } from "@gooddata/typings";
import { platformDateFormat } from "../../../../constants/Platform";
import { removeEmptyKeysFromDateFilterOptions } from "./GroupUtils";
import { sanitizeDateFilterOption } from "./OptionSanitization";

const convertAllTime = (
    filter: ExtendedDateFilters.IDateFilterAllTime | undefined,
): ExtendedDateFilters.IAllTimeDateFilter | undefined =>
    filter && {
        ...filter,
        type: "allTime",
    };

const convertAbsoluteForm = (
    filter: ExtendedDateFilters.IDateFilterAbsoluteForm | undefined,
): ExtendedDateFilters.IAbsoluteDateFilterForm | undefined =>
    filter && {
        ...filter,
        from: moment()
            .subtract(1, "month")
            .startOf("day")
            .format(platformDateFormat),
        to: moment()
            .startOf("day")
            .format(platformDateFormat),
        type: "absoluteForm",
    };

const convertRelativeForm = (
    filter: ExtendedDateFilters.IDateFilterRelativeForm | undefined,
): ExtendedDateFilters.IRelativeDateFilterForm | undefined =>
    filter && {
        availableGranularities: filter.granularities,
        from: undefined,
        // we order the granularities anyway, this lets the user to config the default
        granularity: filter.granularities[0],
        localIdentifier: filter.localIdentifier,
        name: filter.name,
        to: undefined,
        type: "relativeForm",
        visible: filter.visible,
    };

const convertAbsolutePresets = (
    filters: ExtendedDateFilters.IDateFilterAbsolutePreset[] | undefined,
): ExtendedDateFilters.IAbsoluteDateFilterPreset[] | undefined =>
    filters &&
    filters.map(
        (preset): ExtendedDateFilters.IAbsoluteDateFilterPreset =>
            sanitizeDateFilterOption({
                ...preset,
                type: "absolutePreset",
            }),
    );

const convertRelativePresets = (
    filters: ExtendedDateFilters.IDateFilterRelativePreset[] | undefined,
): ExtendedDateFilters.DateFilterRelativeOptionGroup | undefined =>
    filters &&
    groupBy(
        filters.map(
            (preset): ExtendedDateFilters.IRelativeDateFilterPreset =>
                sanitizeDateFilterOption({
                    ...preset,
                    type: "relativePreset",
                }),
        ),
        preset => preset.granularity,
    );

export const convertDateFilterConfigToDateFilterOptions = (
    config: ExtendedDateFilters.IDateFilterConfigContent,
): ExtendedDateFilters.IDateFilterOptionsByType => {
    const allTime = convertAllTime(config.allTime);
    const absoluteForm = convertAbsoluteForm(config.absoluteForm);
    const relativeForm = convertRelativeForm(config.relativeForm);
    const absolutePreset = convertAbsolutePresets(config.absolutePresets);
    const relativePreset = convertRelativePresets(config.relativePresets);

    return removeEmptyKeysFromDateFilterOptions({
        allTime,
        absoluteForm,
        absolutePreset,
        relativeForm,
        relativePreset,
    });
};
