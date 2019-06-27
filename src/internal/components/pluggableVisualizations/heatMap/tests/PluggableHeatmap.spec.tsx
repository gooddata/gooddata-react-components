// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import get from "lodash/get";
import { PluggableHeatmap } from "../PluggableHeatmap";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import { IBucket, IFilters, IReferencePoint } from "../../../../interfaces/Visualization";

describe("PluggableHeatmap", () => {
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
        return new PluggableHeatmap(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    it("should return reference point with one metric, category, stack and valid filters", async () => {
        const heatmap = createComponent();

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
            {
                localIdentifier: "stack",
                items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[1].items.slice(
                    1,
                    2,
                ),
            },
        ];
        const expectedProperties = {};
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.filters.items.slice(0, 2),
        };

        const extendedReferencePoint = await heatmap.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: uiConfigMocks.defaultHeatmapUiConfig,
            properties: expectedProperties,
        });
    });

    it("heatmap should allow date attribute in column bucket", async () => {
        const heatmap = createComponent();
        const referencePoint = referencePointMocks.dateAttributeOnStackBucketReferencePoint;

        const extendedReferencePoint = await heatmap.getExtendedReferencePoint(
            referencePointMocks.dateAttributeOnStackBucketReferencePoint,
        );

        expect(extendedReferencePoint).toEqual({
            buckets: referencePoint.buckets,
            filters: referencePoint.filters,
            uiConfig: uiConfigMocks.defaultHeatmapUiConfig,
            properties: {},
        });
    });

    it("heatmap should not support showInpercent", async () => {
        const heatmap = createComponent();
        const referencePoint: IReferencePoint = {
            ...referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            ...referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                                0,
                                1,
                            )[0],
                            showInPercent: true,
                        },
                    ],
                },
                {
                    localIdentifier: "view",
                    items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[1].items.slice(
                        0,
                        1,
                    ),
                },
                {
                    localIdentifier: "stack",
                    items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[1].items.slice(
                        1,
                        2,
                    ),
                },
            ],
        };

        const extendedReferencePoint = heatmap.getExtendedReferencePoint(referencePoint);

        expect(get(extendedReferencePoint, "buckets.0.items.0.0.showInPercent")).toBeFalsy();
    });

    describe("Arithmetic measures", () => {
        it("should skip measures that cannot be placed together with their operands", async () => {
            const heatmap = createComponent();
            const originalRefPoint =
                referencePointMocks.firstMeasureArithmeticAlongWithAttributeReferencePoint;

            const extendedReferencePoint = await heatmap.getExtendedReferencePoint(originalRefPoint);

            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [originalRefPoint.buckets[0].items[1]],
                },
                {
                    localIdentifier: "view",
                    items: originalRefPoint.buckets[1].items,
                },
                {
                    localIdentifier: "stack",
                    items: [],
                },
            ];
            expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
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
                referencePointMocks.mixOfMeasuresWithDerivedAndArithmeticFromDerivedHeatMapReferencePoint,
            );
            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
                {
                    localIdentifier: "view",
                    items: [],
                },
                {
                    localIdentifier: "stack",
                    items: [],
                },
            ]);
        });
    });
});
