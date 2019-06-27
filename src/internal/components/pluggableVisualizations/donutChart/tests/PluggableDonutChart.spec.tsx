// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import { PluggableDonutChart } from "../PluggableDonutChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";

import { IBucket, IFilters } from "../../../../interfaces/Visualization";

describe("PluggableDonutChart", () => {
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
        return new PluggableDonutChart(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    it("should return reference point with only one metric and one category and only valid filters", async () => {
        const donutChart = createComponent();

        const extendedReferencePoint = await donutChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
        );

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                    0,
                    1,
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

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.multipleMetricsAndCategoriesDonutUiConfig,
            properties: {},
        });
    });

    it("should return reference point with multiple metrics and no category", async () => {
        const donutChart = createComponent();

        const extendedReferencePoint = await donutChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsNoCategoriesReferencePoint,
        );

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.multipleMetricsNoCategoriesReferencePoint.buckets[0].items,
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
        const expectedProperties = {};
        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.multipleMetricsNoCategoriesDonutUiConfig,
            properties: expectedProperties,
        });
    });

    it("should return reference point with one metric and no category", async () => {
        const donutChart = createComponent();

        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: referencePointMocks.oneMetricNoCategoriesReferencePoint.buckets[0].items,
            },
            {
                localIdentifier: "view",
                items: [],
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.oneMetricNoCategoriesReferencePoint.filters.items,
        };

        const extendedReferencePoint = await donutChart.getExtendedReferencePoint(
            referencePointMocks.oneMetricNoCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.oneMetricNoCategoriesDonutUiConfig,
            properties: {},
        });
    });

    describe("Arithmetic measures", () => {
        it("should skip arithmetic measures that cannot be placed together with their operands", async () => {
            const donutChart = createComponent();
            const originalRefPoint =
                referencePointMocks.firstMeasureArithmeticAlongWithAttributeReferencePoint;

            const extendedReferencePoint = await donutChart.getExtendedReferencePoint(originalRefPoint);

            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [originalRefPoint.buckets[0].items[1]],
                },
                {
                    localIdentifier: "view",
                    items: originalRefPoint.buckets[1].items,
                },
            ];

            expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
        });

        it("should preserve arithmetic measures if there is no attribute so we keep all measures", async () => {
            const donutChart = createComponent();

            const extendedReferencePoint = await donutChart.getExtendedReferencePoint(
                referencePointMocks.firstMeasureArithmeticNoAttributeReferencePoint,
            );

            expect(extendedReferencePoint.buckets).toEqual(
                referencePointMocks.firstMeasureArithmeticNoAttributeReferencePoint.buckets,
            );
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
    });
});
