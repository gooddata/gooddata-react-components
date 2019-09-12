// (C) 2019 GoodData Corporation
import groupBy from "lodash/groupBy";
import { ExtendedDateFilters } from "@gooddata/typings";

const getDuplicateIdentifiers = (options: ExtendedDateFilters.IDateFilterBase[]): string[] => {
    const groups = groupBy(options, (filter: ExtendedDateFilters.IDateFilterBase) => filter.localIdentifier);
    const duplicates = Object.keys(groups).filter(localIdentifier => groups[localIdentifier].length > 1);
    if (duplicates.length) {
        // tslint:disable-next-line: no-console
        console.warn(
            `There were duplicate localIdentifiers in the date filter config: ${duplicates.join(",")}`,
        );
    }
    return duplicates;
};

const isFilterVisible = (filter: ExtendedDateFilters.IDateFilterBase): boolean => filter && filter.visible;
const containsVisibleFilter = (filters: ExtendedDateFilters.IDateFilterBase[]): boolean =>
    filters && filters.some(isFilterVisible);

const isRelativeFormVisible = (filter: ExtendedDateFilters.IDateFilterRelativeForm): boolean =>
    isFilterVisible(filter) && filter.granularities && filter.granularities.length > 0;

const isAnyFilterVisible = (config: ExtendedDateFilters.IDateFilterConfigContent): boolean =>
    isFilterVisible(config.allTime) ||
    isFilterVisible(config.absoluteForm) ||
    isRelativeFormVisible(config.relativeForm) ||
    containsVisibleFilter(config.absolutePresets) ||
    containsVisibleFilter(config.relativePresets);

const getAllOptionsFlattened = (config: ExtendedDateFilters.IDateFilterConfigContent) =>
    [
        config.allTime,
        config.absoluteForm,
        config.relativeForm,
        ...(config.absolutePresets || []),
        ...(config.relativePresets || []),
    ].filter(Boolean);

type DateFilterConfigValidationResult =
    | "Valid"
    | "NoConfigProvided"
    | "NoVisibleOptions"
    | "ConflictingIdentifiers";

export const validateDateFilterConfig = (
    config: ExtendedDateFilters.IDateFilterConfigContent,
): DateFilterConfigValidationResult => {
    if (!config) {
        return "NoConfigProvided";
    }

    if (!isAnyFilterVisible(config)) {
        return "NoVisibleOptions";
    }

    const allOptions = getAllOptionsFlattened(config);
    const duplicateIdentifiers = getDuplicateIdentifiers(allOptions);
    if (duplicateIdentifiers.length) {
        return "ConflictingIdentifiers";
    }

    return "Valid";
};

export const isSelectedOptionValid = (config: ExtendedDateFilters.IDateFilterConfigContent): boolean => {
    // only presets and all time are allowed for now (RAIL-1598), so look only there
    const candidateOptions = [
        config.allTime,
        ...(config.absolutePresets || []),
        ...(config.relativePresets || []),
    ].filter(Boolean);

    const matchingOption = candidateOptions.find(option => option.localIdentifier === config.selectedOption);

    return matchingOption ? matchingOption.visible : false;
};

const validationMessages: { [R in DateFilterConfigValidationResult]: string[] } = {
    ConflictingIdentifiers: ["filters.config.warning.conflictingIdentifiers"],
    NoConfigProvided: ["filters.config.warning.notAvailable"],
    NoVisibleOptions: ["filters.config.warning.allOptionsHidden"],
    Valid: [],
};

export const getDateFilterConfigValidationMessages = (validationResult: DateFilterConfigValidationResult) =>
    validationMessages[validationResult];
