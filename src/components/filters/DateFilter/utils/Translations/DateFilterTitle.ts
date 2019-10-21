// (C) 2019 GoodData Corporation
import capitalize = require("lodash/capitalize");
import * as moment from "moment";
import { ExtendedDateFilters } from "@gooddata/typings";

import { granularityIntlCodes } from "../../constants/i18n";
import { IMessageTranslator, IDateTranslator, IDateAndMessageTranslator } from "./Translators";

const formatAbsoluteDate = (date: Date | string, translator: IDateTranslator) =>
    translator.formatDate(date, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

const formatAbsoluteDateRange = (
    from: Date | string,
    to: Date | string,
    translator: IDateTranslator,
): string =>
    moment(from).isSame(moment(to), "day")
        ? formatAbsoluteDate(from, translator)
        : `${formatAbsoluteDate(from, translator)}\u2013${formatAbsoluteDate(to, translator)}`;

const relativeDateRangeFormatters: Array<{
    predicate: (from: number, to: number) => boolean;
    formatter: (
        from: number,
        to: number,
        intlGranularity: string,
        translator: IDateAndMessageTranslator,
    ) => string;
}> = [
    {
        // Today, This month
        predicate: (from, to) => from === 0 && to === 0,
        formatter: (_from, _to, intlGranularity, translator) =>
            translator.formatMessage({ id: `filters.this${capitalize(intlGranularity)}.title` }),
    },
    {
        // Tomorrow, Next month
        predicate: (from, to) => from === 1 && to === 1,
        formatter: (_from, _to, intlGranularity, translator) =>
            translator.formatMessage({ id: `filters.next${capitalize(intlGranularity)}.title` }),
    },
    {
        // Yesterday, Last month
        predicate: (from, to) => from === -1 && to === -1,
        formatter: (_from, _to, intlGranularity, translator) =>
            translator.formatMessage({ id: `filters.last${capitalize(intlGranularity)}.title` }),
    },
    {
        // Next N days (months)
        predicate: from => from === 0,
        formatter: (_from, to, intlGranularity, translator) =>
            translator.formatMessage(
                { id: `filters.nextN${capitalize(intlGranularity)}s` },
                { n: Math.abs(to) + 1 },
            ),
    },
    {
        // Last N days (months)
        predicate: (_from, to) => to === 0,
        formatter: (from, _to, intlGranularity, translator) =>
            translator.formatMessage(
                { id: `filters.lastN${capitalize(intlGranularity)}s` },
                { n: Math.abs(from) + 1 },
            ),
    },
    {
        // From N days ago to M days ago
        predicate: (from, to) => from < 0 && to < 0,
        formatter: (from, to, intlGranularity, translator) =>
            translator.formatMessage(
                { id: `filters.interval.${intlGranularity}s.past` },
                {
                    from: Math.abs(from),
                    to: Math.abs(to),
                },
            ),
    },
    {
        // From N days ahead to M days ahead
        predicate: (from, to) => from > 0 && to > 0,
        formatter: (from, to, intlGranularity, translator) =>
            translator.formatMessage(
                { id: `filters.interval.${intlGranularity}s.future` },
                {
                    from: Math.abs(from),
                    to: Math.abs(to),
                },
            ),
    },
    {
        // From N days ago to M days ahead
        predicate: () => true,
        formatter: (from, to, intlGranularity, translator) =>
            translator.formatMessage(
                { id: `filters.interval.${intlGranularity}s.mixed` },
                {
                    from: Math.abs(from),
                    to: Math.abs(to),
                },
            ),
    },
];

const formatRelativeDateRange = (
    from: number,
    to: number,
    granularity: ExtendedDateFilters.DateFilterGranularity,
    translator: IDateAndMessageTranslator,
): string => {
    const intlGranularity = granularityIntlCodes[granularity];
    const { formatter } = relativeDateRangeFormatters.find(f => f.predicate(from, to));
    return formatter(from, to, intlGranularity, translator);
};

const getAllTimeFilterRepresentation = (translator: IMessageTranslator): string =>
    translator.formatMessage({ id: "filters.allTime.title" });

const getAbsoluteFormFilterRepresentation = (
    filter: ExtendedDateFilters.IAbsoluteDateFilterForm,
    translator: IDateAndMessageTranslator,
): string => (filter.from && filter.to ? formatAbsoluteDateRange(filter.from, filter.to, translator) : "");

const getAbsolutePresetFilterRepresentation = (
    filter: ExtendedDateFilters.IAbsoluteDateFilterPreset,
    translator: IDateAndMessageTranslator,
): string => formatAbsoluteDateRange(filter.from, filter.to, translator);

const getRelativeFormFilterRepresentation = (
    filter: ExtendedDateFilters.IRelativeDateFilterForm,
    translator: IDateAndMessageTranslator,
): string =>
    typeof filter.from === "number" && typeof filter.to === "number"
        ? formatRelativeDateRange(filter.from, filter.to, filter.granularity, translator)
        : "";

const getRelativePresetFilterRepresentation = (
    filter: ExtendedDateFilters.IRelativeDateFilterPreset,
    translator: IDateAndMessageTranslator,
): string => formatRelativeDateRange(filter.from, filter.to, filter.granularity, translator);

/**
 * Gets the filter title favoring custom name if specified.
 * @returns {string} Representation of the filter (e.g. "My preset", "From 2 weeks ago to 1 week ahead")
 */
export const getDateFilterTitle = (
    filter: ExtendedDateFilters.DateFilterOption,
    translator: IDateAndMessageTranslator,
): string => {
    switch (filter.type) {
        case "absoluteForm":
        case "relativeForm":
            return getDateFilterRepresentation(filter, translator);
        case "allTime":
        case "absolutePreset":
        case "relativePreset":
            return filter.name || getDateFilterRepresentation(filter, translator);
        default:
            throw new Error("Unknown DateFilterOption type");
    }
};

/**
 * Gets the filter representation regardless of custom name.
 * @returns {string} Representation of the filter (e.g. "From 2 weeks ago to 1 week ahead")
 */
export const getDateFilterRepresentation = (
    filter: ExtendedDateFilters.DateFilterOption,
    translator: IDateAndMessageTranslator,
): string => {
    switch (filter.type) {
        case "absoluteForm":
            return getAbsoluteFormFilterRepresentation(filter, translator);
        case "absolutePreset":
            return getAbsolutePresetFilterRepresentation(filter, translator);
        case "allTime":
            return getAllTimeFilterRepresentation(translator);
        case "relativeForm":
            return getRelativeFormFilterRepresentation(filter, translator);
        case "relativePreset":
            return getRelativePresetFilterRepresentation(filter, translator);
        default:
            throw new Error("Unknown DateFilterOption type");
    }
};
