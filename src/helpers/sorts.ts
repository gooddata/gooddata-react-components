// (C) 2007-2020 GoodData Corporation
import get = require("lodash/get");
import { AFM } from "@gooddata/typings";

import { MEASUREGROUP } from "../constants/dimensions";
import { ASC, DESC } from "../constants/sort";

const STACK_BY_DIMENSION = 0;
const VIEW_BY_DIMENSION = 1;

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

function ignoreMeasureGroup(item: string): boolean {
    return item !== MEASUREGROUP;
}

function getDimensionItems(resultSpec: AFM.IResultSpec, dimensionIndex: number): AFM.Identifier[] {
    const dimensionItems: AFM.Identifier[] = get(
        resultSpec,
        ["dimensions", dimensionIndex, "itemIdentifiers"],
        [],
    );
    return dimensionItems.filter(ignoreMeasureGroup) || [];
}

export function getFirstAttributeIdentifier(
    resultSpec: AFM.IResultSpec,
    dimensionIndex: number,
): string | null {
    const dimensionItems = getDimensionItems(resultSpec, dimensionIndex);
    return dimensionItems[0] || null;
}

export function getAttributeSortItem(
    identifier: string,
    direction: AFM.SortDirection = ASC,
    aggregation: boolean = false,
): AFM.SortItem {
    const attributeSortItemWithoutAggregation = {
        attributeIdentifier: identifier,
        direction,
    };

    const attributeSortItem: AFM.IAttributeSortItem = {
        attributeSortItem: aggregation
            ? {
                  ...attributeSortItemWithoutAggregation,
                  aggregation: "sum",
              }
            : attributeSortItemWithoutAggregation,
    };

    return attributeSortItem;
}

export function getFirstMeasureSort(afm: AFM.IAfm): AFM.SortItem[] {
    const measure: AFM.IMeasure = get(afm, "measures.0");
    if (measure) {
        return getMeasureSortItems(measure.localIdentifier, DESC);
    }

    return [];
}

export function getDefaultAttributeGeoPushpinSort(afm: AFM.IAfm): AFM.SortItem[] {
    const { attributes } = afm;

    // sort by second attribute (1st: location, 2nd: segmentBy, 3rd: tooltipText)
    if (attributes.length > 1) {
        return getAttributeSortItems(attributes[1].localIdentifier, ASC);
    }

    return [];
}

export function getDefaultHeatmapSort(resultSpec: AFM.IResultSpec): AFM.SortItem[] {
    if (!resultSpec) {
        return [];
    }

    const { sorts } = resultSpec;
    if (sorts) {
        return sorts;
    }

    const { dimensions } = resultSpec;
    if (dimensions && dimensions.length) {
        const rowsAttributeIdentifier = dimensions[0].itemIdentifiers[0];
        return ignoreMeasureGroup(rowsAttributeIdentifier)
            ? getAttributeSortItems(rowsAttributeIdentifier, DESC)
            : [];
    }

    return [];
}

export function getDefaultBarChartSort(
    afm: AFM.IAfm,
    resultSpec: AFM.IResultSpec,
    canSortStackTotalValue: boolean = false,
    enableSortingByTotalGroup: boolean = false,
): AFM.SortItem[] {
    const measureItemsCount: number = get(afm, "measures", []).length;
    const viewByDimensionItems = getDimensionItems(resultSpec, VIEW_BY_DIMENSION);
    const viewByAttributeIdentifier = getFirstAttributeIdentifier(resultSpec, VIEW_BY_DIMENSION);
    const stackByAttributeIdentifier = getFirstAttributeIdentifier(resultSpec, STACK_BY_DIMENSION);

    let shouldSortByFirstViewByAttribute: boolean | string =
        (viewByAttributeIdentifier && stackByAttributeIdentifier) || canSortStackTotalValue;
    if (enableSortingByTotalGroup) {
        if (viewByDimensionItems.length === 2) {
            if (measureItemsCount >= 2 && !canSortStackTotalValue) {
                return [
                    getAttributeSortItem(viewByDimensionItems[0], DESC, true),
                    ...getFirstMeasureSort(afm),
                ];
            }

            return [
                getAttributeSortItem(viewByDimensionItems[0], DESC, true),
                getAttributeSortItem(viewByDimensionItems[1], DESC, true),
            ];
        }

        shouldSortByFirstViewByAttribute =
            viewByAttributeIdentifier && (stackByAttributeIdentifier || canSortStackTotalValue);
    }

    if (shouldSortByFirstViewByAttribute) {
        return [getAttributeSortItem(viewByAttributeIdentifier, DESC, true)];
    }

    if (!stackByAttributeIdentifier) {
        return getFirstMeasureSort(afm);
    }

    return [];
}

export function getDefaultTreemapSort(afm: AFM.IAfm, resultSpec: AFM.IResultSpec): AFM.SortItem[] {
    const viewByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[0]");
    const stackByAttributeIdentifier: string = get(resultSpec, "dimensions[0].itemIdentifiers[1]");

    if (viewByAttributeIdentifier && stackByAttributeIdentifier) {
        return [...getAttributeSortItems(viewByAttributeIdentifier, ASC, false), ...getAllMeasuresSorts(afm)];
    }

    return [];
}
