// (C) 2019 GoodData Corporation
import { ExtendedDateFilters } from "@gooddata/typings";
import lowerFirst = require("lodash/lowerFirst");
import { IMessageTranslator, IDateAndMessageTranslator } from "./Translators";
import { granularityIntlCodes } from "../../../components/filters/ExtendedDateFilter/constants/i18n";
import { getDateFilterRepresentation } from "./DateFilterTitle";

const getGeneralKpiPopLabel = (translator: IMessageTranslator): string =>
    translator.formatMessage({ id: "filters.allTime.previousPeriod" });

const getRelativeFilterKpiPopLabel = (
    filter: ExtendedDateFilters.IRelativeDateFilterForm | ExtendedDateFilters.IRelativeDateFilterPreset,
    translator: IMessageTranslator,
): string => {
    const intlGranularity = granularityIntlCodes[filter.granularity];
    if (!intlGranularity) {
        return "";
    }

    return translator.formatMessage(
        { id: `filters.${intlGranularity}.previousPeriod` },
        { n: Math.abs(filter.to - filter.from) + 1 },
    );
};

export const getKpiPopLabel = (
    filter: ExtendedDateFilters.DateFilterOption,
    comparisonType: "previousPeriod" | "lastYear",
    translator: IMessageTranslator,
): string => {
    if (comparisonType === "lastYear") {
        // This string is meant to be the same no matter the filter
        return translator.formatMessage({ id: "filters.allTime.lastYear" });
    }

    switch (filter.type) {
        case "absoluteForm":
            return getGeneralKpiPopLabel(translator);
        case "absolutePreset":
            return getGeneralKpiPopLabel(translator);
        case "allTime":
            return getGeneralKpiPopLabel(translator);
        case "relativeForm":
            return getRelativeFilterKpiPopLabel(filter, translator);
        case "relativePreset":
            return getRelativeFilterKpiPopLabel(filter, translator);
        default:
            throw new Error("Unknown DateFilterOption type");
    }
};

export type KpiAlertTranslationData = {
    rangeText: string;
    intlIdRoot: string;
} | null;

export function getKpiAlertTranslationData(
    filter: ExtendedDateFilters.DateFilterOption,
    translator: IDateAndMessageTranslator,
): KpiAlertTranslationData {
    if (filter.type === "allTime") {
        return null;
    }

    const rangeText = lowerFirst(getDateFilterRepresentation(filter, false, translator));

    const hasOneBoundToday = filter.from === 0 || filter.to === 0; // e.g. last 4 months, next 6 days
    const isLastOneX = filter.from === -1 && filter.to === -1; // e.g last month
    const isNextOneX = filter.from === 1 && filter.to === 1; // e.g. next month

    const intlIdRoot =
        ExtendedDateFilters.isRelativeDateFilterOption(filter) &&
        (hasOneBoundToday || isLastOneX || isNextOneX)
            ? "filters.alertMessage.relativePreset"
            : "filters.alertMessage.relativePreset.inPeriod";

    return {
        intlIdRoot,
        rangeText,
    };
}
