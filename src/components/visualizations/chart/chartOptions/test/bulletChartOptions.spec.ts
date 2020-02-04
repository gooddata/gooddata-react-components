// (C) 2019-2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";

import { getBulletChartSeries } from "../bulletChartOptions";
import { BulletChartColorStrategy } from "../../colorFactory";
import { IColorPalette } from "../../../../../interfaces/Config";
import { SECONDARY_MEASURES, MEASURES, TERTIARY_MEASURES } from "../../../../../constants/bucketNames";
import { createMeasure } from "../../../../../../__mocks__/fixtures";

const getMeasureGroupWithItems = (measureGroupItems: any) => ({
    items: measureGroupItems,
});

const getExecutionResponse = (measureGroup: any): Execution.IExecutionResponse => ({
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
});

const getColorStrategy = (colorPalette: IColorPalette, measureGroup: any) =>
    new BulletChartColorStrategy(
        colorPalette,
        undefined,
        undefined,
        undefined,
        getExecutionResponse(measureGroup),
        {},
    );

const getExecutionResultForNMeasures = (measuresCount: number) =>
    new Array(measuresCount).fill(undefined).map((_val, index) => [(index + 1) * 100]);

describe("getBulletChartSeries", () => {
    const availableMeasureGroupItems: any = [
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
        {
            measureHeaderItem: {
                localIdentifier: "m3",
                name: "Comparative measure",
                format: "#,##0.00",
            },
        },
    ];

    const colorPaletteRed: IColorPalette = [
        {
            guid: "0",
            fill: {
                r: 255,
                g: 0,
                b: 0,
            },
        },
    ];

    const colorPaletteBlue: IColorPalette = [
        {
            guid: "0",
            fill: {
                r: 0,
                g: 0,
                b: 255,
            },
        },
    ];

    const buckets = [
        {
            localIdentifier: MEASURES,
            items: [createMeasure(1)],
        },
        {
            localIdentifier: SECONDARY_MEASURES,
            items: [createMeasure(2)],
        },
        {
            localIdentifier: TERTIARY_MEASURES,
            items: [createMeasure(3)],
        },
    ];

    it.each([
        [colorPaletteRed, 1, [availableMeasureGroupItems[0]], [buckets[0]]],
        [colorPaletteBlue, 1, [availableMeasureGroupItems[1]], [buckets[1]]],
        [colorPaletteRed, 1, [availableMeasureGroupItems[2]], [buckets[2]]],
        [
            colorPaletteBlue,
            2,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[1]],
            [buckets[0], buckets[1]],
        ],
        [
            colorPaletteRed,
            2,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[2]],
            [buckets[0], buckets[2]],
        ],
        [
            colorPaletteBlue,
            2,
            [availableMeasureGroupItems[1], availableMeasureGroupItems[2]],
            [buckets[1], buckets[2]],
        ],
        [
            colorPaletteRed,
            3,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[1], availableMeasureGroupItems[2]],
            buckets,
        ],
    ])(
        "should return expected bullet chart series",
        (
            colorPalette: IColorPalette,
            numberOfMeasures: number,
            measureGroupItems: any,
            buckets: VisualizationObject.IBucket[],
        ) => {
            const executionResultData = getExecutionResultForNMeasures(numberOfMeasures);
            const measureGroup = getMeasureGroupWithItems(measureGroupItems);
            const colorStrategy = getColorStrategy(colorPalette, measureGroup);
            expect(
                getBulletChartSeries(executionResultData, measureGroup, colorStrategy, buckets),
            ).toMatchSnapshot();
        },
    );
});
