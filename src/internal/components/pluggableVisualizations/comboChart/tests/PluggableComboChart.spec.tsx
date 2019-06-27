// (C) 2019 GoodData Corporation
import noop from "lodash/noop";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import { VisualizationObject } from "@gooddata/typings";
import { PluggableComboChart } from "../PluggableComboChart";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import {
    IBucket,
    IExtendedReferencePoint,
    IReferencePoint,
    IUiConfig,
} from "../../../../interfaces/Visualization";
import { AXIS } from "../../../../constants/axis";
import { UICONFIG_AXIS, COMBO_CHART_UICONFIG } from "../../../../constants/uiConfig";
import { COMBO_CHART_SUPPORTED_PROPERTIES } from "../../../../constants/supportedProperties";
import { VisualizationTypes } from "../../../../../constants/visualizationTypes";
import { OverTimeComparisonTypes } from "../../../../../interfaces/OverTimeComparison";

describe("PluggableComboChart", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
    };
    const primaryMeasureBucketProps: IBucket = {
        localIdentifier: "measures",
        items: [],
        chartType: VisualizationTypes.COLUMN,
    };
    const secondaryMeasureBucketProps: IBucket = {
        localIdentifier: "secondary_measures",
        items: [],
        chartType: VisualizationTypes.LINE,
    };

    const getExtendedReferencePoint = (referencePoint: IReferencePoint) => {
        const combo = createComponent();
        return combo.getExtendedReferencePoint(referencePoint);
    };

    function createComponent(props = defaultProps) {
        return new PluggableComboChart(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    describe("Buckets transformation", () => {
        it("should reuse all primary measures and secondary measures in reference point", async () => {
            const refPointMock = referencePointMocks.multipleMetricBucketsAndCategoryReferencePoint;
            const extRefPoint: IExtendedReferencePoint = await getExtendedReferencePoint(refPointMock);

            expect(extRefPoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[0],
                            showOnSecondaryAxis: false,
                        },
                    ],
                },
                {
                    ...secondaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[1],
                            showOnSecondaryAxis: true,
                        },
                        {
                            ...referencePointMocks.masterMeasureItems[2],
                            showOnSecondaryAxis: true,
                        },
                    ],
                },
                refPointMock.buckets[3],
            ]);
        });

        it("should place all secondary measures from dual axis chart to secondary measures bucket", async () => {
            const extRefPoint = await getExtendedReferencePoint(
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint,
            );

            expect(extRefPoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[0],
                            showOnSecondaryAxis: false,
                        },
                        {
                            ...referencePointMocks.masterMeasureItems[1],
                            showOnSecondaryAxis: false,
                        },
                    ],
                },
                {
                    ...secondaryMeasureBucketProps,
                    items: referencePointMocks.masterMeasureItems.slice(2, 4),
                },
                {
                    localIdentifier: "view",
                    items: referencePointMocks.attributeItems.slice(0, 1),
                },
            ]);
        });
    });

    describe("Arithmetic measures", () => {
        const {
            firstMeasureArithmeticNoAttributeReferencePoint,
            arithmeticMeasureItems,
            masterMeasureItems,
        } = referencePointMocks;

        it("should place all arithmetic measures into primary measures bucket", async () => {
            const combo = createComponent();

            const extendedReferencePoint = await combo.getExtendedReferencePoint(
                firstMeasureArithmeticNoAttributeReferencePoint,
            );

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        { ...arithmeticMeasureItems[0], showOnSecondaryAxis: false },
                        { ...masterMeasureItems[0], showOnSecondaryAxis: false },
                        { ...masterMeasureItems[1], showOnSecondaryAxis: false },
                    ],
                },
                secondaryMeasureBucketProps,
                {
                    localIdentifier: "view",
                    items: [],
                },
            ]);
        });

        // tslint:disable-next-line:max-line-length
        it("should place arithmetic measure with it's operands into primary measures bucket when there is already an empty secondary measures bucket", async () => {
            const combo = createComponent();

            const extendedReferencePoint = await combo.getExtendedReferencePoint({
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [arithmeticMeasureItems[0], masterMeasureItems[0], masterMeasureItems[1]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [referencePointMocks.overTimeComparisonDateItem],
                },
            });

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        { ...referencePointMocks.arithmeticMeasureItems[0], showOnSecondaryAxis: false },
                        { ...referencePointMocks.masterMeasureItems[0], showOnSecondaryAxis: false },
                        { ...referencePointMocks.masterMeasureItems[1], showOnSecondaryAxis: false },
                    ],
                },
                secondaryMeasureBucketProps,
                {
                    localIdentifier: "view",
                    items: [],
                },
            ]);
        });
    });

    describe("Dual Axis", () => {
        const {
            oneMetricAndCategoryAndStackReferencePoint,
            multipleMetricsAndCategoriesReferencePoint,
            measuresOnSecondaryAxisAndAttributeReferencePoint,
        } = referencePointMocks;

        it.each([
            ["NOT", oneMetricAndCategoryAndStackReferencePoint, undefined],
            ["", multipleMetricsAndCategoriesReferencePoint, ["m3", "m4"]],
        ])(
            "should %s add measure identifiers into properties",
            async (_desc: string, refPoint: IReferencePoint, expectedMeasures: string[]) => {
                const chart = createComponent(defaultProps);
                const extendedReferencePoint = await chart.getExtendedReferencePoint(refPoint);
                const measures = get(extendedReferencePoint, "properties.controls.secondary_yaxis.measures");

                expect(measures).toEqual(expectedMeasures);
            },
        );

        it.each([
            [AXIS.PRIMARY, oneMetricAndCategoryAndStackReferencePoint],
            [AXIS.SECONDARY, measuresOnSecondaryAxisAndAttributeReferencePoint],
            [AXIS.DUAL, multipleMetricsAndCategoriesReferencePoint],
        ])(
            "should update supported properties list when axis is %s",
            async (axis: string, refPoint: IReferencePoint) => {
                const mockProps = {
                    ...defaultProps,
                    pushData: jest.fn(),
                };
                const chart = createComponent(mockProps);

                const ext = await chart.getExtendedReferencePoint(refPoint);
                const axisType = get(ext, UICONFIG_AXIS, AXIS.PRIMARY);

                expect(axisType).toEqual(axis);
                expect(get(chart, "supportedPropertiesList")).toEqual(COMBO_CHART_SUPPORTED_PROPERTIES[axis]);
            },
        );
    });

    describe("Over Time Comparison", () => {
        it("should return reference point with uiConfig containing supportedOverTimeComparisonTypes", async () => {
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

    describe("isStackMeasuresByDefault", () => {
        it.each([
            [VisualizationTypes.COLUMN, false],
            [VisualizationTypes.LINE, false],
            [VisualizationTypes.AREA, true],
        ])(
            "should return stack measures by %s chart type is %s",
            (chartType: VisualizationObject.VisualizationType, expectedResult: boolean) => {
                const mockProps = {
                    ...defaultProps,
                    visualizationProperties: {
                        properties: {
                            controls: {
                                primaryChartType: chartType,
                            },
                        },
                    },
                    pushData: jest.fn(),
                };
                const comboChart = createComponent(mockProps);

                expect(comboChart.isStackMeasuresByDefault()).toEqual(expectedResult);
            },
        );
    });

    describe("optional stacking", () => {
        const COLUMN_AREA_LINE = [
            VisualizationTypes.COLUMN,
            VisualizationTypes.AREA,
            VisualizationTypes.LINE,
        ];

        const {
            oneMetricAndCategoryAndStackReferencePoint,
            multipleMetricsAndCategoriesReferencePoint,
            measuresOnSecondaryAxisAndAttributeReferencePoint,
        } = referencePointMocks;

        it.each([
            [VisualizationTypes.COLUMN, COMBO_CHART_UICONFIG],
            [
                VisualizationTypes.LINE,
                {
                    ...COMBO_CHART_UICONFIG,
                    optionalStacking: {
                        supported: true,
                        disabled: true,
                        stackMeasures: false,
                    },
                },
            ],
            [
                VisualizationTypes.AREA,
                {
                    ...COMBO_CHART_UICONFIG,
                    optionalStacking: {
                        supported: true,
                        disabled: false,
                        stackMeasures: true,
                    },
                },
            ],
        ])(
            "should return combo chart uiconfig by chart type is %s with optional stacking",
            (chartType: VisualizationObject.VisualizationType, expectedUiConfig: IUiConfig) => {
                const mockProps = {
                    ...defaultProps,
                    visualizationProperties: {
                        properties: {
                            controls: {
                                primaryChartType: chartType,
                            },
                        },
                    },
                    pushData: jest.fn(),
                };

                const chart = createComponent(mockProps);

                expect(chart.getUiConfig()).toEqual(expectedUiConfig);
            },
        );

        it.each([
            [AXIS.PRIMARY, oneMetricAndCategoryAndStackReferencePoint],
            [AXIS.SECONDARY, measuresOnSecondaryAxisAndAttributeReferencePoint],
            [AXIS.DUAL, multipleMetricsAndCategoriesReferencePoint],
        ])(
            "should update supported properties list when axis is %s and chart type is column/line/area",
            (axis: string, refPoint: IReferencePoint) => {
                const comboChart = createComponent(defaultProps);
                const clonedReferencePoint = cloneDeep(refPoint);
                const refPoints: Array<Promise<IExtendedReferencePoint>> = COLUMN_AREA_LINE.map(
                    (chartType: VisualizationObject.VisualizationType) => {
                        clonedReferencePoint.buckets.forEach(
                            (bucket: IBucket) => (bucket.chartType = chartType),
                        );
                        return comboChart.getExtendedReferencePoint(clonedReferencePoint);
                    },
                );

                return Promise.all(refPoints).then((extRefPoints: IExtendedReferencePoint[]) => {
                    for (const extRefPoint of extRefPoints) {
                        const axisType = get(extRefPoint, UICONFIG_AXIS, AXIS.PRIMARY);
                        expect(axisType).toEqual(axis);
                        expect(comboChart.getSupportedPropertiesList()).toEqual(
                            COMBO_CHART_SUPPORTED_PROPERTIES[axis],
                        );
                    }
                });
            },
        );
    });

    describe("show in percent", () => {
        it("should keep percentage config if there is only one master measure", async () => {
            const refPointMock: IReferencePoint = referencePointMocks.measureWithDerivedAndPercentageRefPoint;
            const extRefPoint: IExtendedReferencePoint = await getExtendedReferencePoint(refPointMock);

            expect(extRefPoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[0],
                            showOnSecondaryAxis: false,
                            showInPercent: true,
                        },
                        {
                            ...referencePointMocks.derivedMeasureItems[0],
                            showOnSecondaryAxis: false,
                            showInPercent: true,
                        },
                    ],
                },
                secondaryMeasureBucketProps,
                refPointMock.buckets[1],
            ]);
        });

        it("should ignore percentage config if there are multiple master measures on primary measure bucket", async () => {
            const refPointMock: IReferencePoint = referencePointMocks.multipleMeasuresWithPercentageRefPoint;
            const extRefPoint: IExtendedReferencePoint = await getExtendedReferencePoint(refPointMock);

            expect(extRefPoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasuresWithPercentage[0],
                            showOnSecondaryAxis: false,
                            showInPercent: null,
                        },
                        {
                            ...referencePointMocks.masterMeasuresWithPercentage[1],
                            showOnSecondaryAxis: false,
                            showInPercent: null,
                        },
                    ],
                },
                secondaryMeasureBucketProps,
                refPointMock.buckets[1],
            ]);
        });

        it("should ignore percentage config if there are multiple master measures on secondary measure bucket", async () => {
            const refPointMock: IReferencePoint =
                referencePointMocks.multipleSecondaryMeasuresWithPercentageRefPoint;
            const extRefPoint: IExtendedReferencePoint = await getExtendedReferencePoint(refPointMock);

            expect(extRefPoint.buckets).toEqual([
                primaryMeasureBucketProps,
                {
                    ...secondaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasuresWithPercentage[2],
                            showInPercent: null,
                        },
                        {
                            ...referencePointMocks.masterMeasuresWithPercentage[3],
                            showInPercent: null,
                        },
                    ],
                },
                refPointMock.buckets[1],
            ]);
        });

        it("should ignore percentage config if there is more than one master measure on each measure bucket", async () => {
            const refPointMock: IReferencePoint =
                referencePointMocks.multipleMetricBucketsWithPercentageRefPoint;
            const extRefPoint: IExtendedReferencePoint = await getExtendedReferencePoint(refPointMock);

            expect(extRefPoint.buckets).toEqual([
                {
                    ...primaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[0],
                            showOnSecondaryAxis: false,
                        },
                        {
                            ...referencePointMocks.masterMeasureItems[1],
                            showOnSecondaryAxis: false,
                        },
                    ],
                },
                {
                    ...secondaryMeasureBucketProps,
                    items: [
                        {
                            ...referencePointMocks.masterMeasureItems[2],
                            showOnSecondaryAxis: true,
                        },
                        {
                            ...referencePointMocks.masterMeasureItems[3],
                            showOnSecondaryAxis: true,
                        },
                    ],
                },
                refPointMock.buckets[2],
            ]);
        });
    });
});
