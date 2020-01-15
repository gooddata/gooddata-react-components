// (C) 2019-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";

import { getBulletChartSeries } from "../bulletChartOptions";
import { BulletChartColorStrategy } from "../../colorFactory";
import { IColorPalette } from "../../../../../interfaces/Config";

describe("getBulletChartSeries", () => {
    it("should return proper bullet chart series", () => {
        const measureGroup: any = {
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
        };

        const executionResponse: Execution.IExecutionResponse = {
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: measureGroup,
                        },
                    ],
                },
            ],
            links: { executionResult: "foo" },
        };

        const colorPalette: IColorPalette = [
            {
                guid: "0",
                fill: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
        ];

        const executionResultData = [[1, 2], [3, 4]];

        const mdObject = {
            visualizationClass: { uri: "local:bullet" },
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            measure: {
                                definition: {
                                    measureDefinition: {
                                        item: {
                                            uri: "m1",
                                        },
                                    },
                                },
                                localIdentifier: "m1",
                            },
                        },
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [
                        {
                            measure: {
                                definition: {
                                    measureDefinition: {
                                        item: {
                                            uri: "m2",
                                        },
                                    },
                                },
                                localIdentifier: "m2",
                            },
                        },
                    ],
                },
            ],
        };

        const expectedSeries = [
            {
                color: "rgb(255,0,0)",
                data: [
                    { format: "#,##0.00", marker: { enabled: true }, name: "Primary measure", y: 1 },
                    { format: "#,##0.00", marker: { enabled: true }, name: "Primary measure", y: 2 },
                ],
                legendIndex: 0,
                name: "Primary measure",
                type: "",
            },
            {
                color: "rgb(179,0,0)",
                data: [
                    {
                        format: "#,##0.00",
                        marker: { enabled: true },
                        name: "Target measure",
                        target: 3,
                        y: 0,
                    },
                    {
                        format: "#,##0.00",
                        marker: { enabled: true },
                        name: "Target measure",
                        target: 4,
                        y: 0,
                    },
                ],
                legendIndex: 1,
                name: "Target measure",
                type: "bullet",
            },
        ];

        const colorStrategy = new BulletChartColorStrategy(
            colorPalette,
            undefined,
            undefined,
            undefined,
            executionResponse,
            {},
        );

        const series = getBulletChartSeries(executionResultData, measureGroup, colorStrategy, mdObject);

        expect(series).toEqual(expectedSeries);
    });
});
