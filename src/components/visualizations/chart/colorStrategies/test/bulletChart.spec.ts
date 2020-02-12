// (C) 2020 GoodData Corporation
import range = require("lodash/range");
import { Execution } from "@gooddata/typings";

import { IColorMapping, IColorPalette } from "../../../../../interfaces/Config";
import { CUSTOM_COLOR_PALETTE } from "../../../../../../stories/data/colors";
import { ColorFactory, IColorStrategy } from "../../colorFactory";
import BulletChartColorStrategy from "../bulletChart";

describe("BulletChartColorStrategy", () => {
    const executionResponse: Execution.IExecutionResponse = {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        localIdentifier: "m1",
                                        name: "Primary measure",
                                        format: "#,##0.00",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        localIdentifier: "m2",
                                        name: "Target measure",
                                        format: "#,##0.00",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: { executionResult: "foo" },
    };
    const type = "bullet";
    const colorMapping: IColorMapping[] = [
        {
            predicate: () => false,
            color: {
                type: "rgb",
                value: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
        },
    ];

    const getBulletColorStrategy = (palette?: IColorPalette): IColorStrategy => {
        return ColorFactory.getColorStrategy(
            palette,
            colorMapping,
            undefined,
            undefined,
            executionResponse,
            {},
            type,
        );
    };

    it("should create color strategy for bullet chart", () => {
        const colorStrategy = getBulletColorStrategy();
        expect(colorStrategy).toBeInstanceOf(BulletChartColorStrategy);
        expect(colorStrategy.getColorAssignment().length).toEqual(1);
    });

    it("should create palette from default palette", () => {
        const colorStrategy = getBulletColorStrategy();

        const expectedColors = ["rgb(20,178,226)", "rgb(14,125,158)", "rgb(217,220,226)"];
        range(3).map(itemIndex => {
            expect(colorStrategy.getColorByIndex(itemIndex)).toEqual(expectedColors[itemIndex]);
        });
    });

    it("should create palette from custom palette", () => {
        const colorStrategy = getBulletColorStrategy(CUSTOM_COLOR_PALETTE);

        const expectedColors = ["rgb(195,49,73)", "rgb(137,34,51)", "rgb(217,220,226)"];
        range(3).map(itemIndex => {
            expect(colorStrategy.getColorByIndex(itemIndex)).toEqual(expectedColors[itemIndex]);
        });
    });
});
