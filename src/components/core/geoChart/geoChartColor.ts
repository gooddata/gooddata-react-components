// (C) 2020 GoodData Corporation
import uniq = require("lodash/uniq");
import range = require("lodash/range");
import isNumber = require("lodash/isNumber");
import { Execution } from "@gooddata/typings";
import { DEFAULT_COLORS, parseRGBColorCode } from "../../visualizations/utils/color";
import { DEFAULT_PUSHPIN_COLOR_SCALE, DEFAULT_PUSHPIN_COLOR_VALUE } from "../../../constants/geoChart";
import { getHeaderItemName } from "../../../helpers/executionResultHelper";
import { IObjectMapping, IPushpinColor } from "../../../interfaces/GeoChart";

const DEFAULT_SEGMENT_ITEM = "default_segment_item";
const EMPTY_SEGMENT_ITEM = "empty_segment_item";
const DEFAULT_COLOR_INDEX_IN_PALETTE = DEFAULT_PUSHPIN_COLOR_SCALE - 1;

// copy from class HeatmapColorStrategy
function getCalculatedChannel(channel: number, index: number, step: number): number {
    return Math.trunc(channel + index * step);
}

// copy from class HeatmapColorStrategy
function getCalculatedColors(count: number, channels: number[], steps: number[]): string[] {
    return range(1, count).map(
        (index: number) =>
            `rgb(${getCalculatedChannel(channels[0], index, steps[0])},` +
            `${getCalculatedChannel(channels[1], index, steps[1])},` +
            `${getCalculatedChannel(channels[2], index, steps[2])})`,
    );
}

// copy from class HeatmapColorStrategy
function getColorPalette(baseColor: string): string[] {
    const { R: r, G: g, B: b } = parseRGBColorCode(baseColor);
    const channels = [r, g, b];
    const steps = channels.map(channel => (255 - channel) / DEFAULT_PUSHPIN_COLOR_SCALE);
    const generatedColors = getCalculatedColors(DEFAULT_PUSHPIN_COLOR_SCALE, channels, steps);
    return [...generatedColors.reverse(), baseColor];
}

export function getColorIndexInPalette(value: number, min: number, max: number): number {
    if (!isNumber(value) || value === min) {
        return 0;
    }

    if (value === max) {
        return DEFAULT_COLOR_INDEX_IN_PALETTE;
    }

    const step = (max - min) / DEFAULT_PUSHPIN_COLOR_SCALE;
    for (let i = 0, offset = min; i < DEFAULT_PUSHPIN_COLOR_SCALE; i++, offset += step) {
        if (offset >= value) {
            return i;
        }
    }

    return DEFAULT_COLOR_INDEX_IN_PALETTE;
}

export function getColorPaletteMapping(segmentItems: string[] = []): IObjectMapping {
    if (!segmentItems.length) {
        return {
            [DEFAULT_SEGMENT_ITEM]: getColorPalette(DEFAULT_COLORS[0]),
        };
    }

    const defaultColorsNumber = DEFAULT_COLORS.length;
    const colorPalettes = segmentItems.reduce(
        (result: string[][], _item: string, index: number): string[][] => {
            const colorPalette =
                index < defaultColorsNumber
                    ? getColorPalette(DEFAULT_COLORS[index])
                    : result[index - defaultColorsNumber]; // colors loop every DEFAULT_COLORS.length
            return [...result, colorPalette];
        },
        [],
    );

    return segmentItems.reduce(
        (result: IObjectMapping, item: string, index: number): IObjectMapping => ({
            ...result,
            [item]: colorPalettes[index],
        }),
        {},
    );
}

/**
 * Return RGB border and background colors base on color and segmentBy values
 *  Example:
 *      [any-number] => [{
 *           border: "rgb(127,224,198)",
 *           background: "rgb(215,242,250)",
 *      }]
 * @param colorValues
 * @param segmentByItems
 */
export function getPushpinColors(
    colorValues: number[],
    segmentByItems: Execution.IResultHeaderItem[] = [],
): IPushpinColor[] {
    if (!colorValues.length) {
        return [];
    }

    const colorsWithoutNull = colorValues.filter((color: number) => !(color === null || color === undefined));

    const min = Math.min(...colorsWithoutNull);
    const max = Math.max(...colorsWithoutNull);
    if (min === max) {
        return [
            {
                border: DEFAULT_PUSHPIN_COLOR_VALUE,
                background: DEFAULT_PUSHPIN_COLOR_VALUE,
            },
        ];
    }

    const segmentItemNames: string[] = segmentByItems.map(
        (item: Execution.IResultHeaderItem): string => {
            const name: string = getHeaderItemName(item);
            return name || EMPTY_SEGMENT_ITEM;
        },
    );
    const uniqSegmentItems: string[] = uniq(segmentItemNames);
    const colorPaletteMapping = getColorPaletteMapping(uniqSegmentItems);

    return colorValues.map(
        (color: number, index: number): IPushpinColor => {
            const value = isNumber(color) ? color : min;
            const colorIndex = getColorIndexInPalette(value, min, max);
            const segmentItemName = segmentItemNames[index] || DEFAULT_SEGMENT_ITEM;
            const palette = colorPaletteMapping[segmentItemName];
            return {
                border: palette[DEFAULT_COLOR_INDEX_IN_PALETTE],
                background: palette[colorIndex],
            };
        },
    );
}
