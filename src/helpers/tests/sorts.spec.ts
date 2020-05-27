// (C) 2007-2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
import {
    getAttributeSortItem,
    getDefaultTreemapSort,
    getFirstAttributeIdentifier,
    getDefaultAttributeGeoPushpinSort,
    getDefaultHeatmapSort,
} from "../sorts";

import { DESC } from "../../constants/sort";

describe("sorts", () => {
    const measure1 = {
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
    const attribute1 = {
        localIdentifier: "a1",
        displayForm: {
            identifier: "ident_a1",
        },
    };
    const attribute2 = {
        localIdentifier: "a2",
        displayForm: {
            identifier: "ident_a2",
        },
    };

    const nonStackedAfm: AFM.IAfm = {
        measures: [measure1],
        attributes: [attribute1],
    };

    const nonStackedResultSpec: AFM.IResultSpec = {
        dimensions: [
            {
                itemIdentifiers: ["a1"],
            },
            {
                itemIdentifiers: [],
            },
        ],
    };

    const stackedAfm: AFM.IAfm = {
        measures: [measure1],
        attributes: [attribute1, attribute2],
    };

    describe("getDefaultTreemapSort", () => {
        const stackedResultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a1", "a2"],
                },
                {
                    itemIdentifiers: [],
                },
            ],
        };

        it("should get empty sort for only a single attribute", () => {
            const sort = getDefaultTreemapSort(nonStackedAfm, nonStackedResultSpec);
            expect(sort).toEqual([]);
        });

        it("should get attribute and measure sort if view by and stack by", () => {
            const sort = getDefaultTreemapSort(stackedAfm, stackedResultSpec);
            expect(sort).toEqual([
                {
                    attributeSortItem: {
                        direction: "asc",
                        attributeIdentifier: "a1",
                    },
                },
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
            ]);
        });
    });

    describe("getAttributeSortItem", () => {
        it("should return an attribute sort item", () => {
            expect(getAttributeSortItem("a1", DESC, true)).toEqual({
                attributeSortItem: { aggregation: "sum", attributeIdentifier: "a1", direction: "desc" },
            });
            expect(getAttributeSortItem("a2")).toEqual({
                attributeSortItem: { attributeIdentifier: "a2", direction: "asc" },
            });
        });
    });

    describe("getFirstAttributeIdentifier", () => {
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

        it("should return an attribute sort item", () => {
            expect(getFirstAttributeIdentifier(stackedResultSpec, 0)).toEqual("a2");
            expect(getFirstAttributeIdentifier(stackedResultSpec, 1)).toEqual("a1");
            expect(getFirstAttributeIdentifier(stackedResultSpec, 2)).toEqual(null);
        });
    });

    describe("getDefaultAttributeGeoPushpinSort", () => {
        it("should sort by segmentBy attribute if count of attributes greater than 1", () => {
            expect(getDefaultAttributeGeoPushpinSort(stackedAfm)).toEqual([
                {
                    attributeSortItem: {
                        attributeIdentifier: "a2",
                        direction: "asc",
                    },
                },
            ]);
        });

        it("should not sort if segmentBy attribute is not existing", () => {
            expect(getDefaultAttributeGeoPushpinSort(nonStackedAfm)).toEqual([]);
        });
    });

    describe("getDefaultHeatmapSort", () => {
        const noSortResultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: [],
                },
                {
                    itemIdentifiers: ["a1"],
                },
            ],
        };

        const measureGroupResultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["a1"],
                },
            ],
        };

        const rowsResultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["a2"],
                },
            ],
        };

        const customSortsResultSpec: AFM.IResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["a2"],
                },
            ],
            sorts: [
                {
                    attributeSortItem: {
                        attributeIdentifier: "a1",
                        direction: "asc",
                    },
                },
            ],
        };

        it("should return empty array when resultSpec's first dimension's itemIdentifier is missing", () => {
            expect(getDefaultHeatmapSort(noSortResultSpec)).toEqual([]);
        });

        it("should return empty array when resultSpec's first dimension's itemIdentifier is measureGroup", () => {
            expect(getDefaultHeatmapSort(measureGroupResultSpec)).toEqual([]);
        });

        it("should return default descending sorts array definition with first dimension's itemIdentifier", () => {
            expect(getDefaultHeatmapSort(rowsResultSpec)).toEqual([
                {
                    attributeSortItem: {
                        attributeIdentifier: "a1",
                        direction: "desc",
                    },
                },
            ]);
        });

        it("should return custom sorts array definition instead of the default one", () => {
            expect(getDefaultHeatmapSort(customSortsResultSpec)).toEqual([
                {
                    attributeSortItem: {
                        attributeIdentifier: "a1",
                        direction: "asc",
                    },
                },
            ]);
        });
    });
});
