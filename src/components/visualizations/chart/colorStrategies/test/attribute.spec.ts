// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { RGBType } from "@gooddata/gooddata-js";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { ColorFactory } from "../../colorFactory";
import { DEFAULT_COLOR_PALETTE, getRgbString } from "../../../utils/color";
import { IColorMapping, IColorPalette, IColorPaletteItem } from "../../../../../interfaces/Config";
import { getColorsFromStrategy } from "./helpers";
import AttributeColorStrategy from "../attribute";

describe("AttributeColorStrategy", () => {
    it("should return AttributeColorStrategy with two colors from default color palette", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.barChartWithStackByAndViewByAttributes);
        const { executionResponse } = fixtures.barChartWithStackByAndViewByAttributes;
        const { afm } = fixtures.barChartWithStackByAndViewByAttributes.executionRequest;
        const type = "bar";
        const colorPalette: IColorPalette = undefined;

        const colorStrategy = ColorFactory.getColorStrategy(
            colorPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(AttributeColorStrategy);
        expect(updatedPalette).toEqual(
            DEFAULT_COLOR_PALETTE.slice(0, 2).map((defaultColorPaletteItem: IColorPaletteItem) =>
                getRgbString(defaultColorPaletteItem),
            ),
        );
    });

    it("should return AttributeColorStrategy with two colors from custom color palette", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.barChartWithStackByAndViewByAttributes);
        const { executionResponse } = fixtures.barChartWithStackByAndViewByAttributes;
        const { afm } = fixtures.barChartWithStackByAndViewByAttributes.executionRequest;
        const type = "bar";
        const colorPalette = [
            {
                guid: "red",
                fill: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
            {
                guid: "green",
                fill: {
                    r: 0,
                    g: 255,
                    b: 0,
                },
            },
            {
                guid: "blue",
                fill: {
                    r: 0,
                    g: 0,
                    b: 255,
                },
            },
        ];

        const colorStrategy = ColorFactory.getColorStrategy(
            colorPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(AttributeColorStrategy);
        expect(updatedPalette).toEqual(
            colorPalette
                .slice(0, 2)
                .map((defaultColorPaletteItem: IColorPaletteItem) => getRgbString(defaultColorPaletteItem)),
        );
    });

    it("should return AttributeColorStrategy with properly applied mapping", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.barChartWithStackByAndViewByAttributes);
        const { executionResponse } = fixtures.barChartWithStackByAndViewByAttributes;
        const { afm } = fixtures.barChartWithStackByAndViewByAttributes.executionRequest;
        const type = "bar";
        const colorPalette = [
            {
                guid: "red",
                fill: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
            {
                guid: "green",
                fill: {
                    r: 0,
                    g: 255,
                    b: 0,
                },
            },
            {
                guid: "blue",
                fill: {
                    r: 0,
                    g: 0,
                    b: 255,
                },
            },
        ];
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IResultAttributeHeaderItem) =>
                    headerItem.attributeHeaderItem &&
                    headerItem.attributeHeaderItem.uri ===
                        "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1024/elements?id=1225",
                color: {
                    type: "guid",
                    value: "blue",
                },
            },
            {
                predicate: (headerItem: Execution.IResultAttributeHeaderItem) =>
                    headerItem.attributeHeaderItem && headerItem.attributeHeaderItem.uri === "invalid",
                color: {
                    type: "rgb" as RGBType,
                    value: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
                },
            },
            {
                predicate: (headerItem: Execution.IResultAttributeHeaderItem) =>
                    headerItem.attributeHeaderItem &&
                    headerItem.attributeHeaderItem.uri ===
                        "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1024/elements?id=1237",
                color: {
                    type: "rgb" as RGBType,
                    value: {
                        r: 0,
                        g: 0,
                        b: 1,
                    },
                },
            },
        ];

        const colorStrategy = ColorFactory.getColorStrategy(
            colorPalette,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(AttributeColorStrategy);
        expect(updatedPalette).toEqual(["rgb(0,0,255)", "rgb(0,0,1)"]);
    });
});
