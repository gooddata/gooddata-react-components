// (C) 2007-2018 GoodData Corporation
import { AFM } from "@gooddata/typings";
import { getDefaultTreemapSort, sortStackedSeriesData, buildIndexSortOrder, ISortingData } from "../sorts";
import { ISeriesItem, ICategory, ISeriesDataItem } from "../../interfaces/Config";

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

    describe("getDefaultTreemapSort", () => {
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

    describe("Sort stacked series data", () => {
        const getStackedSeries = (yAxis: number): ISeriesItem[] => {
            return [
                {
                    color: "rgb(20,178,226)",
                    data: [
                        {
                            legendIndex: 0,
                            y: 30,
                        },
                        {
                            legendIndex: 1,
                            y: 40,
                        },
                    ],
                    legendIndex: 0,
                    yAxis,
                },
                {
                    color: "rgb(0,193,141)",
                    data: [
                        {
                            legendIndex: 0,
                            y: 20,
                        },
                        {
                            legendIndex: 1,
                            y: 30,
                        },
                    ],
                    legendIndex: 1,
                    yAxis,
                },
            ];
        };

        const getCategories = (): ICategory[] => {
            return [{ name: "Direct Sales" }, { name: "Inside Sales" }];
        };

        const getDualStackedSeries = (): ISeriesItem[] => {
            return [
                {
                    color: "rgb(20,178,226)",
                    data: [
                        {
                            legendIndex: 0,
                            y: 20,
                        },
                        {
                            legendIndex: 1,
                            y: 20,
                        },
                    ],
                    legendIndex: 0,
                    yAxis: 0,
                },
                {
                    color: "rgb(0,193,141)",
                    data: [
                        {
                            legendIndex: 0,
                            y: 40,
                        },
                        {
                            legendIndex: 1,
                            y: 50,
                        },
                    ],
                    legendIndex: 1,
                    yAxis: 0,
                },
                {
                    color: "rgb(0,193,141)",
                    data: [
                        {
                            legendIndex: 0,
                            y: 4,
                        },
                        {
                            legendIndex: 1,
                            y: 5,
                        },
                    ],
                    legendIndex: 1,
                    yAxis: 1,
                },
            ];
        };

        const verifyDataOrder = (
            series: ISeriesItem[],
            categories: ICategory[],
            isSingleAxis: boolean,
            dataOrder: number[][],
        ) => {
            const { series: sortedSeries } = sortStackedSeriesData(series, categories, isSingleAxis);

            expect(
                sortedSeries.map((seriesItem: ISeriesItem) => {
                    return seriesItem.data.map((data: ISeriesDataItem) => data.y);
                }),
            ).toEqual(dataOrder);
        };

        it("should build index sort order by total value", () => {
            const categories = [{ name: "A" }, { name: "B" }, { name: "C" }];
            const seriesData = [
                [
                    { legendIndex: 0, y: 30 }, // 60
                    { legendIndex: 1, y: 40 }, // 90
                    { legendIndex: 1, y: 40 }, // 70
                ],
                [{ legendIndex: 0, y: 30 }, { legendIndex: 1, y: 50 }, { legendIndex: 1, y: 30 }],
            ];
            const indexSortOrder: ISortingData[] = buildIndexSortOrder(seriesData, categories);
            expect(indexSortOrder).toEqual([
                { value: 90, dataIndex: 1 },
                { value: 70, dataIndex: 2 },
                { value: 60, dataIndex: 0 },
            ]);
        });

        it("should build index sort order with null values", () => {
            const categories = [{ name: "A" }, { name: "B" }, { name: "C" }];
            const seriesData = [
                [
                    { legendIndex: 0, y: null }, // 0
                    { legendIndex: 1, y: 40 }, // 90
                    { legendIndex: 1, y: null }, // 30
                ],
                [{ legendIndex: 0, y: null }, { legendIndex: 1, y: 50 }, { legendIndex: 1, y: 30 }],
            ];
            const indexSortOrder: ISortingData[] = buildIndexSortOrder(seriesData, categories);
            expect(indexSortOrder).toEqual([
                { value: 90, dataIndex: 1 },
                { value: 30, dataIndex: 2 },
                { value: 0, dataIndex: 0 },
            ]);
        });

        it("should build index sort order with negative values", () => {
            const categories = [{ name: "A" }, { name: "B" }, { name: "C" }];
            const seriesData = [
                [
                    { legendIndex: 0, y: 10 }, // -10
                    { legendIndex: 1, y: 30 }, // 20
                    { legendIndex: 1, y: 20 }, // 10
                ],
                [{ legendIndex: 0, y: -20 }, { legendIndex: 1, y: -10 }, { legendIndex: 1, y: -10 }],
            ];
            const indexSortOrder: ISortingData[] = buildIndexSortOrder(seriesData, categories);
            expect(indexSortOrder).toEqual([
                { value: 20, dataIndex: 1 },
                { value: 10, dataIndex: 2 },
                { value: -10, dataIndex: 0 },
            ]);
        });

        it("should sort stacked primary series by total value", () => {
            verifyDataOrder(getStackedSeries(0), getCategories(), true, [[40, 30], [30, 20]]);
        });

        it("should sort stacked secondary series by total value", () => {
            verifyDataOrder(getStackedSeries(1), getCategories(), true, [[40, 30], [30, 20]]);
        });

        it("should sort stacked primary series by total value in dual Axes", () => {
            verifyDataOrder(getDualStackedSeries(), getCategories(), false, [[20, 20], [50, 40], [5, 4]]);
        });
    });
});
