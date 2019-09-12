// (C) 2007-2019 GoodData Corporation
import { granularityIntlCodes } from "./constants/i18n";
import { defaultDateFilterOptions } from "./constants/config";
import { validateFilterOption } from "./validation/OptionValidation";
import * as Translators from "./utils/Translations/Translators";
import { mapOptionToAfm } from "./utils/AFMConversions";
import { applyExcludeCurrentPeriod, canExcludeCurrentPeriod } from "./utils/PeriodExlusion";
import { getDateFilterTitle, getDateFilterRepresentation } from "./utils/Translations/DateFilterTitle";
import { DateFilter, IDateFilterCallbackProps, IDateFilterStateProps, IDateFilterProps } from "./DateFilter";

const DateFilterHelpers = {
    validateFilterOption,
    getDateFilterTitle,
    getDateFilterRepresentation,
    granularityIntlCodes,
    applyExcludeCurrentPeriod,
    defaultDateFilterOptions,
    canExcludeCurrentPeriod,
    mapOptionToAfm,
};

// This is 1:1 reexported by root index.ts and is part of SDK's public API
export {
    DateFilter,
    IDateFilterCallbackProps,
    IDateFilterStateProps,
    IDateFilterProps,
    DateFilterHelpers,
    Translators as DateFilterTranslators,
};
