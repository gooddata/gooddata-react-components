// (C) 2019 GoodData Corporation
import React from "react";
import ReactDom from "react-dom";
import cloneDeep from "lodash/cloneDeep";

import { PluggableHeadline } from "../PluggableHeadline";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import * as testMocks from "../../../../mocks/testMocks";
import {
    IBucket,
    IExtendedReferencePoint,
    IFilters,
    IReferencePoint,
    IVisConstruct,
    IVisProps,
    IVisualizationProperties,
} from "../../../../interfaces/Visualization";

import { getMeasureItems } from "../../../../utils/bucketHelper";
import { IDrillableItem } from "../../../../../interfaces/DrillEvents";
import { OverTimeComparisonTypes } from "../../../../../interfaces/OverTimeComparison";
import { Headline } from "../../../../../components/core/Headline";
import * as BucketNames from "../../../../../constants/bucketNames";

describe("PluggableHeadline", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: "invalid",
        callbacks: {
            afterRender: jest.fn(),
            pushData: jest.fn(),
            onLoadingChanged: jest.fn(),
            onError: jest.fn(),
        },
    };

    function createComponent(customProps: Partial<IVisConstruct> = {}) {
        return new PluggableHeadline({
            ...defaultProps,
            ...customProps,
        });
    }

    function createReferencePointWithDateFilter(buckets: IBucket[]): IExtendedReferencePoint {
        return {
            buckets,
            filters: referencePointMocks.samePeriodPrevYearFiltersBucket,
            uiConfig: {
                buckets: {},
            },
        };
    }

    it("should create visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    describe("init", () => {
        it("should not call pushData during init", () => {
            const pushData = jest.fn();

            createComponent({
                callbacks: {
                    pushData,
                },
            });

            expect(pushData).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        function getTestOptions(): IVisProps {
            const drillableItems: IDrillableItem[] = [];
            return {
                dataSource: testMocks.dummyDataSource,
                resultSpec: testMocks.dummyTableResultSpec,
                dimensions: {
                    width: 12,
                    height: 14,
                },
                custom: {
                    stickyHeaderOffset: 0,
                    drillableItems,
                },
                locale: "en-US",
            };
        }

        it("should not render headline when dataSource is missing", () => {
            const fakeElement: any = "fake element";
            const reactCreateElementSpy = jest
                .spyOn(React, "createElement")
                .mockImplementation(() => fakeElement);
            const reactRenderSpy = jest.spyOn(ReactDom, "render").mockImplementation(jest.fn());

            const headline = createComponent();

            const properties: IVisualizationProperties = {};
            const options: IVisProps = getTestOptions();

            headline.update({ ...options, dataSource: null }, properties, testMocks.emptyMdObject);

            expect(reactRenderSpy).toHaveBeenCalledTimes(0);

            reactCreateElementSpy.mockReset();
            reactRenderSpy.mockReset();
        });

        it("should render headline by react to given element passing down properties", () => {
            const fakeElement: any = "fake element";
            const reactCreateElementSpy = jest
                .spyOn(React, "createElement")
                .mockImplementation(() => fakeElement);
            const reactRenderSpy = jest.spyOn(ReactDom, "render").mockImplementation(jest.fn());

            const headline = createComponent();
            const options: IVisProps = getTestOptions();

            headline.update(options, null, testMocks.emptyMdObject);

            expect(reactCreateElementSpy.mock.calls[0][0]).toBe(Headline);
            expect(reactCreateElementSpy.mock.calls[0][1]).toEqual({
                projectId: "PROJECTID",
                config: undefined,
                drillableItems: options.custom.drillableItems,
                locale: options.locale,
                dataSource: options.dataSource,
                resultSpec: {
                    ...options.resultSpec,
                    dimensions: [{ itemIdentifiers: ["measureGroup"] }],
                },
                afterRender: defaultProps.callbacks.afterRender,
                onLoadingChanged: defaultProps.callbacks.onLoadingChanged,
                pushData: defaultProps.callbacks.pushData,
                onError: defaultProps.callbacks.onError,
                ErrorComponent: null,
                LoadingComponent: null,
            });
            expect(reactRenderSpy).toHaveBeenCalledWith(
                fakeElement,
                document.querySelector(defaultProps.element),
            );

            reactCreateElementSpy.mockReset();
            reactRenderSpy.mockReset();
        });
    });

    describe("getExtendedReferencePoint", () => {
        it("should return proper extended reference point", async () => {
            const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
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
                    localIdentifier: "secondary_measures",
                    items: referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets[0].items.slice(
                        1,
                        2,
                    ),
                },
            ];
            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: uiConfigMocks.oneMetricHeadlineUiConfig,
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should return extended reference point without any derived measures or arithmetic measures created from derived measures within measures bucket if there is no date filter", async () => {
            const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                referencePointMocks.measureWithDerivedWithoutDateFilterRefPoint,
            );

            getMeasureItems(extendedReferencePoint.buckets).forEach(bucketItem => {
                expect(bucketItem).not.toHaveProperty("derivedMeasureDefinition");
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should unset showInPercent flag from measure and remove attribute", async () => {
            const referencePoint: IReferencePoint = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            {
                                ...referencePointMocks.masterMeasureItems[0],
                                showInPercent: true,
                            },
                        ],
                    },
                    {
                        localIdentifier: "view",
                        items: [referencePointMocks.attributeItems[0]],
                    },
                    {
                        localIdentifier: "stack",
                        items: [],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [],
                },
            };
            const extendedReferencePoint = await createComponent().getExtendedReferencePoint(referencePoint);

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        expect.objectContaining({
                            showInPercent: null,
                        }),
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [],
                },
            ]);
        });

        it("should remove invalid sort items in properties", async () => {
            const table = createComponent();
            const extendedReferencePoint = await table.getExtendedReferencePoint(
                referencePointMocks.simpleStackedReferencePoint,
            );

            expect(extendedReferencePoint.properties).toEqual({});
        });

        it("should correctly process empty reference point", async () => {
            const headline = createComponent();
            const extendedReferencePoint = await headline.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [],
                },
            ];

            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };

            const expectedUiConfig = { ...uiConfigMocks.oneMetricHeadlineUiConfig };
            expectedUiConfig.buckets.measures.canAddItems = true;
            expectedUiConfig.buckets.secondary_measures.canAddItems = true;

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: expectedUiConfig,
            });
        });

        describe("known buckets", () => {
            // tslint:disable-next-line:max-line-length
            it("should keep first bucket empty when primary measures bucket is empty and the second is not", async () => {
                const headline = createComponent();
                const referencePoint = cloneDeep(referencePointMocks.emptyReferencePoint);
                referencePoint.buckets = [
                    {
                        localIdentifier: "measures",
                        items: [],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                ];
                const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                expect(extendedReferencePoint.buckets).toEqual(referencePoint.buckets);
                expect(extendedReferencePoint.uiConfig.customError).toEqual({
                    heading: "No primary measure in your insight",
                    text:
                        "Add a primary measure to your insight, or switch to table.\n" +
                        "Once done, you'll be able to save it.",
                });
            });

            it("should keep only measure in primary bucket", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual(referencePoint.buckets);
            });

            it("should keep measures in primary and secondary buckets", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual(referencePoint.buckets);
            });

            // tslint:disable-next-line:max-line-length
            it("should place measures to primary and secondary buckets when primary source bucket contains 2 measures", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should place measures to primary and secondary buckets when secondary source bucket contains 2 measures", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });
        });

        describe("unknown buckets", () => {
            // tslint:disable-next-line:max-line-length
            it("should place measures to primary and secondary buckets when first source bucket contains one measure", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "unknown_measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should place measures to primary and secondary buckets when source buckets contains one measure each", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "unknown_measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "unknown_secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should place first two measures to primary and secondary buckets when first source buckets contains more measures", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "unknown_measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                    {
                        localIdentifier: "unknown_secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[2]],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[2]],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should place measures to primary and secondary buckets when second source bucket contains 2 measures", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "unknown_measures",
                        items: [],
                    },
                    {
                        localIdentifier: "unknown_secondary_measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                        ],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should place first two measures to primary and secondary buckets when second source bucket contains 3 measures", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "unknown_measures",
                        items: [],
                    },
                    {
                        localIdentifier: "unknown_secondary_measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                            referencePointMocks.masterMeasureItems[2],
                        ],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });
        });

        describe("mixed known and unknown buckets", () => {
            // tslint:disable-next-line:max-line-length
            it("should put measures to primary and secondary buckets when one measure is in known and second in unknown bucket", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [],
                    },
                    {
                        localIdentifier: "unknown_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });

            // tslint:disable-next-line:max-line-length
            it("should put measures to primary and secondary buckets when both measures are in known bucket, but empty unknown also present", async () => {
                const referencePoint = createReferencePointWithDateFilter([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                    {
                        localIdentifier: "uknown_measures",
                        items: [],
                    },
                ]);
                const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                    referencePoint,
                );

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[1]],
                    },
                ]);
            });
        });

        describe("Arithmetic measures", () => {
            it("should skip AM that does not fit and place master together with derived", async () => {
                const headline = createComponent();

                const extendedReferencePoint = await headline.getExtendedReferencePoint({
                    buckets: [
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.arithmeticMeasureItems[3],
                                referencePointMocks.derivedMeasureItems[0],
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.masterMeasureItems[0],
                            ],
                        },
                    ],
                    filters: {
                        localIdentifier: "filters",
                        items: [referencePointMocks.overTimeComparisonDateItem],
                    },
                });

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.derivedMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                ]);
            });

            it("should should skip AM that does not fit and place derived together with master", async () => {
                const headline = createComponent();

                const extendedReferencePoint = await headline.getExtendedReferencePoint({
                    buckets: [
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.arithmeticMeasureItems[3],
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.derivedMeasureItems[0],
                            ],
                        },
                    ],
                    filters: {
                        localIdentifier: "filters",
                        items: [referencePointMocks.overTimeComparisonDateItem],
                    },
                });

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.derivedMeasureItems[0]],
                    },
                ]);
            });

            it("should accept arithmetic measure when it has the same measure in both operands", async () => {
                const headline = createComponent();

                const extendedReferencePoint = await headline.getExtendedReferencePoint({
                    buckets: [
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.arithmeticMeasureItems[2],
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.masterMeasureItems[1],
                            ],
                        },
                    ],
                    filters: {
                        localIdentifier: "filters",
                        items: [referencePointMocks.overTimeComparisonDateItem],
                    },
                });

                expect(extendedReferencePoint.buckets).toEqual([
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.arithmeticMeasureItems[2]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                ]);
            });
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

            describe("placing new derived items", () => {
                it("should place new derived bucket item after the master measure in the primary bucket", async () => {
                    const headline = createComponent();
                    const referencePointWithDerivedItems = await headline.addNewDerivedBucketItems(
                        referencePointMocks.headlineWithMeasureInPrimaryBucket,
                        [referencePointMocks.derivedMeasureItems[0]],
                    );

                    expect(referencePointWithDerivedItems).toEqual({
                        ...referencePointMocks.headlineWithMeasureInPrimaryBucket,
                        ...{
                            buckets: [
                                {
                                    localIdentifier: BucketNames.MEASURES,
                                    items: [
                                        referencePointMocks.masterMeasureItems[0],
                                        referencePointMocks.derivedMeasureItems[0],
                                    ],
                                },
                                referencePointMocks.headlineWithMeasureInPrimaryBucket.buckets[1],
                            ],
                        },
                    });
                });

                // tslint:disable-next-line:max-line-length
                it("should place new derived bucket items before the master measure in the secondary bucket", async () => {
                    const headline = createComponent();
                    const referencePointWithDerivedItems = await headline.addNewDerivedBucketItems(
                        referencePointMocks.headlineWithMeasureInSecondaryBucket,
                        [referencePointMocks.derivedMeasureItems[0]],
                    );

                    expect(referencePointWithDerivedItems).toEqual({
                        ...referencePointMocks.headlineWithMeasureInSecondaryBucket,
                        ...{
                            buckets: [
                                referencePointMocks.headlineWithMeasureInSecondaryBucket.buckets[0],
                                {
                                    localIdentifier: BucketNames.SECONDARY_MEASURES,
                                    items: [
                                        referencePointMocks.derivedMeasureItems[0],
                                        referencePointMocks.masterMeasureItems[0],
                                    ],
                                },
                            ],
                        },
                    });
                });
            });

            describe("known buckets", () => {
                const buckets: IBucket[] = [
                    {
                        localIdentifier: "measures",
                        items: [referencePointMocks.masterMeasureItems[0]],
                    },
                    {
                        localIdentifier: "secondary_measures",
                        items: [referencePointMocks.derivedMeasureItems[0]],
                    },
                ];

                it("should keep derived measures when global date is set to all time", async () => {
                    const headline = createComponent();
                    const referencePoint: IReferencePoint = {
                        buckets,
                        filters: referencePointMocks.dateFilterBucketAllTime,
                    };
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual(buckets);
                });

                it("should keep derived measures when global date is set to last year", async () => {
                    const headline = createComponent();
                    const referencePoint: IReferencePoint = {
                        buckets,
                        filters: referencePointMocks.samePeriodPrevYearFiltersBucket,
                    };
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual(buckets);
                });

                it("should remove derived measures when global date filter is missing", async () => {
                    const headline = createComponent();
                    const referencePoint: IReferencePoint = {
                        buckets,
                        filters: {
                            localIdentifier: "filters",
                            items: [],
                        },
                    };
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should put derived to primary and master to secondary bucket if both were in measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[0],
                                referencePointMocks.masterMeasureItems[0],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.derivedMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should put derived to primary and master to secondary bucket if both were in secondary measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[0],
                                referencePointMocks.masterMeasureItems[0],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.derivedMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first derived and its master as primary and secondary measure when multiple measures present in measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[0],
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.masterMeasureItems[0],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.derivedMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first master and its derived as primary and secondary measure when multiple measures present in measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.derivedMeasureItems[0],
                                referencePointMocks.derivedMeasureItems[1],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[1]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.derivedMeasureItems[1]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first master and its derived as primary and secondary measure when multiple measures present in measures and secondary measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.masterMeasureItems[1],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[1]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first derived and its master as primary and secondary measure when multiple measures present in measures and secondary measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.masterMeasureItems[1],
                            ],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.derivedMeasureItems[1]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[1]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first master and its derived as primary and secondary measures when multiple master are in measures and multiple derived are in secondary measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.masterMeasureItems[2],
                            ],
                        },
                        {
                            localIdentifier: "another_measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.derivedMeasureItems[2],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[1]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.derivedMeasureItems[1]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should pick first derived and its master as primary and secondary measures when multiple derived are in measures and multiple master are in secondary measures bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.derivedMeasureItems[2],
                            ],
                        },
                        {
                            localIdentifier: "another_measures",
                            items: [
                                referencePointMocks.masterMeasureItems[1],
                                referencePointMocks.masterMeasureItems[2],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.derivedMeasureItems[1]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.masterMeasureItems[1]],
                        },
                    ]);
                });
            });

            describe("mixed known and unknown buckets", () => {
                // tslint:disable-next-line:max-line-length
                it("should remove derived measures when viewBy date is present but global date filter is missing", async () => {
                    const bucketsWithViewBy: IBucket[] = [
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.masterMeasureItems[0],
                            ],
                        },
                        {
                            localIdentifier: "view",
                            items: [referencePointMocks.dateItem],
                        },
                        {
                            localIdentifier: "stack",
                            items: [],
                        },
                    ];
                    const headline = createComponent();
                    const referencePoint: IReferencePoint = {
                        buckets: bucketsWithViewBy,
                        filters: {
                            localIdentifier: "filters",
                            items: [],
                        },
                    };
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should use first master and its derived as primary and secondary measures when master found in known and derived in unknown bucket", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.masterMeasureItems[1],
                            ],
                        },
                        {
                            localIdentifier: "another_measures",
                            items: [
                                referencePointMocks.masterMeasureItems[2],
                                referencePointMocks.derivedMeasureItems[0],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.derivedMeasureItems[0]],
                        },
                    ]);
                });

                // tslint:disable-next-line:max-line-length
                it("should use first master and its derived as primary and secondary measures when found in unknown buckets", async () => {
                    const headline = createComponent();
                    const referencePoint = createReferencePointWithDateFilter([
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.masterMeasureItems[1],
                            ],
                        },
                        {
                            localIdentifier: "another_measures",
                            items: [
                                referencePointMocks.masterMeasureItems[2],
                                referencePointMocks.derivedMeasureItems[0],
                            ],
                        },
                    ]);
                    const extendedReferencePoint = await headline.getExtendedReferencePoint(referencePoint);

                    expect(extendedReferencePoint.buckets).toEqual([
                        {
                            localIdentifier: "measures",
                            items: [referencePointMocks.masterMeasureItems[0]],
                        },
                        {
                            localIdentifier: "secondary_measures",
                            items: [referencePointMocks.derivedMeasureItems[0]],
                        },
                    ]);
                });
            });
        });
    });
});
