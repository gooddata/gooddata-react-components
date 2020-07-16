// (C) 2020 GoodData Corporation
import includes = require("lodash/includes");
import flatMap = require("lodash/flatMap");
import { AFM, VisualizationObject } from "@gooddata/typings";
import * as BucketNames from "../../../../constants/bucketNames";
import {
    IBucketItem,
    IBucketFilter,
    isAttributeFilter,
    IAttributeFilter,
} from "../../../interfaces/Visualization";
// removes attribute sortItems with invalid identifiers
// removes measure sortItems with invalid identifiers and invalid number of locators
function adaptSortItemsToPivotTable(
    originalSortItems: AFM.SortItem[],
    measureLocalIdentifiers: string[],
    rowAttributeLocalIdentifiers: string[],
    columnAttributeLocalIdentifiers: string[],
): AFM.SortItem[] {
    const attributeLocalIdentifiers = [...rowAttributeLocalIdentifiers, ...columnAttributeLocalIdentifiers];
    const changedSortItems: AFM.SortItem[] = [];

    for (const sortItem of originalSortItems) {
        if (AFM.isMeasureSortItem(sortItem)) {
            // filter out invalid locators
            const filteredSortItem: AFM.IMeasureSortItem = {
                measureSortItem: {
                    ...sortItem.measureSortItem,
                    locators: sortItem.measureSortItem.locators.filter(locator => {
                        // filter out invalid measure locators
                        if (AFM.isMeasureLocatorItem(locator)) {
                            return includes(
                                measureLocalIdentifiers,
                                locator.measureLocatorItem.measureIdentifier,
                            );
                        }
                        // filter out invalid column attribute locators
                        return includes(
                            columnAttributeLocalIdentifiers,
                            locator.attributeLocatorItem.attributeIdentifier,
                        );
                    }),
                },
            };
            const hasMeasureLocatorItem = filteredSortItem.measureSortItem.locators.some(locator =>
                AFM.isMeasureLocatorItem(locator),
            );
            const hasCorrectLength =
                filteredSortItem.measureSortItem.locators.length ===
                columnAttributeLocalIdentifiers.length + 1;
            // keep sortItem if measureLocator is present and locators are correct length
            if (hasMeasureLocatorItem && hasCorrectLength) {
                changedSortItems.push(sortItem);
            }
        }

        if (
            AFM.isAttributeSortItem(sortItem) &&
            includes(attributeLocalIdentifiers, sortItem.attributeSortItem.attributeIdentifier)
        ) {
            changedSortItems.push(sortItem);
        }
    }

    return changedSortItems;
}

export function adaptReferencePointSortItemsToPivotTable(
    originalSortItems: AFM.SortItem[],
    measures: IBucketItem[],
    rowAttributes: IBucketItem[],
    columnAttributes: IBucketItem[],
): AFM.SortItem[] {
    const measureLocalIdentifiers = measures.map(measure => measure.localIdentifier);
    const rowAttributeLocalIdentifiers = rowAttributes.map(rowAttribute => rowAttribute.localIdentifier);
    const columnAttributeLocalIdentifiers = columnAttributes.map(
        columnAttribute => columnAttribute.localIdentifier,
    );

    return adaptSortItemsToPivotTable(
        originalSortItems,
        measureLocalIdentifiers,
        rowAttributeLocalIdentifiers,
        columnAttributeLocalIdentifiers,
    );
}

const bucketItemGetter = <T extends VisualizationObject.BucketItem>(bucketId: string) => (
    buckets: VisualizationObject.IBucket[],
) => flatMap(buckets.filter(b => b.localIdentifier === bucketId), i => i.items) as T[];
export const getMeasures = bucketItemGetter<VisualizationObject.IMeasure>(BucketNames.MEASURES);
export const getRows = bucketItemGetter<VisualizationObject.IVisualizationAttribute>(BucketNames.ATTRIBUTE);
export const getColumns = bucketItemGetter<VisualizationObject.IVisualizationAttribute>(BucketNames.COLUMNS);

export function adaptMdObjectSortItemsToPivotTable(
    originalSortItems: AFM.SortItem[],
    buckets: VisualizationObject.IBucket[],
): AFM.SortItem[] {
    const measureLocalIdentifiers = getMeasures(buckets).map(measure => measure.measure.localIdentifier);
    const rowAttributeLocalIdentifiers = getRows(buckets).map(
        rowAttribute => rowAttribute.visualizationAttribute.localIdentifier,
    );
    const columnAttributeLocalIdentifiers = getColumns(buckets).map(
        columnAttribute => columnAttribute.visualizationAttribute.localIdentifier,
    );

    return adaptSortItemsToPivotTable(
        originalSortItems,
        measureLocalIdentifiers,
        rowAttributeLocalIdentifiers,
        columnAttributeLocalIdentifiers,
    );
}

const isMeasureSortItemMatchedByFilter = (
    sortItem: AFM.IMeasureSortItem,
    filter: IAttributeFilter,
): boolean =>
    filter.selectedElements.some(selectedElement =>
        sortItem.measureSortItem.locators.some(
            locator =>
                !AFM.isMeasureLocatorItem(locator) &&
                locator.attributeLocatorItem.element === selectedElement.uri,
        ),
    );

const isMeasureSortItemVisible = (sortItem: AFM.IMeasureSortItem, filters: IBucketFilter[]): boolean =>
    filters.reduce((isVisible, filter) => {
        if (isAttributeFilter(filter)) {
            const shouldBeMatched = !filter.isInverted;
            return isVisible && shouldBeMatched === isMeasureSortItemMatchedByFilter(sortItem, filter);
        }
        return isVisible;
    }, true);

export const isSortItemVisible = (sortItem: AFM.SortItem, filters: IBucketFilter[]): boolean =>
    AFM.isAttributeSortItem(sortItem) || isMeasureSortItemVisible(sortItem, filters);

export function addDefaultSort(
    sortItems: AFM.SortItem[],
    filters: IBucketFilter[],
    rowAttributes: IBucketItem[],
    previousRowAttributes?: IBucketItem[],
): AFM.SortItem[] {
    // cannot construct default sort without a row
    if (rowAttributes.length < 1) {
        return sortItems;
    }

    // detect custom sort
    const firstRow = rowAttributes[0];
    const previousFirstRow = previousRowAttributes && previousRowAttributes[0];
    const hasVisibleCustomSort = sortItems.some(sortItem => {
        if (!isSortItemVisible(sortItem, filters)) {
            return false;
        }
        // non attribute sort is definitely custom
        if (!AFM.isAttributeSortItem(sortItem)) {
            return true;
        }
        // asc sort on first row is considered default
        if (
            sortItem.attributeSortItem.attributeIdentifier === firstRow.localIdentifier &&
            sortItem.attributeSortItem.direction === "asc"
        ) {
            return false;
        }
        // asc sort on row that was first until now is considered default as well
        if (
            previousFirstRow &&
            sortItem.attributeSortItem.attributeIdentifier === previousFirstRow.localIdentifier &&
            sortItem.attributeSortItem.direction === "asc"
        ) {
            return false;
        }
        return true;
    });

    return hasVisibleCustomSort
        ? sortItems
        : [
              {
                  attributeSortItem: {
                      attributeIdentifier: firstRow.localIdentifier,
                      direction: "asc",
                  },
              },
          ];
}
