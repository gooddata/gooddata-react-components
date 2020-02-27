// (C) 2020 GoodData Corporation
import noop = require("lodash/noop");
import { PluggableBulletChart } from "../PluggableBulletChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import { IBucket, IFilters } from "../../../../interfaces/Visualization";
import { DEFAULT_BULLET_CHART_CONFIG } from "../../../../constants/uiConfig";

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
    return new PluggableBulletChart(props);
}

describe("PluggableBulletChart", () => {
    const bulletChart = createComponent();

    it("should create visualization", () => {
        expect(bulletChart).toBeTruthy();
    });

    it("should return reference point with three measures and one category and only valid filters", async () => {
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
                    2,
                ),
            },
        ];

        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.filters.items.slice(0, 2),
        };

        const extendedReferencePoint = await bulletChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: DEFAULT_BULLET_CHART_CONFIG,
            properties: {},
        });
    });

    it("should return reference point with three measures and no attribute", async () => {
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

        const extendedReferencePoint = await bulletChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsNoCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: DEFAULT_BULLET_CHART_CONFIG,
            properties: {},
        });
    });

    it("should return reference point with target and comparative measures and one category", async () => {
        const expectedBuckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [],
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
                    1,
                    2,
                ),
            },
            {
                localIdentifier: "view",
                items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.buckets[2].items.slice(
                    0,
                    2,
                ),
            },
        ];
        const expectedFilters: IFilters = {
            localIdentifier: "filters",
            items: referencePointMocks.secondaryMeasuresAndAttributeReferencePoint.filters.items.slice(0, 2),
        };

        const extendedReferencePoint = await bulletChart.getExtendedReferencePoint(
            referencePointMocks.secondaryMeasuresAndAttributeReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject({
            buckets: expectedBuckets,
            filters: expectedFilters,
            uiConfig: DEFAULT_BULLET_CHART_CONFIG,
            properties: {},
        });
    });
});
