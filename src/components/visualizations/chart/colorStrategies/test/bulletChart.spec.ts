// (C) 2020 GoodData Corporation
import range = require("lodash/range");
import { Execution, VisualizationObject } from "@gooddata/typings";

import { IColorMapping, IColorPalette } from "../../../../../interfaces/Config";
import { CUSTOM_COLOR_PALETTE } from "../../../../../../stories/data/colors";
import { ColorFactory, IColorStrategy } from "../../colorFactory";
import BulletChartColorStrategy from "../bulletChart";
import { MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES } from "../../../../../constants/bucketNames";

const availableMeasureGroupItems: Execution.IMeasureHeaderItem[] = [
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

const getExecutionResponse = (
    measureHeaderItems: Execution.IMeasureHeaderItem[],
): Execution.IExecutionResponse => ({
    dimensions: [
        {
            headers: [
                {
                    measureGroupHeader: {
                        items: measureHeaderItems,
                    },
                },
            ],
        },
    ],
    links: { executionResult: "foo" },
});

const defaultColorMapping: IColorMapping[] = [
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

const getBulletColorStrategy = (
    props: {
        palette?: IColorPalette;
        colorMapping?: IColorMapping[];
        occupiedMeasureBucketsLocalIdentifiers?: VisualizationObject.Identifier[];
        executionResponse?: Execution.IExecutionResponse;
    } = {},
): IColorStrategy => {
    const {
        palette,
        colorMapping = defaultColorMapping,
        occupiedMeasureBucketsLocalIdentifiers = [MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES],
        executionResponse = getExecutionResponse(availableMeasureGroupItems),
    } = props;

    return ColorFactory.getColorStrategy(
        palette,
        colorMapping,
        undefined,
        undefined,
        executionResponse,
        {},
        "bullet",
        occupiedMeasureBucketsLocalIdentifiers,
    );
};

describe("BulletChartColorStrategy", () => {
    it("should create color strategy for bullet chart", () => {
        const colorStrategy = getBulletColorStrategy();
        expect(colorStrategy).toBeInstanceOf(BulletChartColorStrategy);
        expect(colorStrategy.getColorAssignment().length).toEqual(3);
    });

    describe("colorPalette", () => {
        it.each([
            [undefined, undefined, undefined, ["rgb(20,178,226)", "rgb(14,125,158)", "rgb(217,220,226)"]],
            [
                undefined,
                getExecutionResponse([availableMeasureGroupItems[1], availableMeasureGroupItems[2]]),
                [SECONDARY_MEASURES, TERTIARY_MEASURES],
                ["rgb(14,125,158)", "rgb(217,220,226)"],
            ],
            [
                undefined,
                getExecutionResponse([availableMeasureGroupItems[0], availableMeasureGroupItems[2]]),
                [MEASURES, TERTIARY_MEASURES],
                ["rgb(20,178,226)", "rgb(217,220,226)"],
            ],
            [
                undefined,
                getExecutionResponse([availableMeasureGroupItems[0], availableMeasureGroupItems[1]]),
                [MEASURES, SECONDARY_MEASURES],
                ["rgb(20,178,226)", "rgb(14,125,158)"],
            ],
            [
                CUSTOM_COLOR_PALETTE,
                undefined,
                undefined,
                ["rgb(195,49,73)", "rgb(137,34,51)", "rgb(217,220,226)"],
            ],
        ])(
            "should create palette",
            (
                palette: IColorPalette,
                executionResponse: Execution.IExecutionResponse,
                occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
                expectedColors: string[],
            ) => {
                const colorStrategy = getBulletColorStrategy({
                    palette,
                    executionResponse,
                    occupiedMeasureBucketsLocalIdentifiers,
                });

                range(expectedColors.length).map(itemIndex => {
                    expect(colorStrategy.getColorByIndex(itemIndex)).toEqual(expectedColors[itemIndex]);
                });
            },
        );
    });

    describe("colorMapping", () => {
        const getRedColorMappingForMeasure = (measureLocalIdentifier: string): IColorMapping => ({
            predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                headerItem.measureHeaderItem.localIdentifier === measureLocalIdentifier,
            color: {
                type: "rgb",
                value: {
                    r: 255,
                    g: 0,
                    b: 0,
                },
            },
        });

        it.each([
            [[getRedColorMappingForMeasure("m1")], ["rgb(255,0,0)", "rgb(14,125,158)", "rgb(217,220,226)"]],
            [[getRedColorMappingForMeasure("m2")], ["rgb(20,178,226)", "rgb(255,0,0)", "rgb(217,220,226)"]],
            [[getRedColorMappingForMeasure("m3")], ["rgb(20,178,226)", "rgb(14,125,158)", "rgb(255,0,0)"]],
        ])("should map colors", (colorMapping: IColorMapping[], expectedColors: string[]) => {
            const colorStrategy = getBulletColorStrategy({ colorMapping });

            range(expectedColors.length).map(itemIndex => {
                expect(colorStrategy.getColorByIndex(itemIndex)).toEqual(expectedColors[itemIndex]);
            });
        });
    });
});
