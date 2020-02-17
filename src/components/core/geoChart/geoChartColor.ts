// (C) 2020 GoodData Corporation
import uniq = require("lodash/uniq");
import isNumber = require("lodash/isNumber");
import isFinite = require("lodash/isFinite");
import { Execution } from "@gooddata/typings";
import { DEFAULT_COLORS, getColorPalette } from "../../visualizations/utils/color";
import { DEFAULT_PUSHPIN_COLOR_SCALE, DEFAULT_PUSHPIN_COLOR_VALUE } from "../../../constants/geoChart";
import { getHeaderItemName } from "../../../helpers/executionResultHelper";
import { IObjectMapping, IPushpinColor } from "../../../interfaces/GeoChart";

const DEFAULT_SEGMENT_ITEM = "default_segment_item";
const EMPTY_SEGMENT_ITEM = "empty_segment_item";
const DEFAULT_COLOR_INDEX_IN_PALETTE = DEFAULT_PUSHPIN_COLOR_SCALE - 1;

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
 * Return RGB border and background colors base on color and segment values
 *  Example:
 *      [any-number] => [{
 *           border: "rgb(127,224,198)",
 *           background: "rgb(215,242,250)",
 *      }]
 * @param colorValues
 * @param segmentItems
 */
export function getPushpinColors(
    colorValues: number[],
    segmentItems: Execution.IResultHeaderItem[] = [],
): IPushpinColor[] {
    if (!colorValues.length) {
        return [];
    }

    const colorsWithoutNull = colorValues.filter(isFinite);

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

    const segmentItemNames: string[] = segmentItems.map(
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
