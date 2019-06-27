// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import get from "lodash/get";
import { PluggableColumnChart } from "../PluggableColumnChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import { AXIS } from "../../../../constants/axis";
import { OverTimeComparisonTypes } from "../../../../../interfaces/OverTimeComparison";

describe("PluggableColumnChart", () => {
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
        return new PluggableColumnChart(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    it("should send only supported properties and supported properties list via pushData callback", () => {
        const pushData = jest.fn();
        const callbacks = {
            ...defaultProps.callbacks,
            pushData,
        };

        const visualizationProperties = {
            properties: {
                controls: {
                    yaxis: {
                        rotation: "60",
                    },
                    xaxis: {
                        labelsEnabled: false,
                    },
                    legend: {
                        position: "left",
                        enabled: false,
                    },
                    unsupported: {
                        foo: "bar",
                    },
                },
            },
        };

        const props = {
            ...defaultProps,
            callbacks,
            visualizationProperties,
        };

        const expectedSupportedProperties = {
            controls: {
                yaxis: {
                    rotation: "60",
                },
                xaxis: {
                    labelsEnabled: false,
                },
                legend: {
                    position: "left",
                    enabled: false,
                },
            },
        };

        const initialProperties = {
            supportedProperties: expectedSupportedProperties,
        };

        createComponent(props);

        expect(pushData).toBeCalledWith({ initialProperties });
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

            const measures = get(extendedReferencePoint, "properties.controls.secondary_yaxis.measures");
            const axis = get(extendedReferencePoint, "uiConfig.axis");
            expect(measures).toBeUndefined();
            expect(axis).toBeUndefined();
        });

        it("should add measures identifiers into properties which are set to secondary axis", async () => {
            const chart = createComponent(defaultProps);

            const extendedReferencePoint = await chart.getExtendedReferencePoint(
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
            );

            const measures = get(extendedReferencePoint, "properties.controls.secondary_yaxis.measures");
            const axis = get(extendedReferencePoint, "uiConfig.axis");
            expect(measures).toEqual(["m3", "m4"]);
            expect(axis).toEqual(AXIS.DUAL);
        });
    });
});
