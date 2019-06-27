// (C) 2019 GoodData Corporation
import cloneDeep from "lodash/cloneDeep";

import { DATE, DATE_DATASET_ATTRIBUTE, GRANULARITY } from "../../constants/bucket";
import { DEFAULT_BASE_CHART_UICONFIG, DEFAULT_TABLE_UICONFIG } from "../../constants/uiConfig";
import { IExtendedReferencePoint, IFiltersBucketItem } from "../../interfaces/Visualization";
import * as referencePointMocks from "../../mocks/referencePointMocks";
import { configurePercent, configureOverTimeComparison } from "../bucketConfig";
import { OverTimeComparisonTypes } from "../../../interfaces/OverTimeComparison";

describe("configure Percent and Over Time Comparison helper functions", () => {
    const samePeriodPreviousYearFilter: IFiltersBucketItem = {
        localIdentifier: "f1",
        filters: [
            {
                attribute: DATE_DATASET_ATTRIBUTE,
                overTimeComparisonType: OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                interval: {
                    granularity: "GDC.time.year",
                    interval: ["-1", "-1"],
                    name: "last year",
                },
            },
        ],
    };

    const allTimeDateFilter: IFiltersBucketItem = {
        localIdentifier: "f1",
        filters: [
            {
                attribute: DATE_DATASET_ATTRIBUTE,
                overTimeComparisonType: OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                interval: {
                    granularity: "GDC.time.year",
                    interval: [],
                    name: "all_time",
                },
            },
        ],
    };

    function getSingleMeasureNoFilterReferencePoint(numberOfMeasures: number): IExtendedReferencePoint {
        return {
            buckets: [
                {
                    localIdentifier: "measures",
                    items: cloneDeep(referencePointMocks.masterMeasureItems.slice(0, numberOfMeasures)),
                },
                {
                    localIdentifier: "attribute",
                    items: [cloneDeep(referencePointMocks.dateItem)],
                },
            ],
            filters: {
                localIdentifier: "filters",
                items: [],
            },
            uiConfig: DEFAULT_TABLE_UICONFIG,
        };
    }

    function getOverTimeComparisonReferencePoint(dateFilter = allTimeDateFilter): IExtendedReferencePoint {
        const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        uiConfig.buckets.secondary_measures = uiConfig.buckets.measures;

        return {
            buckets: [
                {
                    localIdentifier: "measures",
                    items: referencePointMocks.masterMeasureItems
                        .slice(0, 2)
                        .concat(referencePointMocks.derivedMeasureItems.slice(0, 2))
                        .concat(referencePointMocks.arithmeticMeasureItems.slice(0, 2))
                        .concat(referencePointMocks.arithmeticMeasureItems.slice(3, 4)),
                },
                {
                    localIdentifier: "secondary_measures",
                    items: referencePointMocks.masterMeasureItems
                        .slice(2, 4)
                        .concat(referencePointMocks.derivedMeasureItems.slice(2, 4))
                        .concat(referencePointMocks.arithmeticMeasureItems.slice(5, 6)),
                },
            ],
            filters: {
                localIdentifier: "filters",
                items: [dateFilter],
            },
            uiConfig: {
                ...uiConfig,
                supportedOverTimeComparisonTypes: [
                    OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                    OverTimeComparisonTypes.PREVIOUS_PERIOD,
                ],
            },
        };
    }

    describe("configurePercent", () => {
        it("should remove all showInPercent flags from metrics if show in percent not allowed by bucket rules", () => {
            const referencePoint: IExtendedReferencePoint = getSingleMeasureNoFilterReferencePoint(2);
            referencePoint.buckets[0].items.forEach(item => (item.showInPercent = true));

            const newReferencePoint: IExtendedReferencePoint = configurePercent(
                cloneDeep(referencePoint),
                false,
            );

            newReferencePoint.buckets[0].items.forEach(item => expect(item.showInPercent).toBeFalsy());
        });

        it("should mark show in percent in measure buckets ui config if buckets conditions are met", () => {
            const referencePoint = getSingleMeasureNoFilterReferencePoint(1);

            const newReferencePoint: IExtendedReferencePoint = configurePercent(
                cloneDeep(referencePoint),
                false,
            );

            const expectedUiConfig = cloneDeep(DEFAULT_TABLE_UICONFIG);
            expectedUiConfig.buckets.measures.isShowInPercentEnabled = true;
            expect(newReferencePoint.uiConfig).toEqual(expectedUiConfig);
        });

        it("should force-mark show in percent as not enabled in measure bucket ui config", () => {
            const referencePoint = getSingleMeasureNoFilterReferencePoint(1);
            referencePoint.uiConfig.buckets.measures.isShowInPercentEnabled = true;

            const newReferencePoint: IExtendedReferencePoint = configurePercent(
                cloneDeep(referencePoint),
                true,
            );

            const expectedUiConfig = cloneDeep(DEFAULT_TABLE_UICONFIG);
            expectedUiConfig.buckets.measures.isShowInPercentEnabled = false;
            expect(newReferencePoint.uiConfig).toEqual(expectedUiConfig);
        });

        it("should force-remove show in percent flag in bucket items", () => {
            const referencePoint = getSingleMeasureNoFilterReferencePoint(1);
            referencePoint.buckets[0].items[0].showInPercent = true;

            const newReferencePoint: IExtendedReferencePoint = configurePercent(
                cloneDeep(referencePoint),
                true,
            );

            newReferencePoint.buckets[0].items.forEach(item => expect(item.showInPercent).toBeFalsy());
        });
    });

    describe("configureOverTimeComparison", () => {
        const dateFilter = {
            localIdentifier: "f1",
            filters: [
                {
                    attribute: DATE_DATASET_ATTRIBUTE,
                },
            ],
        };

        const dateFilterWithSamePeriodPreviousYear = {
            localIdentifier: "f1",
            filters: [
                {
                    attribute: DATE_DATASET_ATTRIBUTE,
                    overTimeComparisonType: OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
                    interval: {
                        name: "all_time",
                        granularity: "GDC.time.year",
                        interval: ["0", "0"],
                    },
                },
            ],
        };

        it(
            "should keep all derived measures if over time comparison is available " +
                "due to non-all-time date filter",
            () => {
                const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);

                const referencePoint: IExtendedReferencePoint = {
                    buckets: [
                        {
                            localIdentifier: "measures",
                            items: [
                                referencePointMocks.masterMeasureItems[0],
                                referencePointMocks.derivedMeasureItems[1],
                                referencePointMocks.arithmeticMeasureItems[0],
                                referencePointMocks.arithmeticMeasureItems[1],
                                referencePointMocks.arithmeticMeasureItems[3],
                            ],
                        },
                    ],
                    filters: {
                        localIdentifier: "filters",
                        items: [samePeriodPreviousYearFilter],
                    },
                    uiConfig: {
                        ...uiConfig,
                        supportedOverTimeComparisonTypes: [OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR],
                    },
                };
                const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

                expect(newReferencePoint.buckets).toMatchObject(referencePoint.buckets);
            },
        );

        it("should remove derived measures when no date filter present", () => {
            const referencePoint: IExtendedReferencePoint = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                            referencePointMocks.derivedMeasureItems[0],
                            referencePointMocks.derivedMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[0],
                            referencePointMocks.arithmeticMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[3],
                            referencePointMocks.arithmeticMeasureItems[5],
                        ],
                    },
                    {
                        localIdentifier: "attribute",
                        items: [],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [],
                },
                uiConfig: {
                    ...DEFAULT_BASE_CHART_UICONFIG,
                    supportedOverTimeComparisonTypes: [OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR],
                },
            };

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            expect(newReferencePoint.buckets[0].items).toEqual([
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
            ]);
        });

        it("should remove all derived measures when comparison is not allowed due to used stack", () => {
            const referencePoint: IExtendedReferencePoint = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                            referencePointMocks.derivedMeasureItems[0],
                            referencePointMocks.derivedMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[0],
                            referencePointMocks.arithmeticMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[3],
                            referencePointMocks.arithmeticMeasureItems[5],
                        ],
                    },
                    {
                        localIdentifier: "stack",
                        items: [referencePointMocks.attributeItems[0]],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [dateFilterWithSamePeriodPreviousYear],
                },
                uiConfig: {
                    ...DEFAULT_BASE_CHART_UICONFIG,
                    supportedOverTimeComparisonTypes: [OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR],
                },
            };

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            expect(newReferencePoint.buckets[0].items).toEqual([
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
            ]);
        });

        it("should remove all derived measures when comparison is not allowed due week granularity", () => {
            const referencePoint: IExtendedReferencePoint = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [
                            referencePointMocks.masterMeasureItems[0],
                            referencePointMocks.masterMeasureItems[1],
                            referencePointMocks.derivedMeasureItems[0],
                            referencePointMocks.derivedMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[0],
                            referencePointMocks.arithmeticMeasureItems[1],
                            referencePointMocks.arithmeticMeasureItems[3],
                            referencePointMocks.arithmeticMeasureItems[5],
                        ],
                    },
                    {
                        localIdentifier: "view",
                        items: [
                            {
                                localIdentifier: "date-week-attribute",
                                type: DATE,
                                attribute: DATE_DATASET_ATTRIBUTE,
                                granularity: GRANULARITY.week,
                            },
                        ],
                    },
                ],
                filters: {
                    localIdentifier: "filters",
                    items: [dateFilterWithSamePeriodPreviousYear],
                },
                uiConfig: {
                    ...DEFAULT_BASE_CHART_UICONFIG,
                    supportedOverTimeComparisonTypes: [OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR],
                },
            };

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            expect(newReferencePoint.buckets[0].items).toEqual([
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
            ]);
        });

        it("should remove all derived measures when compare type is undefined", () => {
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilter);

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            const expectedReferencePoint = cloneDeep(referencePoint);
            expectedReferencePoint.buckets[0].items = referencePointMocks.masterMeasureItems
                .slice(0, 2)
                .concat(referencePointMocks.arithmeticMeasureItems.slice(0, 2));
            expectedReferencePoint.buckets[1].items = referencePointMocks.masterMeasureItems.slice(2, 4);

            expect(newReferencePoint.buckets).toMatchObject(expectedReferencePoint.buckets);
        });

        it("should remove all derived measures when compare type is NOTHING", () => {
            const dateFilter = {
                localIdentifier: "f1",
                filters: [
                    {
                        attribute: DATE_DATASET_ATTRIBUTE,
                        overTimeComparisonType: OverTimeComparisonTypes.NOTHING,
                    },
                ],
            };
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilter);

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            const expectedReferencePoint = cloneDeep(referencePoint);
            expectedReferencePoint.buckets[0].items = referencePointMocks.masterMeasureItems
                .slice(0, 2)
                .concat(referencePointMocks.arithmeticMeasureItems.slice(0, 2));
            expectedReferencePoint.buckets[1].items = referencePointMocks.masterMeasureItems.slice(2, 4);

            expect(newReferencePoint.buckets).toMatchObject(expectedReferencePoint.buckets);
        });

        it("should keep all derived measures when compare type is SP", () => {
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilterWithSamePeriodPreviousYear);

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            expect(newReferencePoint.buckets).toMatchObject(referencePoint.buckets);
        });

        it("should keep derived measures when UI config contains used comparison type", () => {
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilterWithSamePeriodPreviousYear);
            referencePoint.uiConfig.supportedOverTimeComparisonTypes = [
                OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
            ];

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            const expectedReferencePoint = cloneDeep(referencePoint);
            expectedReferencePoint.buckets[0].items = [
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.derivedMeasureItems[0],
                referencePointMocks.derivedMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[3],
            ];
            expectedReferencePoint.buckets[1].items = [
                referencePointMocks.masterMeasureItems[2],
                referencePointMocks.masterMeasureItems[3],
                referencePointMocks.derivedMeasureItems[2],
                referencePointMocks.derivedMeasureItems[3],
                referencePointMocks.arithmeticMeasureItems[5],
            ];

            expect(newReferencePoint.buckets).toMatchObject(expectedReferencePoint.buckets);
        });

        it("should remove all derived measures when UI config is empty", () => {
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilterWithSamePeriodPreviousYear);
            referencePoint.uiConfig.supportedOverTimeComparisonTypes = [];

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            const expectedReferencePoint = cloneDeep(referencePoint);
            expectedReferencePoint.buckets[0].items = [
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
            ];
            expectedReferencePoint.buckets[1].items = [
                referencePointMocks.masterMeasureItems[2],
                referencePointMocks.masterMeasureItems[3],
            ];

            expect(newReferencePoint.buckets).toMatchObject(expectedReferencePoint.buckets);
        });

        it("should remove all derived measures when UI config contains only NOTHING option", () => {
            const referencePoint = getOverTimeComparisonReferencePoint(dateFilterWithSamePeriodPreviousYear);
            referencePoint.uiConfig.supportedOverTimeComparisonTypes = [OverTimeComparisonTypes.NOTHING];

            const newReferencePoint = configureOverTimeComparison(cloneDeep(referencePoint));

            const expectedReferencePoint = cloneDeep(referencePoint);
            expectedReferencePoint.buckets[0].items = [
                referencePointMocks.masterMeasureItems[0],
                referencePointMocks.masterMeasureItems[1],
                referencePointMocks.arithmeticMeasureItems[0],
                referencePointMocks.arithmeticMeasureItems[1],
            ];
            expectedReferencePoint.buckets[1].items = [
                referencePointMocks.masterMeasureItems[2],
                referencePointMocks.masterMeasureItems[3],
            ];

            expect(newReferencePoint.buckets).toMatchObject(expectedReferencePoint.buckets);
        });
    });
});
