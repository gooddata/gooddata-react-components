// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { ColorFactory } from "../../colorFactory";
import { DEFAULT_COLOR_PALETTE, getRgbString } from "../../../utils/color";
import { IColorMapping, IColorPalette, IColorPaletteItem } from "../../../../../interfaces/Config";
import TreemapColorStrategy from "../treemap";
import { getColorsFromStrategy } from "./helpers";

const customPalette = [
    {
        guid: "01",
        fill: {
            r: 50,
            g: 50,
            b: 50,
        },
    },
    {
        guid: "02",
        fill: {
            r: 100,
            g: 100,
            b: 100,
        },
    },
    {
        guid: "03",
        fill: {
            r: 150,
            g: 150,
            b: 150,
        },
    },
    {
        guid: "04",
        fill: {
            r: 200,
            g: 200,
            b: 200,
        },
    },
];

describe("TreemapColorStrategy", () => {
    it("should return TreemapColorStrategy strategy with two colors from default color palette", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.treemapWithMetricViewByAndStackByAttribute,
        );
        const { executionResponse } = fixtures.treemapWithMetricViewByAndStackByAttribute;
        const { afm } = fixtures.treemapWithMetricViewByAndStackByAttribute.executionRequest;
        const type = "treemap";
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

        expect(colorStrategy).toBeInstanceOf(TreemapColorStrategy);
        expect(updatedPalette).toEqual(
            DEFAULT_COLOR_PALETTE.slice(0, 1).map((defaultColorPaletteItem: IColorPaletteItem) =>
                getRgbString(defaultColorPaletteItem),
            ),
        );
    });

    it("should return TreemapColorStrategy with properly applied mapping", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.treemapWithMetricViewByAndStackByAttribute,
        );
        const { executionResponse } = fixtures.treemapWithMetricViewByAndStackByAttribute;
        const { afm } = fixtures.treemapWithMetricViewByAndStackByAttribute.executionRequest;
        const type = "treemap";

        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "amountMetric",
                color: {
                    type: "guid",
                    value: "02",
                },
            },
        ];

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(TreemapColorStrategy);
        expect(updatedPalette).toEqual(["rgb(100,100,100)"]);
    });
});
