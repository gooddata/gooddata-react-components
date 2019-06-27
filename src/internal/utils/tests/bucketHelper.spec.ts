// (C) 2019 GoodData Corporation
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";

import { ATTRIBUTE, DATE_DATASET_ATTRIBUTE, METRIC } from "../../constants/bucket";
import {
    applyUiConfig,
    getBucketItemsWithExcludeByType,
    getFirstMasterWithDerived,
    filterOutDerivedMeasures,
    findDerivedBucketItems,
    findMasterBucketItem,
    findMasterBucketItems,
    generateBucketTitleId,
    getAllAttributeItemsWithPreference,
    getComparisonTypeFromFilters,
    getDateFilter,
    getFilteredMeasuresForStackedCharts,
    keepOnlyMasterAndDerivedMeasuresOfType,
    removeAllDerivedMeasures,
    sanitizeUnusedFilters,
    removeUnusedFilters,
    setBucketTitles,
    getAttributeItems,
    noRowsAndHasOneMeasure,
    noColumnsAndHasOneMeasure,
    findDerivedBucketItem,
    hasDerivedBucketItems,
    removeDuplicateBucketItems,
    getFirstValidMeasure,
    getItemsFromBuckets,
    limitNumberOfMeasuresInBuckets,
    getDerivedTypesFromArithmeticMeasure,
    filterOutIncompatibleArithmeticMeasures,
    removeAllArithmeticMeasuresFromDerived,
    filterOutArithmeticMeasuresFromDerived,
    getAllMeasuresShowOnSecondaryAxis,
} from "../bucketHelper";
import {
    IBucketItem,
    IFiltersBucketItem,
    IUiConfig,
    IExtendedReferencePoint,
    IFilters,
    IBucket,
} from "../../interfaces/Visualization";
import { DEFAULT_BASE_CHART_UICONFIG } from "../../constants/uiConfig";
import * as referencePointMocks from "../../mocks/referencePointMocks";
import { createInternalIntl } from "../internalIntlProvider";

import { VisualizationObject } from "@gooddata/typings";
import { visualizationObjectMock } from "../../mocks/visualizationObjectMocks";
import { OverTimeComparisonTypes } from "../../../interfaces/OverTimeComparison";
import * as BucketNames from "../../../constants/bucketNames";
import { VisualizationTypes } from "../../../constants/visualizationTypes";
import { DEFAULT_LOCALE } from "../../../constants/localization";

const simpleMeasure1 = { localIdentifier: "m1" };
const simpleMeasure2 = { localIdentifier: "m2" };

const derivedMeasureSP = {
    localIdentifier: "m1_pop",
    masterLocalIdentifier: "m1",
    overTimeComparisonType: OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
};

const derivedMeasureSP2 = {
    localIdentifier: "m1_pop_2",
    masterLocalIdentifier: "m1",
    overTimeComparisonType: OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
};

const derivedMeasurePP = {
    localIdentifier: "m2_pop",
    masterLocalIdentifier: "m2",
    overTimeComparisonType: OverTimeComparisonTypes.PREVIOUS_PERIOD,
};

const arithmeticMeasure = {
    localIdentifier: "am0",
    operandLocalIdentifiers: ["m1", "m2"],
    operator: "sum",
};

const arithmeticMeasureFromDerivedMeasureSP = {
    localIdentifier: "am1",
    operandLocalIdentifiers: ["m1", "m1_pop"],
    operator: "sum",
};

const arithmeticMeasureFromDerivedMeasurePP = {
    localIdentifier: "am2",
    operandLocalIdentifiers: ["m1", "m2_pop"],
    operator: "sum",
};

const arithmeticMeasureFromDerivedMeasuresOfBothTypes = {
    localIdentifier: "am3",
    operandLocalIdentifiers: ["m2_pop", "m1_pop"],
    operator: "sum",
};

const invalidArithmeticMeasure = {
    localIdentifier: "am4",
    operandLocalIdentifiers: ["m1", "non-existing-measure"],
    operator: "sum",
};

const cyclicArithmeticMeasure = {
    localIdentifier: "am5",
    operandLocalIdentifiers: ["m1", "am5"],
    operator: "sum",
};

const incompleteArithmeticMeasure = {
    localIdentifier: "am6",
    operandLocalIdentifiers: ["m1", null],
    operator: "sum",
};

describe("sanitizeUnusedFilters", () => {
    it("should remove filters having unused attribute in bucket within extended reference point", () => {
        const referencePoint = referencePointMocks.twoAttributesWithFiltersReferencePoint;
        const extendedReferencePoint: IExtendedReferencePoint = {
            buckets: referencePointMocks.oneAttributeTwoFiltersReferencePoint.buckets,
            filters: referencePointMocks.oneAttributeTwoFiltersReferencePoint.filters,
            uiConfig: DEFAULT_BASE_CHART_UICONFIG,
        };

        const newExtendedReferencePoint = sanitizeUnusedFilters(extendedReferencePoint, referencePoint);

        expect(newExtendedReferencePoint.filters.items).toHaveLength(1);
    });
});

describe("removeUnusedFilters", () => {
    function getFilters(): IFiltersBucketItem[] {
        return [
            {
                localIdentifier: "f1",
                attribute: "attr.activity.activitytype",
                type: "attribute",
                filters: null,
                aggregation: null,
                showInPercent: false,
                granularity: null,
                sort: {
                    direction: "asc",
                },
                autoCreated: true,
            },
            {
                localIdentifier: "f2",
                attribute: "attr.owner.department",
                type: "attribute",
                filters: null,
                aggregation: null,
                showInPercent: false,
                granularity: null,
                sort: {
                    direction: "asc",
                },
                autoCreated: true,
            },
        ];
    }

    it("should not change filters when unused attributes are empty", () => {
        const filters = getFilters();
        expect(removeUnusedFilters(filters, [])).toEqual(filters);
    });

    it("should remove filter created with unused attribute", () => {
        const filters = getFilters();
        const unusedBucket: IBucketItem = {
            localIdentifier: "v1",
            attribute: "attr.owner.department",
            type: "attribute",
        };

        expect(removeUnusedFilters(filters, [unusedBucket])).toEqual([filters[0]]);
    });

    it("should ignore filters manually created/modified", () => {
        const filters = getFilters();
        filters[0].autoCreated = false;
        filters[1].autoCreated = false;

        const unusedBucket: IBucketItem = {
            localIdentifier: "v1",
            type: "attribute",
            attribute: "attr.owner.department",
        };
        expect(removeUnusedFilters(filters, [unusedBucket])).toEqual(filters);
    });
});

describe("Bucket title", () => {
    it("should generate title by keyName and visualizationType", () => {
        expect(generateBucketTitleId("metrics", "table")).toEqual("dashboard.bucket.metrics_title.table");
    });

    it("should set translated bucket titles for all buckets except filters when intl provided", () => {
        const visualizationType = VisualizationTypes.BAR;
        const intl = createInternalIntl(DEFAULT_LOCALE);
        const expectedUiconfig: IUiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);

        set(expectedUiconfig, ["buckets", "measures", "title"], "Measures");
        set(expectedUiconfig, ["buckets", "view", "title"], "View by");
        set(expectedUiconfig, ["buckets", "stack", "title"], "Stack by");

        const referencePoint: IExtendedReferencePoint = {
            buckets: referencePointMocks.emptyReferencePoint.buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig: DEFAULT_BASE_CHART_UICONFIG,
        };

        expect(setBucketTitles(referencePoint, visualizationType, intl)).toEqual(expectedUiconfig);
    });

    it("should set untranslated bucket titles for all buckets except filters when intl not provided", () => {
        const visualizationType = VisualizationTypes.BAR;
        const expectedUiconfig: IUiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);

        set(expectedUiconfig, ["buckets", "measures", "title"], generateBucketTitleId("measures", "bar"));
        set(expectedUiconfig, ["buckets", "view", "title"], generateBucketTitleId("view", "bar"));
        set(expectedUiconfig, ["buckets", "stack", "title"], generateBucketTitleId("stack", "bar"));

        const referencePoint: IExtendedReferencePoint = {
            buckets: referencePointMocks.emptyReferencePoint.buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig: DEFAULT_BASE_CHART_UICONFIG,
        };

        expect(setBucketTitles(referencePoint, visualizationType)).toEqual(expectedUiconfig);
    });

    it("should not create bucket titles for disabled buckets", () => {
        const visualizationType = VisualizationTypes.PIE;
        const intl = createInternalIntl(DEFAULT_LOCALE);
        const expectedUiconfig: IUiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);

        set(expectedUiconfig, ["buckets", "measures", "title"], "Measures");
        set(expectedUiconfig, ["buckets", "view", "title"], "View by");
        set(expectedUiconfig, ["buckets", "stack", "enabled"], false);

        const uiConfigWithDisabledBucket: IUiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        set(uiConfigWithDisabledBucket, ["buckets", "stack", "enabled"], false);

        const referencePoint: IExtendedReferencePoint = {
            buckets: referencePointMocks.emptyReferencePoint.buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig: uiConfigWithDisabledBucket,
        };

        expect(setBucketTitles(referencePoint, visualizationType, intl)).toEqual(expectedUiconfig);
    });
});

describe("getAllAttributeItemsWithPreference", () => {
    it("should return all attributes with prefered first", () => {
        const buckets = cloneDeep(referencePointMocks.wrongBucketsOrderReferencePoint).buckets;
        expect(getAllAttributeItemsWithPreference(buckets, ["view", "stack"])).toEqual([
            {
                localIdentifier: "a1",
                type: "attribute",
                aggregation: null,
                attribute: "attr.owner.department",
            },
            {
                localIdentifier: "a2",
                type: "attribute",
                aggregation: null,
                attribute: "attr.stage.iswon",
            },
        ]);
    });
});

describe("getAttributeItems", () => {
    it("should return all attributes ", () => {
        const buckets = cloneDeep(referencePointMocks.bucketsJustStackReferencePoint).buckets;
        expect(getAttributeItems(buckets)).toEqual([
            {
                localIdentifier: "a2",
                type: "attribute",
                aggregation: null,
                attribute: "attr.stage.iswon",
            },
        ]);
    });
});

describe("getBucketItemsWithExcludeByType", () => {
    it("should return all measures when exclude is empty", () => {
        const buckets = cloneDeep(referencePointMocks.twoMeasureBucketsReferencePoint).buckets;
        expect(getBucketItemsWithExcludeByType(buckets, [], ["metric"])).toEqual([
            {
                localIdentifier: "m1",
                type: "metric",
                aggregation: null,
                attribute: "aazb6kroa3iC",
                showInPercent: null,
                showOnSecondaryAxis: null,
            },
            {
                localIdentifier: "m2",
                type: "metric",
                aggregation: null,
                attribute: "af2Ewj9Re2vK",
                showInPercent: null,
                showOnSecondaryAxis: null,
            },
            {
                localIdentifier: "m3",
                type: "metric",
                aggregation: null,
                attribute: "dt.opportunitysnapshot.snapshotdate",
                showInPercent: null,
                showOnSecondaryAxis: true,
            },
            {
                localIdentifier: "m4",
                type: "metric",
                aggregation: null,
                attribute: "acfWntEMcom0",
                showInPercent: null,
                showOnSecondaryAxis: true,
            },
        ]);
    });

    it("should return measures only from secondary measure bucket", () => {
        const buckets = cloneDeep(referencePointMocks.twoMeasureBucketsReferencePoint).buckets;
        expect(getBucketItemsWithExcludeByType(buckets, ["measures"], ["metric"])).toEqual([
            {
                localIdentifier: "m3",
                type: "metric",
                aggregation: null,
                attribute: "dt.opportunitysnapshot.snapshotdate",
                showInPercent: null,
                showOnSecondaryAxis: true,
            },
            {
                localIdentifier: "m4",
                type: "metric",
                aggregation: null,
                attribute: "acfWntEMcom0",
                showInPercent: null,
                showOnSecondaryAxis: true,
            },
        ]);
    });

    it("should return no attributes because viewBy is excluded", () => {
        const buckets = cloneDeep(referencePointMocks.twoMeasureBucketsReferencePoint).buckets;
        expect(getBucketItemsWithExcludeByType(buckets, ["view"], ["attribute"])).toEqual([]);
    });
});

describe("getDateFilter", () => {
    it("should get date filter from filter bucket", () => {
        const dateFilter = { attribute: DATE_DATASET_ATTRIBUTE };
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: "some" }],
                },
                {
                    localIdentifier: "f1",
                    filters: [dateFilter],
                },
            ],
        };

        expect(getDateFilter(filterBucket)).toBe(dateFilter);
    });

    it("should get comparison type NOTHING when date filter not present", () => {
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: "some" }],
                },
            ],
        };

        expect(getDateFilter(filterBucket)).toBe(null);
    });

    it("should get comparison type NOTHING when bucket is empty", () => {
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        expect(getDateFilter(filterBucket)).toBe(null);
    });
});

describe("getUsedComparisonType", () => {
    it("should get comparison type SP from date filter set to SP", () => {
        const overTimeComparisonType = OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR;
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: "some" }],
                },
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: DATE_DATASET_ATTRIBUTE, overTimeComparisonType }],
                },
            ],
        };

        expect(getComparisonTypeFromFilters(filterBucket)).toBe(overTimeComparisonType);
    });

    it("should get comparison type NOTHING when date filter not present", () => {
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: "some" }],
                },
            ],
        };

        expect(getComparisonTypeFromFilters(filterBucket)).toBe(OverTimeComparisonTypes.NOTHING);
    });

    it("should get comparison type NOTHING when bucket is empty", () => {
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [],
        };

        expect(getComparisonTypeFromFilters(filterBucket)).toBe(OverTimeComparisonTypes.NOTHING);
    });

    it("should get comparison type NOTHING from date filter without comparison setting", () => {
        const filterBucket: IFilters = {
            localIdentifier: "filters",
            items: [
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: "some" }],
                },
                {
                    localIdentifier: "f1",
                    filters: [{ attribute: DATE_DATASET_ATTRIBUTE }],
                },
            ],
        };

        expect(getComparisonTypeFromFilters(filterBucket)).toBe(OverTimeComparisonTypes.NOTHING);
    });
});

describe("getDerivedTypesFromArithmeticMeasure", () => {
    it("should return empty array when arithmetic measure does have any derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasure, simpleMeasure1, simpleMeasure2],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure, buckets)).toEqual([]);
    });

    it("should return array with SP when arithmetic measure has one SP derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasureFromDerivedMeasureSP, simpleMeasure1, derivedMeasureSP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasureFromDerivedMeasureSP, buckets)).toEqual([
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        ]);
    });

    // tslint:disable-next-line:max-line-length
    it("should return array with SP when arithmetic measure has one SP derived measure in its ancestors and is in different bucket", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [simpleMeasure1, derivedMeasureSP],
            },
            {
                localIdentifier: "secondary_measures",
                items: [arithmeticMeasureFromDerivedMeasureSP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasureFromDerivedMeasureSP, buckets)).toEqual([
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        ]);
    });

    it("should return array with SP when arithmetic measure has two SP derived measures in its ancestors", () => {
        const arithmeticMeasure = {
            localIdentifier: "am",
            operandLocalIdentifiers: ["m1_pop", "m1_pop"],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasure, derivedMeasureSP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure, buckets)).toEqual([
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        ]);
    });

    it("should return array with PP when arithmetic measure has one PP derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasureFromDerivedMeasurePP, simpleMeasure1, derivedMeasurePP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasureFromDerivedMeasurePP, buckets)).toEqual([
            OverTimeComparisonTypes.PREVIOUS_PERIOD,
        ]);
    });

    it("should return array with PP when arithmetic measure has two PP derived measures in its ancestors", () => {
        const arithmeticMeasure = {
            localIdentifier: "am",
            operandLocalIdentifiers: ["m2_pop", "m2_pop"],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasure, derivedMeasurePP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure, buckets)).toEqual([
            OverTimeComparisonTypes.PREVIOUS_PERIOD,
        ]);
    });

    // tslint:disable-next-line:max-line-length
    it("should return array with SP and PP when arithmetic measure has one SP and PP derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasureFromDerivedMeasuresOfBothTypes, derivedMeasureSP, derivedMeasurePP],
            },
        ];
        expect(
            getDerivedTypesFromArithmeticMeasure(arithmeticMeasureFromDerivedMeasuresOfBothTypes, buckets),
        ).toEqual([
            OverTimeComparisonTypes.PREVIOUS_PERIOD,
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        ]);
    });

    // tslint:disable-next-line:max-line-length
    it("should return array with SP and PP when arithmetic measure has multiple SP and PP derived measures in its ancestors", () => {
        const arithmeticMeasure1 = {
            localIdentifier: "am1",
            operandLocalIdentifiers: ["m1", "am2"],
            operator: "sum",
        };
        const arithmeticMeasure2 = {
            localIdentifier: "am2",
            operandLocalIdentifiers: ["m1_pop", "am3"],
            operator: "sum",
        };
        const arithmeticMeasure3 = {
            localIdentifier: "am3",
            operandLocalIdentifiers: ["am4", "m1_pop"],
            operator: "sum",
        };
        const arithmeticMeasure4 = {
            localIdentifier: "am4",
            operandLocalIdentifiers: ["m1_pop_2", "m2_pop"],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [
                    arithmeticMeasure1,
                    arithmeticMeasure2,
                    arithmeticMeasure3,
                    arithmeticMeasure4,
                    derivedMeasureSP,
                    derivedMeasurePP,
                    derivedMeasureSP2,
                ],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure1, buckets)).toEqual([
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
            OverTimeComparisonTypes.PREVIOUS_PERIOD,
        ]);
    });

    it("should return array with SP when invalid arithmetic measure has SP derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [
                    arithmeticMeasureFromDerivedMeasuresOfBothTypes, // second operand is not in allMeasures
                    derivedMeasureSP,
                ],
            },
        ];
        expect(
            getDerivedTypesFromArithmeticMeasure(arithmeticMeasureFromDerivedMeasuresOfBothTypes, buckets),
        ).toEqual([OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR]);
    });

    it("should return array with SP when incomplete arithmetic measure has SP derived measure in its ancestors", () => {
        const arithmeticMeasure = {
            localIdentifier: "am",
            operandLocalIdentifiers: ["m1_pop", null],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasure, derivedMeasureSP],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure, buckets)).toEqual([
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        ]);
    });

    // tslint:disable-next-line:max-line-length
    it("should return empty array when incomplete arithmetic measure does have any derived measure in its ancestors", () => {
        const arithmeticMeasure = {
            localIdentifier: "am",
            operandLocalIdentifiers: ["m1", null],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [arithmeticMeasure, simpleMeasure1],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure, buckets)).toEqual([]);
    });

    // tslint:disable-next-line:max-line-length
    it("should return empty array when cyclic arithmetic measure does have any derived measure in its ancestors", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [cyclicArithmeticMeasure, simpleMeasure1],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(cyclicArithmeticMeasure, buckets)).toEqual([]);
    });

    it("should return array with SP when cyclic arithmetic measure has SP derived measure in its ancestors", () => {
        const arithmeticMeasure1 = {
            localIdentifier: "am1",
            operandLocalIdentifiers: ["m1", "am2"],
            operator: "sum",
        };
        const arithmeticMeasure2 = {
            localIdentifier: "am2",
            operandLocalIdentifiers: ["m1_pop", "am3"],
            operator: "sum",
        };
        const arithmeticMeasure3 = {
            localIdentifier: "am3",
            operandLocalIdentifiers: ["m1", "am1"],
            operator: "sum",
        };
        const buckets = [
            {
                localIdentifier: "measures",
                items: [
                    arithmeticMeasure1,
                    arithmeticMeasure2,
                    arithmeticMeasure3,
                    simpleMeasure1,
                    simpleMeasure2,
                ],
            },
        ];
        expect(getDerivedTypesFromArithmeticMeasure(arithmeticMeasure1, buckets)).toEqual([]);
    });
});

describe("filterOutDerivedMeasures", () => {
    it("should filter out derived measures no matter of derived type", () => {
        const measures = [
            simpleMeasure1,
            derivedMeasureSP,
            simpleMeasure2,
            derivedMeasurePP,
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            arithmeticMeasureFromDerivedMeasurePP,
            arithmeticMeasureFromDerivedMeasuresOfBothTypes,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ];
        expect(filterOutDerivedMeasures(measures)).toEqual([
            measures[0],
            measures[2],
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            arithmeticMeasureFromDerivedMeasurePP,
            arithmeticMeasureFromDerivedMeasuresOfBothTypes,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });
});

describe("filterOutArithmeticMeasuresFromDerived", () => {
    it("should remove all AM made from derived measures from all buckets", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [
                    simpleMeasure2,
                    derivedMeasurePP,
                    invalidArithmeticMeasure,
                    incompleteArithmeticMeasure,
                    cyclicArithmeticMeasure,
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    simpleMeasure1,
                    derivedMeasureSP,
                    arithmeticMeasure,
                    arithmeticMeasureFromDerivedMeasureSP,
                    arithmeticMeasureFromDerivedMeasurePP,
                    arithmeticMeasureFromDerivedMeasuresOfBothTypes,
                ],
            },
        ];

        expect(filterOutArithmeticMeasuresFromDerived(buckets[1].items, buckets)).toEqual([
            simpleMeasure1,
            derivedMeasureSP,
            arithmeticMeasure,
        ]);
    });
});

describe("keepOnlyMasterAndDerivedMeasuresOfType", () => {
    const measures = [
        simpleMeasure1,
        derivedMeasureSP,
        simpleMeasure2,
        derivedMeasurePP,
        arithmeticMeasure,
        arithmeticMeasureFromDerivedMeasureSP,
        arithmeticMeasureFromDerivedMeasurePP,
        arithmeticMeasureFromDerivedMeasuresOfBothTypes,
        invalidArithmeticMeasure,
        incompleteArithmeticMeasure,
        cyclicArithmeticMeasure,
    ];

    it("should filter out all derived measures when filtering NOTHING", () => {
        expect(keepOnlyMasterAndDerivedMeasuresOfType(measures, OverTimeComparisonTypes.NOTHING)).toEqual([
            measures[0],
            measures[2],
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            arithmeticMeasureFromDerivedMeasurePP,
            arithmeticMeasureFromDerivedMeasuresOfBothTypes,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });

    it("should filter out all derived but not SP derived", () => {
        expect(
            keepOnlyMasterAndDerivedMeasuresOfType(
                measures,
                OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
            ),
        ).toEqual([
            measures[0],
            derivedMeasureSP,
            measures[2],
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            arithmeticMeasureFromDerivedMeasurePP,
            arithmeticMeasureFromDerivedMeasuresOfBothTypes,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });

    it("should filter out all derived but not PP derived", () => {
        expect(
            keepOnlyMasterAndDerivedMeasuresOfType(measures, OverTimeComparisonTypes.PREVIOUS_PERIOD),
        ).toEqual([
            measures[0],
            measures[2],
            derivedMeasurePP,
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            arithmeticMeasureFromDerivedMeasurePP,
            arithmeticMeasureFromDerivedMeasuresOfBothTypes,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });
});

describe("filterOutIncompatibleArithmeticMeasures", () => {
    const buckets = [
        {
            localIdentifier: "measures",
            items: [
                simpleMeasure1,
                derivedMeasureSP,
                simpleMeasure2,
                derivedMeasurePP,
                arithmeticMeasure,
                arithmeticMeasureFromDerivedMeasureSP,
                arithmeticMeasureFromDerivedMeasurePP,
                arithmeticMeasureFromDerivedMeasuresOfBothTypes,
                invalidArithmeticMeasure,
                incompleteArithmeticMeasure,
                cyclicArithmeticMeasure,
            ],
        },
    ];

    it("should filter out all AM from derived measures when filtering NOTHING", () => {
        expect(
            filterOutIncompatibleArithmeticMeasures(
                buckets[0].items,
                buckets,
                OverTimeComparisonTypes.NOTHING,
            ),
        ).toEqual([
            simpleMeasure1,
            derivedMeasureSP,
            simpleMeasure2,
            derivedMeasurePP,
            arithmeticMeasure,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });

    it("should filter out all AM from derived measures but not the one made from SP", () => {
        const result = filterOutIncompatibleArithmeticMeasures(
            buckets[0].items,
            buckets,
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        );
        expect(result).toEqual([
            simpleMeasure1,
            derivedMeasureSP,
            simpleMeasure2,
            derivedMeasurePP,
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasureSP,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });

    it("should filter out all AM from derived measures but not the one made from PP", () => {
        const result = filterOutIncompatibleArithmeticMeasures(
            buckets[0].items,
            buckets,
            OverTimeComparisonTypes.PREVIOUS_PERIOD,
        );
        expect(result).toEqual([
            simpleMeasure1,
            derivedMeasureSP,
            simpleMeasure2,
            derivedMeasurePP,
            arithmeticMeasure,
            arithmeticMeasureFromDerivedMeasurePP,
            invalidArithmeticMeasure,
            incompleteArithmeticMeasure,
            cyclicArithmeticMeasure,
        ]);
    });

    it("should filter out all AM made from derived but not the one from SP derived across all buckets", () => {
        const buckets = [
            {
                localIdentifier: "measures",
                items: [simpleMeasure1, derivedMeasureSP, derivedMeasurePP],
            },
            {
                localIdentifier: "secondary_measures",
                items: [arithmeticMeasureFromDerivedMeasureSP, arithmeticMeasureFromDerivedMeasurePP],
            },
        ];
        const result = filterOutIncompatibleArithmeticMeasures(
            buckets[1].items,
            buckets,
            OverTimeComparisonTypes.SAME_PERIOD_PREVIOUS_YEAR,
        );

        expect(result).toEqual([arithmeticMeasureFromDerivedMeasureSP]);
    });
});

describe("applyUiConfig", () => {
    it("should apply itemsLimit=0", () => {
        const buckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint).buckets;

        const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        uiConfig.buckets[BucketNames.MEASURES].itemsLimit = 0;
        uiConfig.buckets[BucketNames.VIEW].itemsLimit = 0;

        const expectedBuckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint)
            .buckets;
        expectedBuckets[0].items = [];
        expectedBuckets[1].items = [];

        const referencePoint: IExtendedReferencePoint = {
            buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig,
        };
        expect(applyUiConfig(referencePoint).buckets).toEqual(expectedBuckets);
    });

    it("should apply itemsLimit=1", () => {
        const buckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint).buckets;

        const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        uiConfig.buckets[BucketNames.MEASURES].itemsLimit = 1;
        uiConfig.buckets[BucketNames.VIEW].itemsLimit = 1;

        const expectedBuckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint)
            .buckets;
        expectedBuckets[0].items = expectedBuckets[0].items.slice(0, 1);
        expectedBuckets[1].items = expectedBuckets[1].items.slice(0, 1);

        const referencePoint: IExtendedReferencePoint = {
            buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig,
        };
        expect(applyUiConfig(referencePoint).buckets).toEqual(expectedBuckets);
    });

    it("should NOT count derived items to itemsLimit", () => {
        const buckets = cloneDeep(referencePointMocks.measureWithDerivedAsFirstRefPoint).buckets;

        const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        uiConfig.buckets[BucketNames.MEASURES].itemsLimit = 1;
        uiConfig.buckets[BucketNames.VIEW].itemsLimit = 1;

        const expectedBuckets = cloneDeep(referencePointMocks.measureWithDerivedAsFirstRefPoint).buckets;

        const referencePoint: IExtendedReferencePoint = {
            buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig,
        };
        expect(applyUiConfig(referencePoint).buckets).toEqual(expectedBuckets);
    });

    it("should handle undefined itemsLimit", () => {
        const buckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint).buckets;

        const uiConfig = cloneDeep(DEFAULT_BASE_CHART_UICONFIG);
        uiConfig.buckets[BucketNames.MEASURES].itemsLimit = undefined;
        uiConfig.buckets[BucketNames.VIEW].itemsLimit = undefined;

        const expectedBuckets = cloneDeep(referencePointMocks.multipleMetricsAndCategoriesReferencePoint)
            .buckets;

        const referencePoint: IExtendedReferencePoint = {
            buckets,
            filters: referencePointMocks.emptyReferencePoint.filters,
            uiConfig,
        };
        expect(applyUiConfig(referencePoint).buckets).toEqual(expectedBuckets);
    });
});

describe("getFirstMasterHavingDerived", () => {
    it("should find first master measure and return it together with its derived measures", () => {
        const measures = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ];

        const result = getFirstMasterWithDerived(measures);

        expect(result).toEqual([
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
        ]);
    });

    it("should keep the order of master and derived measures", () => {
        const measures = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ];

        const result = getFirstMasterWithDerived(measures);

        expect(result).toEqual([
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.derivedMeasureItems[0],
        ]);
    });

    it("should handle only masters", () => {
        const measures: IBucketItem[] = [
            referencePointMocks.masterMeasureItems[1],
            referencePointMocks.masterMeasureItems[0],
        ];

        const result = getFirstMasterWithDerived(measures);

        expect(result).toEqual([referencePointMocks.masterMeasureItems[1]]);
    });

    it("should handle empty array", () => {
        const measures: IBucketItem[] = [];

        const result = getFirstMasterWithDerived(measures);

        expect(result).toEqual([]);
    });
});

describe("removeAllDerivedMeasures", () => {
    it("removes derived measures from all buckets", () => {
        const refPoint: IExtendedReferencePoint = {
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        referencePointMocks.derivedMeasureItems[1],
                        referencePointMocks.derivedMeasureItems[0],
                        referencePointMocks.masterMeasureItems[0],
                        referencePointMocks.masterMeasureItems[1],
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [referencePointMocks.masterMeasureItems[2]],
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: [referencePointMocks.derivedMeasureItems[2]],
                },
            ],
            filters: {
                localIdentifier: "filters",
                items: [],
            },
            uiConfig: {
                buckets: {},
            },
        };

        const result = removeAllDerivedMeasures(refPoint);

        expect(result.buckets).toEqual([
            {
                localIdentifier: "measures",
                items: [referencePointMocks.masterMeasureItems[0], referencePointMocks.masterMeasureItems[1]],
            },
            {
                localIdentifier: "secondary_measures",
                items: [referencePointMocks.masterMeasureItems[2]],
            },
            {
                localIdentifier: "tertiary_measures",
                items: [],
            },
        ]);
    });
});

describe("removeAllArithmeticMeasuresFromDerived", () => {
    const arithmeticMeasureFromDerivedMeasure = {
        localIdentifier: "am10",
        operandLocalIdentifiers: ["m1", "m1_pop"],
        operator: "sum",
    };
    const deepArithmeticMeasureFromDerivedMeasureInThirdLevel = {
        localIdentifier: "am11",
        operandLocalIdentifiers: ["m1", "am10"],
        operator: "sum",
    };
    it("should remove all AM made from derived measures from all buckets", () => {
        const refPoint: IExtendedReferencePoint = {
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        simpleMeasure1,
                        derivedMeasureSP,
                        simpleMeasure2,
                        derivedMeasurePP,
                        invalidArithmeticMeasure,
                        incompleteArithmeticMeasure,
                        cyclicArithmeticMeasure,
                        arithmeticMeasureFromDerivedMeasure,
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [
                        arithmeticMeasure,
                        arithmeticMeasureFromDerivedMeasureSP,
                        arithmeticMeasureFromDerivedMeasurePP,
                    ],
                },
                {
                    localIdentifier: "tertiary_measures",
                    items: [
                        arithmeticMeasureFromDerivedMeasuresOfBothTypes,
                        deepArithmeticMeasureFromDerivedMeasureInThirdLevel,
                    ],
                },
            ],
            filters: {
                localIdentifier: "filters",
                items: [],
            },
            uiConfig: {
                buckets: {},
            },
        };

        const result = removeAllArithmeticMeasuresFromDerived(refPoint);

        expect(result.buckets).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    simpleMeasure1,
                    derivedMeasureSP,
                    simpleMeasure2,
                    derivedMeasurePP,
                    invalidArithmeticMeasure,
                    incompleteArithmeticMeasure,
                    cyclicArithmeticMeasure,
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [arithmeticMeasure],
            },
            {
                localIdentifier: "tertiary_measures",
                items: [],
            },
        ]);
    });
});

describe("findMasterBucketItem", () => {
    it("should find master measure", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ];

        const masterBucketItem = findMasterBucketItem(
            referencePointMocks.derivedMeasureItems[0],
            bucketItems,
        );
        expect(masterBucketItem).toEqual(referencePointMocks.masterMeasureItems[0]);
    });

    it("should return undefined when master measure is not found", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ];

        const masterBucketItem = findMasterBucketItem(
            referencePointMocks.derivedMeasureItems[2],
            bucketItems,
        );
        expect(masterBucketItem).toEqual(undefined);
    });
});

describe("findMasterBucketItems", () => {
    it("should find all master measures", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ];

        const masterBucketItems = findMasterBucketItems(bucketItems);
        expect(masterBucketItems).toEqual([
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
        ]);
    });

    it("should return empty array when master measures are not found", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.derivedMeasureItems[1],
            referencePointMocks.derivedMeasureItems[0],
        ];

        const masterBucketItems = findMasterBucketItems(bucketItems);
        expect(masterBucketItems).toEqual([]);
    });
});

describe("findDerivedBucketItems", () => {
    it("should find all master measures", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
            referencePointMocks.derivedMeasureItems[3],
            referencePointMocks.derivedMeasureItems[4],
            referencePointMocks.masterMeasureItems[3],
        ];

        const derivedBucketItems = findDerivedBucketItems(
            referencePointMocks.masterMeasureItems[3],
            bucketItems,
        );
        expect(derivedBucketItems).toEqual([
            referencePointMocks.derivedMeasureItems[3],
            referencePointMocks.derivedMeasureItems[4],
        ]);
    });

    it("should return empty array when derived measures are not found", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.masterMeasureItems[1],
            referencePointMocks.masterMeasureItems[3],
        ];

        const derivedBucketItems = findDerivedBucketItems(
            referencePointMocks.masterMeasureItems[3],
            bucketItems,
        );
        expect(derivedBucketItems).toEqual([]);
    });
});

describe("findDerivedBucketItem", () => {
    it("should return undefined when there is no derived bucket item for the master measure", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.derivedMeasureItems[1],
        ];

        const derivedBucketItems = findDerivedBucketItem(
            referencePointMocks.masterMeasureItems[0],
            bucketItems,
        );
        expect(derivedBucketItems).toBeUndefined();
    });

    it("should return derived bucket item for the master measure when it exists", () => {
        const bucketItems: IBucketItem[] = [
            referencePointMocks.masterMeasureItems[0],
            referencePointMocks.derivedMeasureItems[0],
        ];

        const derivedBucketItems = findDerivedBucketItem(
            referencePointMocks.masterMeasureItems[0],
            bucketItems,
        );
        expect(derivedBucketItems).toEqual(referencePointMocks.derivedMeasureItems[0]);
    });
});

describe("hasDerivedBucketItems", () => {
    it("should return false when there is no derived bucket item for the master measure across buckets", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: BucketNames.MEASURES,
                items: [referencePointMocks.masterMeasureItems[0]],
            },
            {
                localIdentifier: BucketNames.SECONDARY_MEASURES,
                items: [referencePointMocks.masterMeasureItems[1]],
            },
        ];

        const hasSomeDerivedBucketItems = hasDerivedBucketItems(
            referencePointMocks.masterMeasureItems[0],
            buckets,
        );
        expect(hasSomeDerivedBucketItems).toEqual(false);
    });

    it("should return true when there is a derived bucket item for the master measure in the same bucket", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: BucketNames.MEASURES,
                items: [
                    referencePointMocks.masterMeasureItems[0],
                    referencePointMocks.derivedMeasureItems[0],
                ],
            },
            {
                localIdentifier: BucketNames.SECONDARY_MEASURES,
                items: [referencePointMocks.masterMeasureItems[1]],
            },
        ];

        const hasSomeDerivedBucketItems = hasDerivedBucketItems(
            referencePointMocks.masterMeasureItems[0],
            buckets,
        );
        expect(hasSomeDerivedBucketItems).toEqual(true);
    });

    it("should return true when there is a derived bucket item for the master measure in another bucket", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: BucketNames.MEASURES,
                items: [referencePointMocks.masterMeasureItems[0]],
            },
            {
                localIdentifier: BucketNames.SECONDARY_MEASURES,
                items: [
                    referencePointMocks.masterMeasureItems[1],
                    referencePointMocks.derivedMeasureItems[0],
                ],
            },
        ];

        const hasSomeDerivedBucketItems = hasDerivedBucketItems(
            referencePointMocks.masterMeasureItems[0],
            buckets,
        );
        expect(hasSomeDerivedBucketItems).toEqual(true);
    });
});

describe("getFilteredMeasuresForStackedCharts", () => {
    it("should keep all measures when not stacking", () => {
        const buckets = referencePointMocks.measureWithDerivedAsFirstRefPoint.buckets;
        const result = getFilteredMeasuresForStackedCharts(buckets);

        expect(result).toEqual([
            referencePointMocks.derivedMeasureItems[0],
            referencePointMocks.masterMeasureItems[0],
        ]);
    });

    it("should use first master measure when stacking", () => {
        const buckets = referencePointMocks.measureWithDerivedAsFirstWithStackRefPoint.buckets;
        const result = getFilteredMeasuresForStackedCharts(buckets);

        expect(result).toEqual([referencePointMocks.masterMeasureItems[0]]);
    });

    it("should use first measure without dependencies when AM is present", () => {
        const result = getFilteredMeasuresForStackedCharts([
            {
                localIdentifier: "measures",
                items: [
                    referencePointMocks.arithmeticMeasureItems[0],
                    referencePointMocks.masterMeasureItems[0],
                    referencePointMocks.masterMeasureItems[1],
                ],
            },
            {
                localIdentifier: "stack",
                items: referencePointMocks.attributeItems.slice(0, 1),
            },
        ]);

        expect(result).toEqual([referencePointMocks.masterMeasureItems[0]]);
    });
});

describe("noRowsAndHasOneMeasure", () => {
    it("should return true when VisualizationObject.BucketItem has one measure and any rows", () => {
        // localIdentifier of row is 'view'
        const buckets: VisualizationObject.IBucket[] = visualizationObjectMock.oneMeasureOneStack.buckets;

        const result = noRowsAndHasOneMeasure(buckets);
        expect(result).toBe(true);
    });

    it("should return false when VisualizationObject.BucketItem has one measure and some rows", () => {
        // localIdentifier of row is 'view'
        const buckets: VisualizationObject.IBucket[] = visualizationObjectMock.oneMeasureOneView.buckets;

        const result = noRowsAndHasOneMeasure(buckets);
        expect(result).toBe(false);
    });
});

describe("noColumnsAndHasOneMeasure", () => {
    it("should return true when VisualizationObject.BucketItem has one measure and any columns", () => {
        // localIdentifier of column is 'stack'
        const buckets: VisualizationObject.IBucket[] = visualizationObjectMock.oneMeasureOneView.buckets;

        const result = noColumnsAndHasOneMeasure(buckets);
        expect(result).toBe(true);
    });

    it("should return false when VisualizationObject.BucketItem has one measure and some columns", () => {
        // localIdentifier of row is 'stack'
        const buckets: VisualizationObject.IBucket[] = visualizationObjectMock.oneMeasureOneStack.buckets;

        const result = noColumnsAndHasOneMeasure(buckets);
        expect(result).toBe(false);
    });
});

describe("removeDuplicateBucketItems", () => {
    it("should return buckets with duplicate bucketItems filtered out", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [{ localIdentifier: "A" }, { localIdentifier: "B" }],
            },
            {
                localIdentifier: "moreMeasures",
                items: [{ localIdentifier: "B" }, { localIdentifier: "C" }, { localIdentifier: "D" }],
            },
            {
                localIdentifier: "attributes",
                items: [{ localIdentifier: "C" }, { localIdentifier: "B" }, { localIdentifier: "E" }],
            },
            {
                localIdentifier: "moreAttributes",
                items: [{ localIdentifier: "F" }, { localIdentifier: "G" }],
            },
        ];

        const result = removeDuplicateBucketItems(buckets);
        expect(result).toEqual([
            {
                items: [
                    {
                        localIdentifier: "A",
                    },
                    {
                        localIdentifier: "B",
                    },
                ],
                localIdentifier: "measures",
            },
            {
                items: [
                    {
                        localIdentifier: "C",
                    },
                    {
                        localIdentifier: "D",
                    },
                ],
                localIdentifier: "moreMeasures",
            },
            {
                items: [
                    {
                        localIdentifier: "E",
                    },
                ],
                localIdentifier: "attributes",
            },
            {
                items: [
                    {
                        localIdentifier: "F",
                    },
                    {
                        localIdentifier: "G",
                    },
                ],
                localIdentifier: "moreAttributes",
            },
        ]);
    });
});

describe("getFirstValidMeasure", () => {
    it("should return null when there is no valid measure", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [],
            },
            {
                localIdentifier: "attributes",
                items: [
                    {
                        localIdentifier: "attr1",
                        type: ATTRIBUTE,
                    },
                ],
            },
        ];

        const firstValidMeasure = getFirstValidMeasure(buckets);

        expect(firstValidMeasure).toBeNull();
    });

    it("should return first measure if available", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "attributes",
                items: [
                    {
                        localIdentifier: "attr1",
                        type: ATTRIBUTE,
                    },
                ],
            },
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "simple_measure",
                        type: METRIC,
                        operator: null,
                        operandLocalIdentifiers: null,
                    },
                ],
            },
        ];

        const firstValidMeasure = getFirstValidMeasure(buckets);

        expect(firstValidMeasure.localIdentifier).toBe("simple_measure");
    });

    it("should skip invalid arithmetic measures", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "attributes",
                items: [
                    {
                        localIdentifier: "attr1",
                        type: ATTRIBUTE,
                    },
                ],
            },
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "empty_arithmetic_measure",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: [null, null],
                    },
                    {
                        localIdentifier: "inclomplete_arithmetic_measure",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: [null, "m1"],
                    },
                    {
                        localIdentifier: "complete_arithmetic_measure",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["m2", "m1"],
                    },
                ],
            },
        ];

        const firstValidMeasure = getFirstValidMeasure(buckets);

        expect(firstValidMeasure.localIdentifier).toBe("complete_arithmetic_measure");
    });
});

describe("getItemsFromBuckets", () => {
    it("should return buckets items from buckets matching identifiers", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [{ localIdentifier: "A" }, { localIdentifier: "B" }],
            },
            {
                localIdentifier: "moreMeasures",
                items: [{ localIdentifier: "B" }, { localIdentifier: "C" }, { localIdentifier: "D" }],
            },
            {
                localIdentifier: "attributes",
                items: [{ localIdentifier: "C" }, { localIdentifier: "B" }, { localIdentifier: "E" }],
            },
            {
                localIdentifier: "moreAttributes",
                items: [{ localIdentifier: "F" }, { localIdentifier: "G" }],
            },
        ];

        const result = getItemsFromBuckets(buckets, ["measures", "moreAttributes"]);
        expect(result).toEqual([
            { localIdentifier: "A" },
            { localIdentifier: "B" },
            { localIdentifier: "F" },
            { localIdentifier: "G" },
        ]);
    });
});

describe("limitNumberOfBucketItems", () => {
    it("should do simple limiting across buckets", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "A",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "B",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "C",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "D",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "E",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "attributes",
                items: [
                    {
                        localIdentifier: "F",
                        type: ATTRIBUTE,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 3);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "A",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "B",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "C",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "attributes",
                items: [
                    {
                        localIdentifier: "F",
                        type: ATTRIBUTE,
                    },
                ],
            },
        ]);
    });

    it("should always add measures together with their dependencies", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "DM6",
                        type: METRIC,
                        masterLocalIdentifier: "M6",
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM2",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M3", "M4"],
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M4",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M5",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M6",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 6);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "DM6",
                        type: METRIC,
                        masterLocalIdentifier: "M6",
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    // AM does not fit to remaining slot together with its operands
                    // but M3 alone does
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                    // there's no space for M4 and M5
                    // M6 added as dependency of DM6
                    {
                        localIdentifier: "M6",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it("should check indirect dependencies of derived measures", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "DAM1",
                        type: METRIC,
                        masterLocalIdentifier: "AM1",
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 3);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it("should check indirect dependencies of arithmetic measures", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "DM2"],
                    },
                    {
                        localIdentifier: "DM2",
                        type: METRIC,
                        masterLocalIdentifier: "M2",
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 3);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "DM2",
                        type: METRIC,
                        masterLocalIdentifier: "M2",
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it("should place incomplete AM counting only set operand dependencies", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M2", null],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 3);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M2", null],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it("should place incomplete AM counting only operand dependencies still in the buckets", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M2", "measure-removed-from-buckets"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 4);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M2", "measure-removed-from-buckets"],
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it("should try to place derived measure when the parameter preferMasterDerivedPairs is set to true", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "DM1",
                        masterLocalIdentifier: "M1",
                        type: METRIC,
                    },
                ],
            },
        ];

        const preferMasterDerivedPairs = true;
        const result = limitNumberOfMeasuresInBuckets(buckets, 2, preferMasterDerivedPairs);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "moreMeasures",
                items: [
                    {
                        localIdentifier: "DM1",
                        masterLocalIdentifier: "M1",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it(
        "should place just the master when preferMasterDerivedPairs is set to true " +
            "but there is no place for derived",
        () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "moreMeasures",
                    items: [
                        {
                            localIdentifier: "DM2",
                            masterLocalIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
            ];

            const preferMasterDerivedPairs = true;
            const result = limitNumberOfMeasuresInBuckets(buckets, 2, preferMasterDerivedPairs);

            expect(result).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "moreMeasures",
                    items: [],
                },
            ]);
        },
    );

    it(
        "should place just the master when preferMasterDerivedPairs is set to true " +
            "but there is no place for derived",
        () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "moreMeasures",
                    items: [
                        {
                            localIdentifier: "DM2",
                            masterLocalIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
            ];

            const preferMasterDerivedPairs = true;
            const result = limitNumberOfMeasuresInBuckets(buckets, 2, preferMasterDerivedPairs);

            expect(result).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "moreMeasures",
                    items: [],
                },
            ]);
        },
    );

    it(
        "should place AM with it's operands which are both the same when there is a place " +
            "for only two measures",
        () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "AM1",
                            type: METRIC,
                            operator: "sum",
                            operandLocalIdentifiers: ["M1", "M1"],
                        },
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
            ];

            const result = limitNumberOfMeasuresInBuckets(buckets, 2);

            expect(result).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "AM1",
                            type: METRIC,
                            operator: "sum",
                            operandLocalIdentifiers: ["M1", "M1"],
                        },
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                    ],
                },
            ]);
        },
    );

    it("should fit AMs correctly when more of them use the same measure as an argument", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                    {
                        localIdentifier: "AM2",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M3"],
                    },
                    {
                        localIdentifier: "AM3",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["AM1", "AM2"],
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 6);

        expect(result).toEqual(buckets);
    });

    it("should try to take measures one per bucket when possible - simple case", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M4",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 2);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        localIdentifier: "M3",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });

    it(
        "should try to take measures one per bucket when possible " +
            "- case with arithmetic measures across buckets",
        () => {
            const buckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "AM1",
                            type: METRIC,
                            operator: "sum",
                            operandLocalIdentifiers: ["M1", "M2"],
                        },
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                        {
                            localIdentifier: "M2",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [
                        {
                            localIdentifier: "AM2",
                            type: METRIC,
                            operator: "sum",
                            operandLocalIdentifiers: ["M1", "M1"],
                        },
                        {
                            localIdentifier: "M3",
                            type: METRIC,
                        },
                    ],
                },
            ];

            const result = limitNumberOfMeasuresInBuckets(buckets, 2);

            expect(result).toEqual([
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            localIdentifier: "M1",
                            type: METRIC,
                        },
                    ],
                },
                {
                    localIdentifier: "secondary_measures",
                    items: [
                        {
                            localIdentifier: "AM2",
                            type: METRIC,
                            operator: "sum",
                            operandLocalIdentifiers: ["M1", "M1"],
                        },
                    ],
                },
            ]);
        },
    );

    it("should fallback to global limiting when it's not possible to place one measure per bucket", () => {
        const buckets: IBucket[] = [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "AM1",
                        type: METRIC,
                        operator: "sum",
                        operandLocalIdentifiers: ["M1", "M2"],
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
        ];

        const result = limitNumberOfMeasuresInBuckets(buckets, 2);

        expect(result).toEqual([
            {
                localIdentifier: "measures",
                items: [],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        localIdentifier: "M1",
                        type: METRIC,
                    },
                    {
                        localIdentifier: "M2",
                        type: METRIC,
                    },
                ],
            },
        ]);
    });
});

describe("getAllMeasuresShowOnSecondaryAxis", () => {
    it("should return all measures which are showing on secondary axis", () => {
        const { buckets } = referencePointMocks.multipleMetricsAndCategoriesReferencePoint;
        expect(getAllMeasuresShowOnSecondaryAxis(buckets)).toEqual(
            referencePointMocks.masterMeasureItems.slice(2),
        );
    });
});
