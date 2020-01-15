// (C) 2019-2020 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");

import { AFM } from "@gooddata/typings";
import {
    createSorts,
    removeInvalidSort,
    getBucketItemIdentifiers,
    getSortIdentifiers,
    setSortItems,
} from "../sort";
import { IVisualizationProperties, IExtendedReferencePoint } from "../../interfaces/Visualization";
import * as referencePointMocks from "../../mocks/referencePointMocks";
import { DEFAULT_BASE_CHART_UICONFIG } from "../../constants/uiConfig";
import { SORT_DIR_ASC, SORT_DIR_DESC } from "../../constants/sort";
import { FILTERS, METRIC, ATTRIBUTE } from "../../constants/bucket";

const emptyVisualizationProperties: IVisualizationProperties = {};
const emptyResultSpec: AFM.IResultSpec = {};
const emptyAfm: AFM.IAfm = {};

const A1 = {
    localIdentifier: "a1",
    displayForm: {
        identifier: "ident_a1",
    },
};
const A2 = {
    localIdentifier: "a2",
    displayForm: {
        identifier: "ident_a2",
    },
};
const A3 = {
    localIdentifier: "a3",
    displayForm: {
        identifier: "ident_a3",
    },
};

const M1 = {
    alias: "Measure m1",
    definition: {
        measure: {
            item: {
                identifier: "ident_m1",
            },
        },
    },
    localIdentifier: "m1",
};
const M2 = {
    alias: "Measure m2",
    definition: {
        measure: {
            item: {
                identifier: "ident_m2",
            },
        },
    },
    localIdentifier: "m2",
};

const SORTED_BY_A1_AGGREGATION: AFM.SortItem = {
    attributeSortItem: {
        aggregation: "sum",
        attributeIdentifier: "a1",
        direction: "desc",
    },
};

const SORTED_BY_A2_AGGREGATION: AFM.SortItem = {
    attributeSortItem: {
        aggregation: "sum",
        attributeIdentifier: "a2",
        direction: "desc",
    },
};

const SORTED_BY_M1: AFM.SortItem = {
    measureSortItem: {
        direction: "desc",
        locators: [
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

const stackedAfm: AFM.IAfm = {
    measures: [M1],
    attributes: [A1, A2],
};

const stackedResultSpec: AFM.IResultSpec = {
    dimensions: [
        {
            itemIdentifiers: ["measureGroup", "a2"],
        },
        {
            itemIdentifiers: ["a1"],
        },
    ],
};

const attributeSort: AFM.IAttributeSortItem = {
    attributeSortItem: {
        attributeIdentifier: "a1",
        direction: "asc",
    },
};

const measureSort: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: "asc",
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "a1",
                    element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "m1",
                },
            },
        ],
    },
};

const referencePoint: IExtendedReferencePoint = {
    ...referencePointMocks.multipleMetricBucketsAndCategoryReferencePoint,
    uiConfig: DEFAULT_BASE_CHART_UICONFIG,
    properties: {
        sortItems: [attributeSort, measureSort],
    },
};
// make sure nothing modifies the root object so we can share it between tests
Object.freeze(referencePoint);

describe("createSorts", () => {
    describe("default sorting", () => {
        describe("table", () => {
            it("should sort by first attribute ASC", () => {
                const afm: AFM.IAfm = {
                    attributes: [A1, A2],
                };
                const expectedSorts: AFM.SortItem[] = [
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a1",
                            direction: "asc",
                        },
                    },
                ];
                expect(createSorts("table", afm, emptyResultSpec, emptyVisualizationProperties)).toEqual(
                    expectedSorts,
                );
            });

            it("should sort by first attribute ASC if there are some measures", () => {
                const expectedSorts: AFM.SortItem[] = [
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a1",
                            direction: "asc",
                        },
                    },
                ];
                expect(
                    createSorts("table", stackedAfm, emptyResultSpec, emptyVisualizationProperties),
                ).toEqual(expectedSorts);
            });

            it("should sort by first measure DESC if there are no attributes", () => {
                const afm: AFM.IAfm = {
                    measures: [M1],
                };
                const expectedSort: AFM.SortItem[] = [
                    {
                        measureSortItem: {
                            direction: "desc",
                            locators: [
                                {
                                    measureLocatorItem: {
                                        measureIdentifier: "m1",
                                    },
                                },
                            ],
                        },
                    },
                ];
                expect(createSorts("table", afm, emptyResultSpec, emptyVisualizationProperties)).toEqual(
                    expectedSort,
                );
            });
        });

        describe("bar", () => {
            it("should sort by first measure for basic bar chart", () => {
                const afm: AFM.IAfm = {
                    measures: [M1],
                    attributes: [A1],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_M1];
                expect(
                    createSorts("bar", afm, emptyResultSpec, emptyVisualizationProperties, false, true),
                ).toEqual(expectedSort);
            });

            it("should sort by group for bar chart with 1 measure and 2 viewBy", () => {
                const afm: AFM.IAfm = {
                    measures: [M1],
                    attributes: [A1, A2],
                };
                const resultSpec: AFM.IResultSpec = {
                    dimensions: [
                        { itemIdentifiers: ["measureGroup"] },
                        {
                            itemIdentifiers: ["a1", "a2"],
                        },
                    ],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_A1_AGGREGATION, SORTED_BY_A2_AGGREGATION];
                expect(
                    createSorts("bar", afm, resultSpec, emptyVisualizationProperties, false, true),
                ).toEqual(expectedSort);
            });

            it("should sort by group for bar chart with 1 measure, 2 viewBy and 1 stackBy", () => {
                const afm: AFM.IAfm = {
                    measures: [M1],
                    attributes: [A1, A2, A3],
                };
                const resultSpec: AFM.IResultSpec = {
                    dimensions: [
                        { itemIdentifiers: ["a3"] },
                        {
                            itemIdentifiers: ["a1", "a2", "measureGroup"],
                        },
                    ],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_A1_AGGREGATION, SORTED_BY_A2_AGGREGATION];
                expect(
                    createSorts("bar", afm, resultSpec, emptyVisualizationProperties, false, true),
                ).toEqual(expectedSort);
            });

            it("should sort by group and first measure for bar chart with 2 measures and 2 viewBy", () => {
                const afm: AFM.IAfm = {
                    measures: [M1, M2],
                    attributes: [A1, A2],
                };
                const resultSpec: AFM.IResultSpec = {
                    dimensions: [
                        { itemIdentifiers: ["measureGroup"] },
                        {
                            itemIdentifiers: ["a1", "a2"],
                        },
                    ],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_A1_AGGREGATION, SORTED_BY_M1];
                expect(
                    createSorts("bar", afm, resultSpec, emptyVisualizationProperties, false, true),
                ).toEqual(expectedSort);
            });

            it("should sort by group for bar chart with 2 measures, 2 viewBy and canSortStackTotalValue is true", () => {
                const afm: AFM.IAfm = {
                    measures: [M1, M2],
                    attributes: [A1, A2, A3],
                };
                const resultSpec: AFM.IResultSpec = {
                    dimensions: [
                        { itemIdentifiers: ["a3"] },
                        {
                            itemIdentifiers: ["a1", "a2", "measureGroup"],
                        },
                    ],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_A1_AGGREGATION, SORTED_BY_A2_AGGREGATION];
                expect(createSorts("bar", afm, resultSpec, emptyVisualizationProperties, true, true)).toEqual(
                    expectedSort,
                );
            });

            it("should not sort by total group", () => {
                const afm: AFM.IAfm = {
                    measures: [M1],
                    attributes: [A1, A2],
                };
                const resultSpec: AFM.IResultSpec = {
                    dimensions: [
                        { itemIdentifiers: ["measureGroup"] },
                        {
                            itemIdentifiers: ["a1", "a2"],
                        },
                    ],
                };
                const expectedSort: AFM.SortItem[] = [SORTED_BY_M1];
                expect(
                    createSorts("bar", afm, resultSpec, emptyVisualizationProperties, false, false),
                ).toEqual(expectedSort);
            });

            it("should return area sort for stacked bar chart", () => {
                const expectedSort: AFM.SortItem[] = [SORTED_BY_M1];
                expect(
                    createSorts(
                        "bar",
                        stackedAfm,
                        emptyResultSpec,
                        emptyVisualizationProperties,
                        false,
                        true,
                    ),
                ).toEqual(expectedSort);
            });
        });

        describe("column", () => {
            it("should return empty array", () => {
                expect(
                    createSorts("column", stackedAfm, stackedResultSpec, emptyVisualizationProperties),
                ).toEqual([]);
            });
        });

        describe("line", () => {
            it("should return empty array", () => {
                expect(
                    createSorts("line", stackedAfm, stackedResultSpec, emptyVisualizationProperties),
                ).toEqual([]);
            });
        });

        describe("pie", () => {
            it("should return empty array", () => {
                expect(
                    createSorts("pie", stackedAfm, stackedResultSpec, emptyVisualizationProperties),
                ).toEqual([]);
            });
        });
    });

    it("should extract sort from visualization properties", () => {
        const afm: AFM.IAfm = {
            measures: [M1],
        };
        const visualizationProperties = {
            sortItems: [SORTED_BY_M1],
        };
        expect(createSorts("table", afm, emptyResultSpec, visualizationProperties)).toEqual(
            visualizationProperties.sortItems,
        );
    });

    it("should ignore sort from visualization properties if localIdentifier is missing in AFM", () => {
        const visualizationProperties = {
            sortItems: [SORTED_BY_M1],
        };
        expect(createSorts("table", emptyAfm, emptyResultSpec, visualizationProperties)).toEqual([]);
    });

    it("should sort by measure size if chart is geo Pushpin", () => {
        const afm: AFM.IAfm = {
            measures: [M1],
            attributes: [A1, A2],
        };
        const resultSpec: AFM.IResultSpec = {
            dimensions: [
                { itemIdentifiers: ["measureGroup"] },
                {
                    itemIdentifiers: ["a1", "a2"],
                },
            ],
        };
        const expectedSort: AFM.SortItem[] = [SORTED_BY_M1];
        expect(createSorts("pushpin", afm, resultSpec, emptyVisualizationProperties)).toEqual(expectedSort);
    });
});

describe("getBucketItemIdentifiers", () => {
    it("should get all identifiers", () => {
        expect(getBucketItemIdentifiers(referencePoint)).toEqual(["m1", "m2", "m3", "a1"]);
    });
});

describe("getSortIdentifiers", () => {
    it("should get all identifiers from sort items", () => {
        expect(getSortIdentifiers(attributeSort)).toEqual(["a1"]);
        expect(getSortIdentifiers(measureSort)).toEqual(["a1", "m1"]);
    });
});

describe("removeInvalidSort", () => {
    it("should remove sorts with with identifiers that are not included in buckets", () => {
        const invalidAttributeSort: AFM.IAttributeSortItem = {
            attributeSortItem: {
                attributeIdentifier: "invalid",
                direction: SORT_DIR_DESC,
            },
        };
        const invalidMeasureSort1: AFM.IMeasureSortItem = {
            measureSortItem: {
                direction: "asc",
                locators: [
                    {
                        attributeLocatorItem: {
                            attributeIdentifier: "invalid",
                            element: "/gdc/md/PROJECTID/obj/2210/elements?id=1234",
                        },
                    },
                ],
            },
        };
        const invalidMeasureSort2: AFM.IMeasureSortItem = {
            measureSortItem: {
                direction: "asc",
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: "invalid",
                        },
                    },
                ],
            },
        };
        const referencePointWithInvalidSortItems = {
            ...referencePoint,
            properties: {
                sortItems: [
                    ...referencePoint.properties.sortItems,
                    invalidAttributeSort,
                    invalidMeasureSort1,
                    invalidMeasureSort2,
                ],
            },
        };

        const sanitizedSortItems = removeInvalidSort(referencePointWithInvalidSortItems).properties.sortItems;

        expect(sanitizedSortItems).toEqual(referencePoint.properties.sortItems);
    });
});

describe("setSortItems", () => {
    const emptyReferencePoint: IExtendedReferencePoint = {
        buckets: [],
        filters: {
            localIdentifier: FILTERS,
            items: [],
        },
        uiConfig: {
            buckets: {},
        },
        properties: {
            sortItems: [],
        },
    };

    it("should return unchanged reference if there are sort properties present", () => {
        const measureSortItem: AFM.IMeasureSortItem = {
            measureSortItem: {
                direction: "asc",
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: "invalid",
                        },
                    },
                ],
            },
        };

        const referencePointWithSortItems: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
            properties: {
                sortItems: [measureSortItem],
            },
        });

        expect(setSortItems(referencePointWithSortItems)).toEqual(referencePointWithSortItems);
    });

    it("should return unchanged reference if there are no sort properties nor bucket items present", () => {
        const noSortNoItemsRefPoint: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
        });

        expect(setSortItems(noSortNoItemsRefPoint)).toEqual(noSortNoItemsRefPoint);
    });

    it("should add descending sort item based on first measure if there is a measure but no attribute", () => {
        const onlyMeasureRefPoint: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            type: METRIC,
                            localIdentifier: "m1",
                        },
                        {
                            type: METRIC,
                            localIdentifier: "m2",
                        },
                    ],
                },
            ],
        });

        expect(setSortItems(onlyMeasureRefPoint).properties).toEqual({
            sortItems: [
                {
                    measureSortItem: {
                        direction: SORT_DIR_DESC,
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });

    it("should skip invalid arithmetic measures", () => {
        const onlyMeasureRefPoint: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            type: METRIC,
                            localIdentifier: "am1",
                            operator: "sum",
                            operandLocalIdentifiers: ["m1", null],
                        },
                        {
                            type: METRIC,
                            localIdentifier: "am2",
                            operator: "sum",
                            operandLocalIdentifiers: ["m1", "m1"],
                        },
                        {
                            type: METRIC,
                            localIdentifier: "m1",
                        },
                    ],
                },
            ],
        });

        expect(setSortItems(onlyMeasureRefPoint).properties).toEqual({
            sortItems: [
                {
                    measureSortItem: {
                        direction: SORT_DIR_DESC,
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "am2",
                                },
                            },
                        ],
                    },
                },
            ],
        });
    });

    it("should add ascending sort item based on first attribute if there is an attribute but no measure", () => {
        const onlyAttributeRefPoint: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
            buckets: [
                {
                    localIdentifier: "measures",
                    items: [
                        {
                            type: ATTRIBUTE,
                            localIdentifier: "a1",
                        },
                    ],
                },
            ],
        });

        expect(setSortItems(onlyAttributeRefPoint).properties).toEqual({
            sortItems: [
                {
                    attributeSortItem: {
                        attributeIdentifier: "a1",
                        direction: SORT_DIR_ASC,
                    },
                },
            ],
        });
    });

    it("should not add any sort items if there are both measure and attribute", () => {
        const refPoint: IExtendedReferencePoint = cloneDeep({
            ...emptyReferencePoint,
            buckets: [
                {
                    localIdentifier: "misc",
                    items: [
                        {
                            type: ATTRIBUTE,
                            localIdentifier: "a1",
                        },
                        {
                            type: METRIC,
                            localIdentifier: "m1",
                        },
                    ],
                },
            ],
        });

        expect(setSortItems(refPoint)).toBe(refPoint);
    });
});
