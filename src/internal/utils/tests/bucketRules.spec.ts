// (C) 2019 GoodData Corporation
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";

import { IBucketItem, IBucket, IFilters } from "../../interfaces/Visualization";
import * as bucketRules from "../bucketRules";
import * as referencePointMocks from "../../mocks/referencePointMocks";
import * as BucketNames from "../../../constants/bucketNames";

describe("isShowInPercentAllowed", () => {
    it("should return true if buckets rules met", () => {
        expect(
            bucketRules.isShowInPercentAllowed(
                referencePointMocks.metricWithViewByDateAndDateFilterReferencePoint.buckets,
                referencePointMocks.metricWithViewByDateAndDateFilterReferencePoint.filters,
                BucketNames.MEASURES,
            ),
        ).toBeTruthy();
    });

    it("should return false if buckets rules doesn't met ", () => {
        expect(
            bucketRules.isShowInPercentAllowed(
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint.buckets,
                referencePointMocks.multipleMetricsAndCategoriesReferencePoint.filters,
                BucketNames.MEASURES,
            ),
        ).toBeFalsy();
    });
});

describe("overTimeComparisonRecommendationEnabled", () => {
    it("should return true if buckets rules met", () => {
        expect(
            bucketRules.overTimeComparisonRecommendationEnabled(
                referencePointMocks.overTimeComparisonRecommendationRefPoint,
            ),
        ).toBeTruthy();
    });

    it("should return false if buckets rules doesn't met", () => {
        const editedReferencePoint = cloneDeep(referencePointMocks.overTimeComparisonRecommendationRefPoint);
        const newMetric: IBucketItem = {
            localIdentifier: "m2",
            type: "metric",
            aggregation: null,
            attribute: "aazb6kroa3iC",
            showInPercent: null,
        };

        set(editedReferencePoint, ["buckets", 0, "items", 1], newMetric);

        expect(bucketRules.overTimeComparisonRecommendationEnabled(editedReferencePoint)).toBeFalsy();
    });
});

describe("comparisonAndTrendingRecommendationEnabled", () => {
    it("should return true if buckets rules met", () => {
        expect(
            bucketRules.comparisonAndTrendingRecommendationEnabled(
                referencePointMocks.comparisonAndTrendingRecommendationReferencePoint.buckets,
            ),
        ).toBeTruthy();
    });

    it("should return false if buckets rules doesn't met", () => {
        const editedReferencePoint = cloneDeep(
            referencePointMocks.comparisonAndTrendingRecommendationReferencePoint,
        );

        const newCategory: IBucketItem = {
            localIdentifier: "v1",
            type: "attribute",
            aggregation: null,
            attribute: "attr.owner.department",
        };

        set(editedReferencePoint, ["buckets", 1, "items", 0], newCategory);

        expect(
            bucketRules.comparisonAndTrendingRecommendationEnabled(editedReferencePoint.buckets),
        ).toBeFalsy();
    });
});

describe("percentRecommendationEnabled", () => {
    it("should return true if buckets rules met", () => {
        expect(
            bucketRules.percentRecommendationEnabled(
                referencePointMocks.percentRecommendationReferencePoint.buckets,
            ),
        ).toBeTruthy();
    });

    it("should return false if buckets rules doesn't met", () => {
        const editedReferencePoint = cloneDeep(referencePointMocks.percentRecommendationReferencePoint);

        const newStack: IBucketItem = {
            localIdentifier: "s1",
            type: "attribute",
            aggregation: null,
            attribute: "attr.owner.department",
        };

        set(editedReferencePoint, ["buckets", 2, "items", 0], newStack);

        expect(bucketRules.percentRecommendationEnabled(editedReferencePoint.buckets)).toBeFalsy();
    });
});

describe("previousPeriodRecommendationEnabled", () => {
    it("should return true if buckets rules met", () => {
        expect(
            bucketRules.previousPeriodRecommendationEnabled(
                referencePointMocks.percentRecommendationReferencePoint.buckets,
            ),
        ).toBeTruthy();
    });

    it("should return false if buckets rules doesn't met", () => {
        const editedReferencePoint = cloneDeep(referencePointMocks.percentRecommendationReferencePoint);

        const newMetric: IBucketItem = {
            localIdentifier: "m2",
            type: "attribute",
            aggregation: null,
            attribute: "attr.owner.department",
        };

        set(editedReferencePoint, ["buckets", 0, "items", 1], newMetric);

        expect(bucketRules.previousPeriodRecommendationEnabled(editedReferencePoint.buckets)).toBeFalsy();
    });
});

describe("partial rules", () => {
    describe("noDerivedMeasurePresent", () => {
        it("should return true for no bucket", () => {
            const buckets: IBucket[] = [];

            const result = bucketRules.noDerivedMeasurePresent(buckets);

            expect(result).toBe(true);
        });

        it("should return true for empty bucket items", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "whatever",
                    items: [],
                },
            ];

            const result = bucketRules.noDerivedMeasurePresent(buckets);

            expect(result).toBe(true);
        });

        it("should return true for only master measures", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "whatever",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
            ];

            const result = bucketRules.noDerivedMeasurePresent(buckets);

            expect(result).toBe(true);
        });

        it("should return false if there is a derived measure present", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "whatever",
                    items: [
                        referencePointMocks.masterMeasureItems[0],
                        referencePointMocks.derivedMeasureItems[0],
                    ],
                },
            ];

            const result = bucketRules.noDerivedMeasurePresent(buckets);

            expect(result).toBe(false);
        });
    });

    describe("hasSomeSegmentByItems", () => {
        it("should return false when bucket not exist", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [],
                },
            ];

            const result = bucketRules.hasSomeSegmentByItems(buckets);

            expect(result).toBe(false);
        });

        it("should return false for empty bucket", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "segment",
                    items: [],
                },
            ];

            const result = bucketRules.hasSomeSegmentByItems(buckets);

            expect(result).toBe(false);
        });

        it("should return true when some attribute in bucket", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "segment",
                    items: [
                        {
                            localIdentifier: "v1",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.department",
                        },
                    ],
                },
            ];

            const result = bucketRules.hasSomeSegmentByItems(buckets);

            expect(result).toBe(true);
        });

        it("should return true when more attributes in bucket", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "segment",
                    items: [
                        {
                            localIdentifier: "v1",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.department",
                        },
                        {
                            localIdentifier: "v2",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.department",
                        },
                    ],
                },
            ];

            const result = bucketRules.hasSomeSegmentByItems(buckets);

            expect(result).toBe(true);
        });
    });

    describe("hasOneMasterMeasureInBucket", () => {
        it("should return false for empty bucket items", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [],
                },
            ];

            const result = bucketRules.hasOneMasterMeasureInBucket(buckets, "measures");

            expect(result).toBe(false);
        });

        it("should return true for only master measures", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
            ];

            const result = bucketRules.hasOneMasterMeasureInBucket(buckets, "measures");

            expect(result).toBe(true);
        });

        it("should return true if there is just one master measure and its derived measure present", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        referencePointMocks.masterMeasureItems[1],
                        referencePointMocks.derivedMeasureItems[1],
                    ],
                },
            ];

            const result = bucketRules.hasOneMasterMeasureInBucket(buckets, "measures");

            expect(result).toBe(true);
        });

        it("should return false if there are more master measures", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        referencePointMocks.masterMeasureItems[1],
                        referencePointMocks.derivedMeasureItems[1],
                        referencePointMocks.masterMeasureItems[2],
                    ],
                },
            ];

            const result = bucketRules.hasOneMasterMeasureInBucket(buckets, "measures");

            expect(result).toBe(false);
        });
    });

    describe("getMasterMeasuresCount", () => {
        it("should return 0 for empty bucket items", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "bucketidentifier",
                    items: [],
                },
            ];

            const result = bucketRules.getMasterMeasuresCount(buckets, "bucketidentifier");

            expect(result).toBe(0);
        });

        it("should return 1 for only master measures", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "bucketidentifier",
                    items: [referencePointMocks.masterMeasureItems[0]],
                },
            ];

            const result = bucketRules.getMasterMeasuresCount(buckets, "bucketidentifier");

            expect(result).toBe(1);
        });

        it("should return 1 if there is derived measure present", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "bucketidentifier",
                    items: [
                        referencePointMocks.masterMeasureItems[0],
                        referencePointMocks.derivedMeasureItems[0],
                    ],
                },
            ];

            const result = bucketRules.getMasterMeasuresCount(buckets, "bucketidentifier");

            expect(result).toBe(1);
        });

        it("should count just master measures in given bucket", () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "bucketidentifier",
                    items: [
                        referencePointMocks.masterMeasureItems[0],
                        referencePointMocks.derivedMeasureItems[0],
                        referencePointMocks.masterMeasureItems[1],
                        referencePointMocks.derivedMeasureItems[2],
                        referencePointMocks.masterMeasureItems[2],
                    ],
                },
                {
                    localIdentifier: "bucketak",
                    items: [
                        referencePointMocks.masterMeasureItems[3],
                        referencePointMocks.derivedMeasureItems[3],
                    ],
                },
            ];

            const result = bucketRules.getMasterMeasuresCount(buckets, "bucketidentifier");

            expect(result).toBe(3);
        });
    });

    describe("hasUsedDate", () => {
        const bucketsEmpty: IBucket[] = [];
        const emptyFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        it("should return false when date filter is empty and no date in category", () => {
            expect(bucketRules.hasUsedDate(bucketsEmpty, emptyFilters)).toBeFalsy();
        });

        it("should return true when date filter is set to all time and no date in category", () => {
            expect(
                bucketRules.hasUsedDate(bucketsEmpty, referencePointMocks.dateFilterBucketAllTime),
            ).toBeTruthy();
        });

        it("should return true when date filter is set to last year and no date in category", () => {
            expect(
                bucketRules.hasUsedDate(bucketsEmpty, referencePointMocks.samePeriodPrevYearFiltersBucket),
            ).toBeTruthy();
        });

        it("should return true when date filter is empty and date used in category", () => {
            expect(
                bucketRules.hasUsedDate(
                    referencePointMocks.metricWithViewByDateAndDateFilterReferencePoint.buckets,
                    emptyFilters,
                ),
            ).toBeTruthy();
        });

        it("should return true when date filter is set and date used in category", () => {
            expect(
                bucketRules.hasUsedDate(
                    referencePointMocks.metricWithViewByDateAndDateFilterReferencePoint.buckets,
                    referencePointMocks.samePeriodPrevYearFiltersBucket,
                ),
            ).toBeTruthy();
        });
    });

    describe("hasGlobalDateFilter", () => {
        const emptyFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        it("should return false when the filter bucket is empty", () => {
            expect(bucketRules.hasGlobalDateFilter(emptyFilters)).toBeFalsy();
        });

        it("should return true when date filter is in the filter bucket and is set to all-time", () => {
            expect(bucketRules.hasGlobalDateFilter(referencePointMocks.dateFilterBucketAllTime)).toBeTruthy();
        });

        it("should return true when date filter is in the filter bucket and is set to last year", () => {
            expect(
                bucketRules.hasGlobalDateFilter(referencePointMocks.samePeriodPrevYearFiltersBucket),
            ).toBeTruthy();
        });

        it("should return false when only attribute filter is in the filter bucket", () => {
            expect(
                bucketRules.hasGlobalDateFilter(referencePointMocks.attributeFilterBucketItem),
            ).toBeFalsy();
        });
    });

    describe("hasGlobalDateFilterIgnoreAllTime", () => {
        const emptyFilters: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        it("should return false when the filter bucket is empty", () => {
            expect(bucketRules.hasGlobalDateFilterIgnoreAllTime(emptyFilters)).toBeFalsy();
        });

        it("should return true when date filter is in the filter bucket and is set to all-time", () => {
            expect(
                bucketRules.hasGlobalDateFilterIgnoreAllTime(referencePointMocks.dateFilterBucketAllTime),
            ).toBeFalsy();
        });

        it("should return true when date filter is in the filter bucket and is set to last year", () => {
            expect(
                bucketRules.hasGlobalDateFilterIgnoreAllTime(
                    referencePointMocks.samePeriodPrevYearFiltersBucket,
                ),
            ).toBeTruthy();
        });

        it("should return false when only attribute filter is in the filter bucket", () => {
            expect(
                bucketRules.hasGlobalDateFilterIgnoreAllTime(referencePointMocks.attributeFilterBucketItem),
            ).toBeFalsy();
        });
    });
});
