// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import get from "lodash/get";
import { OverTimeComparisonTypes } from "../../../../../interfaces/OverTimeComparison";
import { PluggableBarChart } from "../PluggableBarChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import { AXIS } from "../../../../constants/axis";

describe("PluggableBarChart", () => {
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
        return new PluggableBarChart(props);
    }

    it("should return reference point with uiConfig containing supportedOverTimeComparisonTypes", async () => {
        const barChart = createComponent();

        const extendedReferencePoint = await barChart.getExtendedReferencePoint(
            referencePointMocks.oneMetricReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject(
            expect.objectContaining({
                uiConfig: expect.objectContaining({
                    supportedOverTimeComparisonTypes: [
                        OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                        OverTimeComparisonTypes.PREVIOUS_PERIOD,
                    ],
                }),
            }),
        );
    });

    it("should enable stack attribute bucket", async () => {
        const barChart = createComponent();

        const extendedReferencePoint = await barChart.getExtendedReferencePoint(
            referencePointMocks.oneMetricReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject(
            expect.objectContaining({
                uiConfig: expect.objectContaining({
                    buckets: expect.objectContaining({
                        stack: expect.objectContaining({ canAddItems: true }),
                    }),
                }),
            }),
        );
    });

    it("should disable stack attribute bucket for one measure and one aggregated measure", async () => {
        const barChart = createComponent();

        const extendedReferencePoint = await barChart.getExtendedReferencePoint(
            referencePointMocks.samePeriodPreviousYearRefPoint,
        );

        expect(extendedReferencePoint).toMatchObject(
            expect.objectContaining({
                uiConfig: expect.objectContaining({
                    buckets: expect.objectContaining({
                        stack: expect.objectContaining({ canAddItems: false }),
                    }),
                }),
            }),
        );
    });

    it("should disable stack attribute bucket for two measures", async () => {
        const barChart = createComponent();

        const extendedReferencePoint = await barChart.getExtendedReferencePoint(
            referencePointMocks.multipleMetricsNoCategoriesReferencePoint,
        );

        expect(extendedReferencePoint).toMatchObject(
            expect.objectContaining({
                uiConfig: expect.objectContaining({
                    buckets: expect.objectContaining({
                        stack: expect.objectContaining({ canAddItems: false }),
                    }),
                }),
            }),
        );
    });

    describe("Over Time Comparison", () => {
        it("should return reference point containing uiConfig with PP, SP supported comparison types", async () => {
            const component = createComponent();

            const extendedReferencePoint = await component.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );

            expect(extendedReferencePoint.uiConfig.supportedOverTimeComparisonTypes).toEqual([
                OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                OverTimeComparisonTypes.PREVIOUS_PERIOD,
            ]);
        });
    });

    describe("Dual Axes", () => {
        it("should NOT add measure identifier into properties which are NOT set to secondary axis", async () => {
            const chart = createComponent(defaultProps);

            const extendedReferencePoint = await chart.getExtendedReferencePoint(
                referencePointMocks.oneMetricAndCategoryAndStackReferencePoint,
            );

            const measures = get(extendedReferencePoint, "properties.controls.secondary_xaxis.measures");
            const axis = get(extendedReferencePoint, "uiConfig.axis");
            expect(measures).toBeUndefined();
            expect(axis).toBeUndefined();
        });

        it("should add measures identifiers into properties which are set to secondary axis", async () => {
            const chart = createComponent(defaultProps);

            const extendedReferencePoint = await chart.getExtendedReferencePoint(
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
            );

            const measures = get(extendedReferencePoint, "properties.controls.secondary_xaxis.measures");
            const axis = get(extendedReferencePoint, "uiConfig.axis");
            expect(measures).toEqual(["m3", "m4"]);
            expect(axis).toEqual(AXIS.DUAL);
        });
    });
});
