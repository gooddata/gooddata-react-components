// (C) 2020 GoodData Corporation
import range = require("lodash/range");
import { Execution } from "@gooddata/typings";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { ColorFactory, IColorStrategy } from "../../colorFactory";
import { HEATMAP_BLUE_COLOR_PALETTE } from "../../../utils/color";
import { CUSTOM_COLOR_PALETTE } from "../../../../../../stories/data/colors";
import { IColorMapping } from "../../../../../interfaces/Config";
import HeatmapColorStrategy from "../heatmap";

describe("HeatmapColorStrategy", () => {
    it("should return HeatmapColorStrategy strategy with 7 colors from default heatmap color palette", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.heatmapMetricRowColumn);
        const { executionResponse } = fixtures.heatmapMetricRowColumn;
        const { afm } = fixtures.heatmapMetricRowColumn.executionRequest;
        const type = "heatmap";

        const colorStrategy: IColorStrategy = ColorFactory.getColorStrategy(
            undefined,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        expect(colorStrategy).toBeInstanceOf(HeatmapColorStrategy);
        range(7).map((colorIndex: number) =>
            expect(colorStrategy.getColorByIndex(colorIndex)).toEqual(HEATMAP_BLUE_COLOR_PALETTE[colorIndex]),
        );
    });

    it(
        "should return HeatmapColorStrategy strategy with 7 colors" +
            " based on the first color from custom palette",
        () => {
            const { viewByAttribute, stackByAttribute } = getMVS(fixtures.heatmapMetricRowColumn);
            const { executionResponse } = fixtures.heatmapMetricRowColumn;
            const { afm } = fixtures.heatmapMetricRowColumn.executionRequest;
            const type = "heatmap";

            const expectedColors: string[] = [
                "rgb(255,255,255)",
                "rgb(245,220,224)",
                "rgb(235,186,194)",
                "rgb(225,152,164)",
                "rgb(215,117,133)",
                "rgb(205,83,103)",
                "rgb(195,49,73)",
            ];

            const colorStrategy: IColorStrategy = ColorFactory.getColorStrategy(
                CUSTOM_COLOR_PALETTE,
                undefined,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
                type,
            );

            expect(colorStrategy).toBeInstanceOf(HeatmapColorStrategy);
            const colors: string[] = range(7).map((index: number) => colorStrategy.getColorByIndex(index));
            expect(colors).toEqual(expectedColors);
        },
    );

    it(
        "should return HeatmapColorStrategy strategy with 7 colors" +
            " based on the first color from custom palette when color mapping given but not applicable",
        () => {
            const { viewByAttribute, stackByAttribute } = getMVS(fixtures.heatmapMetricRowColumn);
            const { executionResponse } = fixtures.heatmapMetricRowColumn;
            const { afm } = fixtures.heatmapMetricRowColumn.executionRequest;
            const type = "heatmap";

            const expectedColors: string[] = [
                "rgb(255,255,255)",
                "rgb(245,220,224)",
                "rgb(235,186,194)",
                "rgb(225,152,164)",
                "rgb(215,117,133)",
                "rgb(205,83,103)",
                "rgb(195,49,73)",
            ];

            const inapplicableColorMapping: IColorMapping[] = [
                {
                    predicate: () => false,
                    color: {
                        type: "guid",
                        value: "02",
                    },
                },
            ];

            const colorStrategy: IColorStrategy = ColorFactory.getColorStrategy(
                CUSTOM_COLOR_PALETTE,
                inapplicableColorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
                type,
            );

            expect(colorStrategy).toBeInstanceOf(HeatmapColorStrategy);
            const colors: string[] = range(7).map((index: number) => colorStrategy.getColorByIndex(index));
            expect(colors).toEqual(expectedColors);
        },
    );

    it("should return HeatmapColorStrategy with properly applied mapping", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.heatmapMetricRowColumn);
        const { executionResponse } = fixtures.heatmapMetricRowColumn;
        const { afm } = fixtures.heatmapMetricRowColumn.executionRequest;
        const type = "heatmap";

        const expectedColors: string[] = [
            "rgb(255,255,255)",
            "rgb(240,244,226)",
            "rgb(226,234,198)",
            "rgb(211,224,170)",
            "rgb(197,214,142)",
            "rgb(182,204,114)",
            "rgb(168,194,86)",
        ];
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "amountMeasure",
                color: {
                    type: "guid",
                    value: "02",
                },
            },
        ];

        const colorStrategy = ColorFactory.getColorStrategy(
            CUSTOM_COLOR_PALETTE,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        expect(colorStrategy).toBeInstanceOf(HeatmapColorStrategy);
        const colors: string[] = range(7).map((index: number) => colorStrategy.getColorByIndex(index));
        expect(colors).toEqual(expectedColors);
    });
});
