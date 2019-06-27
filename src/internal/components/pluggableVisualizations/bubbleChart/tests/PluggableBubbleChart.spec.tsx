// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import { PluggableBubbleChart } from "../PluggableBubbleChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";

import { IBucket, IFilters } from "../../../../interfaces/Visualization";

describe("PluggableBubbleChart", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
    };

    function createComponent(props = defaultProps) {
        return new PluggableBubbleChart(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    it("should return reference point with three measures and one category and only valid filters", async () => {
        const bubbleChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "secondary_measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    1,
                    2,
                ),
            },
            {
                localIdentifier: "tertiary_measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    2,
                    3,
                ),
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[1].items.slice(
                    0,
                    1,
                ),
            },
        ];

        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.filters.items.slice(0, 1),
        };

        const extendedReferencePoint = await bubbleChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.bubbleChartUiConfig,
            properties: {},
        });
    });

    it("should return reference point with three measures and no attribute", async () => {
        const scatterPlot = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "secondary_measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    1,
                    2,
                ),
            },
            {
                localIdentifier: "tertiary_measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    2,
                    3,
                ),
            },
            {
                localIdentifier: "view",
                items: [],
            },
        ];

        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        const extendedReferencePoint = await scatterPlot.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsNoCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.bubbleChartUiConfig,
            properties: {},
        });
    });

    it("should return reference point with secondary metric, tertiary metric and one category", async () => {
        const bubbleChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.buckets[1].items.slice(
                    1,
                    2,
                ),
            },
            {
                localIdentifier: "secondary_measures",
                items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.buckets[1].items.slice(
                    0,
                    1,
                ),
            },
            {
                localIdentifier: "tertiary_measures",
                items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.buckets[1].items.slice(
                    2,
                    3,
                ),
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.buckets[2].items.slice(
                    0,
                    1,
                ),
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.filters.items.slice(0, 1),
        };

        const extendedReferencePoint = await bubbleChart.getExtendedReferencePoint(
            referencePointMocks.secondaryMeasuresAndAttributeReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.bubbleChartUiConfig,
            properties: {},
        });
    });

    describe("Arithmetic measures", () => {
        it("should place arithmetic measures that can be placed together with their operands", async () => {
            const bubbleChart = createComponent();
            const originalRefPoint =
                referencePointMocks.firstMeasureArithmeticAlongWithAttributeReferencePoint;
            const extendedReferencePoint = await bubbleChart.getExtendedReferencePoint(originalRefPoint);

            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: originalRefPoint.buckets[0].items.slice(0, 1),
                },
                {
                    localIdentifier: "secondary_measures",
                    items: originalRefPoint.buckets[0].items.slice(1, 2),
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: originalRefPoint.buckets[0].items.slice(2, 3),
                },
                {
                    localIdentifier: "view",
                    items: originalRefPoint.buckets[1].items,
                },
            ];

            expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
        });

        it("should not place arithmetic measure when its operands don't fit into buckets", async () => {
            const bubbleChart = createComponent();

            const extendedReferencePoint = await bubbleChart.getExtendedReferencePoint({
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.masterMeasureItems[2],
                            referencePointMocks.arithmeticMeasureItems[0],
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [],
                },
            });

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [referencePointMocks.masterMeasureItems[2]],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: [referencePointMocks.masterMeasureItems[1]],
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
            ]);
        });

        it("should skip arithmetic measure when operands of it's operands don't fit", async () => {
            const bubbleChart = createComponent();

            const extendedReferencePoint = await bubbleChart.getExtendedReferencePoint({
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.arithmeticMeasureItems[1],
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.arithmeticMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [],
                },
            });

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [referencePointMocks.arithmeticMeasureItems[0]],
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: [referencePointMocks.masterMeasureItems[1]],
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
            ]);
        });
    });

    describe("Over Time Comparison", () => {
        it("should return reference point containing uiConfig with no supported comparison types", async () => {
            const component = createComponent();

            const extendedReferencePoint = await component.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );

            expect(extendedReferencePoint.uiConfig.supportedOverTimeComparisonTypes).toEqual([]);
        });

        it("should remove all derived measures and arithmetic measures created from derived measures", async () => {
            const component = createComponent();

            const extendedReferencePoint = await component.getExtendedReferencePoint(
                referencePointMocks.mixOfMeasuresWithDerivedAndArithmeticFromDerivedBubbleReferencePoint,
            );
            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [referencePointMocks.arithmeticMeasureItems[0]],
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: [referencePointMocks.masterMeasureItems[1]],
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
            ]);
        });
    });
});
