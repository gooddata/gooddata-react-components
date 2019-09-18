// (C) 2019 GoodData Corporation
import isEmpty = require("lodash/isEmpty");
import { ExtendedDateFilters } from "@gooddata/typings";

export const removeEmptyKeysFromDateFilterOptions = (
    dateFilterOptions: ExtendedDateFilters.IDateFilterOptionsByType,
): ExtendedDateFilters.IDateFilterOptionsByType => {
    const { absoluteForm, absolutePreset, allTime, relativeForm, relativePreset } = dateFilterOptions;
    return {
        ...(allTime && { allTime }),
        ...(absoluteForm && { absoluteForm }),
        ...(!isEmpty(absolutePreset) && { absolutePreset }),
        ...(relativeForm && { relativeForm }),
        ...(!isEmpty(relativePreset) && { relativePreset }),
    };
};
