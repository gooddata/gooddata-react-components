// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";

import { getBulletChartSeries } from "../bulletChartOptions";
import BulletChartColorStrategy from "../../colorStrategies/bulletChart";
import { IColorPalette } from "../../../../../interfaces/Config";
import { SECONDARY_MEASURES, MEASURES, TERTIARY_MEASURES } from "../../../../../constants/bucketNames";

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

const getColorStrategy = (
    colorPalette: IColorPalette,
    measureGroup: any,
    occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
) =>
    new BulletChartColorStrategy(
        colorPalette,
        undefined,
        undefined,
        undefined,
        getExecutionResponse(measureGroup),
        {},
        occupiedMeasureBucketsLocalIdentifiers,
    );

const getExecutionResultForNMeasures = (measuresCount: number) =>
    new Array(measuresCount).fill(undefined).map((_val, index) => [(index + 1) * 100]);

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

const occupiedMeasureBucketsLocalIdentifiers = [MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES];

describe("getBulletChartSeries", () => {
    it.each([
        [colorPaletteRed, 1, [availableMeasureGroupItems[0]], [occupiedMeasureBucketsLocalIdentifiers[0]]],
        [colorPaletteBlue, 1, [availableMeasureGroupItems[1]], [occupiedMeasureBucketsLocalIdentifiers[1]]],
        [colorPaletteRed, 1, [availableMeasureGroupItems[2]], [occupiedMeasureBucketsLocalIdentifiers[2]]],
        [
            colorPaletteBlue,
            2,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[1]],
            [occupiedMeasureBucketsLocalIdentifiers[0], occupiedMeasureBucketsLocalIdentifiers[1]],
        ],
        [
            colorPaletteRed,
            2,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[2]],
            [occupiedMeasureBucketsLocalIdentifiers[0], occupiedMeasureBucketsLocalIdentifiers[2]],
        ],
        [
            colorPaletteBlue,
            2,
            [availableMeasureGroupItems[1], availableMeasureGroupItems[2]],
            [occupiedMeasureBucketsLocalIdentifiers[1], occupiedMeasureBucketsLocalIdentifiers[2]],
        ],
        [
            colorPaletteRed,
            3,
            [availableMeasureGroupItems[0], availableMeasureGroupItems[1], availableMeasureGroupItems[2]],
            occupiedMeasureBucketsLocalIdentifiers,
        ],
    ])(
        "should return expected bullet chart series",
        (
            colorPalette: IColorPalette,
            numberOfMeasures: number,
            measureGroupItems: any,
            occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
        ) => {
            const executionResultData = getExecutionResultForNMeasures(numberOfMeasures);
            const measureGroup = getMeasureGroupWithItems(measureGroupItems);
            const colorStrategy = getColorStrategy(
                colorPalette,
                measureGroup,
                occupiedMeasureBucketsLocalIdentifiers,
            );
            expect(
                getBulletChartSeries(
                    executionResultData,
                    measureGroup,
                    colorStrategy,
                    occupiedMeasureBucketsLocalIdentifiers,
                ),
            ).toMatchSnapshot();
        },
    );

    it("should set hidden classname to target series and its y value to 0 if execution value is null", () => {
        const executionResultData = [[100], [null]];
        const measureGroup = getMeasureGroupWithItems([
            availableMeasureGroupItems[0],
            availableMeasureGroupItems[1],
        ]);
        const colorStrategy = getColorStrategy(
            colorPaletteRed,
            measureGroup,
            occupiedMeasureBucketsLocalIdentifiers,
        );
        const series: any = getBulletChartSeries(
            executionResultData,
            measureGroup,
            colorStrategy,
            occupiedMeasureBucketsLocalIdentifiers,
        );

        expect(series[1].data[0].className).toEqual("hidden-empty-series");
        expect(series[1].data[0].target).toEqual(0);
    });
});
