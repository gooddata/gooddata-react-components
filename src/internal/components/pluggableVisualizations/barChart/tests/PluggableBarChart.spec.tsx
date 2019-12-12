// (C) 2019 GoodData Corporation
import noop = require("lodash/noop");
import get = require("lodash/get");
import { DataLayer } from "@gooddata/gooddata-js";
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { OverTimeComparisonTypes } from "../../../../../interfaces/OverTimeComparison";
import { IVisConstruct, IVisProps, IVisualizationProperties } from "../../../../interfaces/Visualization";
import { PluggableBarChart } from "../PluggableBarChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import { AXIS } from "../../../../constants/axis";
import * as testMocks from "../../../../mocks/testMocks";

jest.mock("react-dom", () => {
    const renderObject = {
        render: () => {
            return;
        }, // spy on render
    };
    return {
        render: renderObject.render,
        unmountComponentAtNode: () => {
            return;
        },
        renderObject,
    };
});

describe("PluggableBarChart", () => {
    const defaultProps: IVisConstruct = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
        featureFlags: {
            enableSortingByTotalGroup: true,
        },
    };

    function createComponent(customProps?: Partial<IVisConstruct>) {
        const props: IVisConstruct = {
            ...defaultProps,
            ...customProps,
        };
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

    describe("Sorting", () => {
        afterAll(() => {
            document.clear();
        });

        const defaultVisualizationProperties = {
            properties: {
                controls: {
                    stackMeasures: false,
                },
            },
        };

        const stackedVisualizationProperties = {
            properties: {
                controls: {
                    stackMeasures: true,
                },
            },
        };

        it.each([
            [
                "1M and 2VB",
                testMocks.twoViewItemsMdObject,
                testMocks.dataSourceWithOneMeasureTwoViews,
                testMocks.oneMeasureTwoViewsResultSpec,
                defaultVisualizationProperties,
            ],
            [
                "1M, 2VB and 1SB",
                testMocks.oneMeasureTwoViewsStackedMdObject,
                testMocks.dataSourceWithOneMeasureTwoViewsStacked,
                testMocks.oneMeasureTwoViewsStackedResultSpec,
                defaultVisualizationProperties,
            ],
            [
                "2M, 2VB and stackMeasures true",
                testMocks.twoMeasuresTwoViewsMdObject,
                testMocks.dataSourceWithTwoMeasuresTwoViews,
                testMocks.twoMeasuresTwoViewsResultSpec,
                stackedVisualizationProperties,
            ],
        ])(
            "should sort bar chart with %s by size of the group and then by the size of each member of the group",
            (
                _buckets: string,
                mdObject: VisualizationObject.IVisualizationObjectContent,
                dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>,
                resultSpec: AFM.IResultSpec,
                visualizationProperties: IVisualizationProperties,
            ) => {
                const renderObject = require("react-dom");
                const spyOnRender = jest.spyOn(renderObject, "render");

                const visualization = createComponent();

                const options: IVisProps = {
                    dataSource,
                    resultSpec,
                    dimensions: { height: null },
                    locale: "en-US",
                    custom: {
                        stickyHeaderOffset: 3,
                    },
                };
                visualization.update(options, visualizationProperties, mdObject, undefined);

                const renderCallsCount = spyOnRender.mock.calls.length;
                const renderChartElement: any = spyOnRender.mock.calls[renderCallsCount - 1][0];

                expect(renderChartElement.props.resultSpec.sorts).toMatchObject([
                    {
                        attributeSortItem: {
                            aggregation: "sum",
                            attributeIdentifier: "a1",
                            direction: "desc",
                        },
                    },
                    {
                        attributeSortItem: {
                            aggregation: "sum",
                            attributeIdentifier: "a2",
                            direction: "desc",
                        },
                    },
                ]);
            },
        );

        it("should sort bar chart with 2M and 2VB by size of the group and each member of the group are sorted by first measure", () => {
            const renderObject = require("react-dom");
            const spyOnRender = jest.spyOn(renderObject, "render");

            const visualization = createComponent();

            const options: IVisProps = {
                dataSource: testMocks.dataSourceWithTwoMeasuresTwoViews,
                resultSpec: testMocks.twoMeasuresTwoViewsResultSpec,
                dimensions: { height: null },
                locale: "en-US",
                custom: {
                    stickyHeaderOffset: 3,
                },
            };
            visualization.update(
                options,
                defaultVisualizationProperties,
                testMocks.twoMeasuresTwoViewsMdObject,
                undefined,
            );

            const renderCallsCount = spyOnRender.mock.calls.length;
            const renderChartElement: any = spyOnRender.mock.calls[renderCallsCount - 1][0];

            expect(renderChartElement.props.resultSpec.sorts).toMatchObject([
                {
                    attributeSortItem: {
                        aggregation: "sum",
                        attributeIdentifier: "a1",
                        direction: "desc",
                    },
                },
                {
                    measureSortItem: {
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                        direction: "desc",
                    },
                },
            ]);
        });

        it("should not sort bar chart by total group", () => {
            const renderObject = require("react-dom");
            const spyOnRender = jest.spyOn(renderObject, "render");

            const visualization = createComponent({
                featureFlags: {
                    enableSortingByTotalGroup: false,
                },
            });

            const options: IVisProps = {
                dataSource: testMocks.dataSourceWithTwoMeasuresTwoViews,
                resultSpec: testMocks.twoMeasuresTwoViewsResultSpec,
                dimensions: { height: null },
                locale: "en-US",
                custom: {
                    stickyHeaderOffset: 3,
                },
            };
            visualization.update(
                options,
                defaultVisualizationProperties,
                testMocks.twoMeasuresTwoViewsMdObject,
                undefined,
            );

            const renderCallsCount = spyOnRender.mock.calls.length;
            const renderChartElement: any = spyOnRender.mock.calls[renderCallsCount - 1][0];

            expect(renderChartElement.props.resultSpec.sorts).toMatchObject([
                {
                    measureSortItem: {
                        direction: "desc",
                        locators: [{ measureLocatorItem: { measureIdentifier: "m1" } }],
                    },
                },
            ]);
        });
    });
});
