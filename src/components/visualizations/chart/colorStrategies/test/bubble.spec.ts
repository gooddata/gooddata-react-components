// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { IColorMapping } from "../../../../../interfaces/Config";
import { ColorFactory } from "../../colorFactory";
import { CUSTOM_COLOR_PALETTE } from "../../../../../../stories/data/colors";
import BubbleChartColorStrategy from "../bubbleChart";

describe("BubbleChartStrategy", () => {
    it("should create palette with color from first measure", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.bubbleChartWith3Metrics);
        const { executionResponse } = fixtures.bubbleChartWith3Metrics;
        const { afm } = fixtures.bubbleChartWith3Metrics.executionRequest;
        const type = "bubble";

        const expectedColors = ["rgb(0,0,0)"];
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "784a5018a51049078e8f7e86247e08a3",
                color: {
                    type: "rgb",
                    value: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
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

        expect(colorStrategy).toBeInstanceOf(BubbleChartColorStrategy);
        expect(colorStrategy.getColorAssignment().length).toEqual(1);
        expect(colorStrategy.getColorByIndex(0)).toEqual(expectedColors[0]);
    });

    it("should create palette with color for each attribute element", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.bubbleChartWith3MetricsAndAttribute);
        const { executionResponse } = fixtures.bubbleChartWith3MetricsAndAttribute;
        const { afm } = fixtures.bubbleChartWith3MetricsAndAttribute.executionRequest;
        const type = "bubble";

        const expectedColors = ["rgb(0,0,0)"];
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IResultAttributeHeaderItem) =>
                    headerItem.attributeHeaderItem.uri ===
                    "/gdc/md/hzyl5wlh8rnu0ixmbzlaqpzf09ttb7c8/obj/1025/elements?id=1224",
                color: {
                    type: "rgb",
                    value: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
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

        expect(colorStrategy).toBeInstanceOf(BubbleChartColorStrategy);
        expect(colorStrategy.getColorAssignment().length).toEqual(20);
        expect(colorStrategy.getColorByIndex(0)).toEqual(expectedColors[0]);
    });
});
