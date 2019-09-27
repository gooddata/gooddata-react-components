// (C) 2007-2019 GoodData Corporation
import { granularityIntlCodes } from "./constants/i18n";
import { defaultDateFilterOptions, defaultDateFilterProjectConfig } from "./constants/config";
import { validateFilterOption } from "./validation/OptionValidation";
import { mapDateFilterOptionToDateFilterValue } from "./utils/ValueConversions";
import { convertDateFilterConfigToDateFilterOptions } from "./utils/ConfigConversions";
import { removeEmptyKeysFromDateFilterOptions } from "./utils/GroupUtils";
import { mergeProjectConfigWithDashboardConfig } from "./utils/ConfigMerging";
import * as Translators from "./utils/Translations/Translators";
import {
    mapAllTimeFilterToAfm,
    mapAbsoluteFilterToAfm,
    mapRelativeFilterToAfm,
} from "./utils/AFMConversions";
import { applyExcludeCurrentPeriod, canExcludeCurrentPeriod } from "./utils/PeriodExlusion";
import { getDateFilterTitle, getDateFilterRepresentation } from "./utils/Translations/DateFilterTitle";
import {
    validateDateFilterConfig,
    getDateFilterConfigValidationMessages,
    isSelectedOptionValid,
} from "./utils/ConfigValidation";
import { DateFilter, IDateFilterCallbackProps, IDateFilterStateProps } from "./DateFilter";

const DateFilterHelpers = {
    validateFilterOption,
    mapDateFilterOptionToDateFilterValue,
    convertDateFilterConfigToDateFilterOptions,
    removeEmptyKeysFromDateFilterOptions,
    mapAllTimeFilterToAfm,
    mapAbsoluteFilterToAfm,
    mapRelativeFilterToAfm,
    getDateFilterTitle,
    getDateFilterRepresentation,
    validateDateFilterConfig,
    getDateFilterConfigValidationMessages,
    mergeProjectConfigWithDashboardConfig,
    isSelectedOptionValid,
    granularityIntlCodes,
    applyExcludeCurrentPeriod,
    defaultDateFilterOptions,
    defaultDateFilterProjectConfig,
    canExcludeCurrentPeriod,
};

// This is 1:1 reexported by root index.ts and is part of SDK's public API!
export {
    DateFilter,
    IDateFilterCallbackProps,
    IDateFilterStateProps,
    DateFilterHelpers,
    Translators as DateFilterTranslators,
};
