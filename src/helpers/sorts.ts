// (C) 2007-2018 GoodData Corporation
import get = require("lodash/get");
import sum = require("lodash/sum");
import { AFM } from "@gooddata/typings";

import { ASC, DESC } from "../constants/sort";
import { ICategory, ISeriesItem, ISeriesDataItem } from "../interfaces/Config";

export interface ISortSeriesDataResult {
    series: ISeriesItem[];
    categories: ICategory[];
}

export interface ISortingData {
    value: number;
    dataIndex?: number;
}

function getMeasureSortItems(identifier: string, direction: AFM.SortDirection): AFM.SortItem[] {
    return [
        {
            measureSortItem: {
                direction,
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: identifier,
                        },
                    },
                ],
            },
        },
    ];
}

function getAttributeSortItems(
    identifier: string,
    direction: AFM.SortDirection,
    aggregation?: boolean,
): AFM.SortItem[] {
    if (!identifier) {
        return [];
    }

    const attributeSortItem: AFM.IAttributeSortItem = {
        attributeSortItem: {
            attributeIdentifier: identifier,
            direction,
            ...(aggregation ? { aggregation: "sum" } : {}),
        },
    };

    return [attributeSortItem];
}

function getAllMeasuresSorts(afm: AFM.IAfm): AFM.SortItem[] {
    return (afm.measures || []).reduce((sortItems: AFM.SortItem[], measure: AFM.IMeasure) => {
        return [...sortItems, ...getMeasureSortItems(measure.localIdentifier, DESC)];
    }, []);
}

export function getDefaultTreemapSort(afm: AFM.IAfm, resultSpec: AFM.IResultSpec): AFM.SortItem[] {
    const viewByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[0]");
    const stackByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[1]");

    if (viewByAttributeIdentifier && stackByAttributeIdentifier) {
        return [...getAttributeSortItems(viewByAttributeIdentifier, ASC, false), ...getAllMeasuresSorts(afm)];
    }

    return [];
}

export function sortStackedSeriesData(
    series: ISeriesItem[],
    categories: ICategory[],
    isSingleAxis: boolean,
): ISortSeriesDataResult {
    const isPrimarySeries = (seriesItem: ISeriesItem) => seriesItem.yAxis === 0;
    const categoriesSize = categories.length;
    const filteredSeries = isSingleAxis ? series : series.filter(isPrimarySeries);
    const seriesData = filteredSeries.map((item: ISeriesItem) => item.data);
    const seriesNo = seriesData.length;
    const seriesDataSize = seriesNo ? seriesData[0].length : 0;

    // don't need to sort
    if (categoriesSize === 0 || seriesDataSize === 0) {
        return {
            series,
            categories,
        };
    }

    const indexSortOrder: ISortingData[] = buildIndexSortOrder(seriesData, categories);
    return {
        series: sortSeriesItemsData(series, indexSortOrder),
        categories: sortCategories(categories, indexSortOrder),
    };
}

export function buildIndexSortOrder(
    seriesData: ISeriesDataItem[][],
    categories: ICategory[],
): ISortingData[] {
    const sortingData = categories.reduce((results: ISortingData[], _, dataIndex: number) => {
        const dataValue = sum(seriesData.map((item: ISeriesDataItem[]) => get(item[dataIndex], "y")));
        results.push({
            value: dataValue,
            dataIndex,
        });

        return results;
    }, []);

    return sortingData.sort((a: ISortingData, b: ISortingData) => {
        return b.value - a.value;
    });
}

function sortSeriesItemsData(series: ISeriesItem[], indexSortOrder: ISortingData[]): ISeriesItem[] {
    return series.map(
        (seriesItem: ISeriesItem): ISeriesItem => ({
            ...seriesItem,
            data: sortSeriesItemData(seriesItem, indexSortOrder),
        }),
    );
}

function sortSeriesItemData(seriesItem: ISeriesItem, indexSortOrder: ISortingData[]): ISeriesDataItem[] {
    return indexSortOrder.reduce(
        (dataItems: ISeriesDataItem[], sortOrder: ISortingData, dataIndex: number) => {
            const { dataIndex: originalDataIndex } = sortOrder;
            dataItems.push({
                ...seriesItem.data[originalDataIndex],
                color: get(seriesItem.data[dataIndex], "color"),
                legendIndex: dataIndex,
            });
            return dataItems;
        },
        [],
    );
}

function sortCategories(categories: ICategory[], indexSortOrder: ISortingData[]): ICategory[] {
    return indexSortOrder.map((sortOrder: ISortingData) => {
        const { dataIndex: originalGroupIndex } = sortOrder;
        return categories[originalGroupIndex];
    });
}
