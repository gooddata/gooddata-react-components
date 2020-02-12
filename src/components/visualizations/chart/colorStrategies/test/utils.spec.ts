// (C) 2020 GoodData Corporation
import { IColorItem } from "@gooddata/gooddata-js";

import { IColorPalette } from "../../../../../interfaces/Config";

import { isValidMappedColor } from "../utils";

describe("isValidMappedColor", () => {
    const colorPalette: IColorPalette = [
        {
            guid: "01",
            fill: {
                r: 195,
                g: 49,
                b: 73,
            },
        },
    ];

    it("should return true if color item is in palette", () => {
        const colorItem: IColorItem = {
            type: "guid",
            value: "01",
        };

        expect(isValidMappedColor(colorItem, colorPalette)).toBeTruthy();
    });

    it("should return false if color item is not in palette", () => {
        const colorItem: IColorItem = {
            type: "guid",
            value: "xx",
        };

        expect(isValidMappedColor(colorItem, colorPalette)).toBeFalsy();
    });

    it("should return true if color item is rgb", () => {
        const colorItem: IColorItem = {
            type: "rgb",
            value: {
                r: 255,
                g: 0,
                b: 0,
            },
        };

        expect(isValidMappedColor(colorItem, colorPalette)).toBeTruthy();
    });
});
