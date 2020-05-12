// (C) 2007-2020 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import difference = require("lodash/difference");
import { Execution } from "@gooddata/typings";
import {
    getAttributeLocators,
    getIdsFromUri,
    getLastFieldId,
    getLastFieldType,
    getParsedFields,
    getTreeLeaves,
    getColumnIdentifierFromDef,
    getColumnIdentifier,
} from "./agGridUtils";
import { FIELD_SEPARATOR, FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE, ID_SEPARATOR } from "./agGridConst";
import { assortDimensionHeaders, identifyResponseHeader } from "./agGridHeaders";
import invariant = require("invariant");

import {
    IAttributeColumnWidthItem,
    ColumnWidth,
    IMeasureColumnWidthItem,
    isMeasureLocatorItem,
    isAttributeColumnWidthItem,
    ColumnWidthItem,
    isMeasureColumnWidthItem,
    ColumnEventSourceType,
    IResizedColumns,
} from "../../../interfaces/PivotTable";
import { IGridHeader } from "./agGridTypes";
import { ColumnApi, Column } from "ag-grid-community";

export const MIN_WIDTH = 60;
export const AUTO_SIZED_MAX_WIDTH = 500;
export const MANUALLY_SIZED_MAX_WIDTH = 2000;

/*
 * All code related to column resizing the ag-grid backed Pivot Table is concentrated here
 */

export const convertColumnWidthsToMap = (
    columnWidths: ColumnWidthItem[],
    executionResponse: Execution.IExecutionResponse,
    widthValidator: (width: ColumnWidth) => ColumnWidth = defaultWidthValidator,
): IResizedColumns => {
    if (!columnWidths || !executionResponse) {
        return {};
    }
    const { dimensions } = executionResponse;

    const columnWidthsMap = {};
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders(dimensions);
    columnWidths.forEach((columnWidth: ColumnWidthItem) => {
        if (isAttributeColumnWidthItem(columnWidth)) {
            const [field, width] = getAttributeColumnWidthItemFieldAndWidth(columnWidth, attributeHeaders);
            columnWidthsMap[field] = {
                width: widthValidator(width),
                source: ColumnEventSourceType.UI_DRAGGED,
            };
        }
        if (isMeasureColumnWidthItem(columnWidth)) {
            const [field, width] = getMeasureColumnWidthItemFieldAndWidth(columnWidth, measureHeaderItems);
            columnWidthsMap[field] = {
                width: widthValidator(width),
                source: ColumnEventSourceType.UI_DRAGGED,
            };
        }
    });
    return columnWidthsMap;
};

const getAttributeColumnWidthItemFieldAndWidth = (
    columnWidthItem: IAttributeColumnWidthItem,
    attributeHeaders: Execution.IAttributeHeader[],
): [string, ColumnWidth] => {
    const localIdentifier = columnWidthItem.attributeColumnWidthItem.attributeIdentifier;

    const attributeHeader = attributeHeaders.find(
        header => header.attributeHeader.localIdentifier === localIdentifier,
    );
    invariant(attributeHeader, `Could not find attributeHeader with localIdentifier "${localIdentifier}"`);

    const field = identifyResponseHeader(attributeHeader);
    return [field, columnWidthItem.attributeColumnWidthItem.width];
};

const getMeasureColumnWidthItemFieldAndWidth = (
    columnWidthItem: IMeasureColumnWidthItem,
    measureHeaderItems: Execution.IMeasureHeaderItem[],
): [string, ColumnWidth] => {
    const keys: string[] = [];
    columnWidthItem.measureColumnWidthItem.locators.forEach(locator => {
        if (isMeasureLocatorItem(locator)) {
            const measureColumnWidthHeaderIndex = measureHeaderItems.findIndex(
                measureHeaderItem =>
                    measureHeaderItem.measureHeaderItem.localIdentifier ===
                    locator.measureLocatorItem.measureIdentifier,
            );
            invariant(
                measureColumnWidthHeaderIndex !== -1,
                `Could not find measureHeader with localIdentifier "${
                    locator.measureLocatorItem.measureIdentifier
                }"`,
            );
            keys.push(`m${ID_SEPARATOR}${measureColumnWidthHeaderIndex}`);
        } else {
            const key = `a${ID_SEPARATOR}${getIdsFromUri(locator.attributeLocatorItem.element).join(
                ID_SEPARATOR,
            )}`;
            keys.push(key);
        }
    });
    const field = keys.join(FIELD_SEPARATOR);
    return [field, columnWidthItem.measureColumnWidthItem.width];
};

const getSizeItemByColId = (
    execution: Execution.IExecutionResponses,
    colId: string,
    width: number,
): ColumnWidthItem => {
    const { dimensions } = execution.executionResponse;
    const fields = getParsedFields(colId);
    const lastFieldType = getLastFieldType(fields);
    const lastFieldId = getLastFieldId(fields);
    const searchDimensionIndex = lastFieldType === FIELD_TYPE_MEASURE ? 1 : 0;
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders([
        dimensions[searchDimensionIndex],
    ]);

    if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        for (const header of attributeHeaders) {
            if (getIdsFromUri(header.attributeHeader.uri)[0] === lastFieldId) {
                const attributeIdentifier = header.attributeHeader.localIdentifier;

                return {
                    attributeColumnWidthItem: {
                        width,
                        attributeIdentifier,
                    },
                };
            }
        }
        // check only column attribute without measure
        const { attributeHeaders: columnAttributeHeaders } = assortDimensionHeaders([dimensions[1]]);

        const EMPTY_MEASURE_FIELD: string[] = [];
        const attributeLocators = getAttributeLocators(
            [...fields, EMPTY_MEASURE_FIELD],
            columnAttributeHeaders,
        );
        if (attributeLocators) {
            return {
                measureColumnWidthItem: {
                    width,
                    locators: [...attributeLocators],
                },
            };
        }

        invariant(false, `could not find attribute header matching ${colId}`);
    } else if (lastFieldType === FIELD_TYPE_MEASURE) {
        const headerItem = measureHeaderItems[parseInt(lastFieldId, 10)];
        const attributeLocators = getAttributeLocators(fields, attributeHeaders);

        return {
            measureColumnWidthItem: {
                width,
                locators: [
                    ...attributeLocators,
                    {
                        measureLocatorItem: {
                            measureIdentifier: headerItem.measureHeaderItem.localIdentifier,
                        },
                    },
                ],
            },
        };
    }
    invariant(false, `could not find header matching ${colId}`);
};

export const getColumnWidthsFromMap = (
    map: IResizedColumns,
    execution: Execution.IExecutionResponses,
): ColumnWidthItem[] => {
    return Object.keys(map).map((colId: string) => {
        const { width } = map[colId];
        const sizeItem = getSizeItemByColId(execution, colId, width);
        invariant(sizeItem, `unable to find size item by filed ${colId}`);
        return sizeItem;
    });
};

export const defaultWidthValidator = (width: ColumnWidth): ColumnWidth => {
    return Math.min(Math.max(width, MIN_WIDTH), MANUALLY_SIZED_MAX_WIDTH);
};

export const enrichColumnDefinitionsWithWidths = (
    columnDefinitions: IGridHeader[],
    manuallyResizedColumns: IResizedColumns,
    autoResizedColumns: IResizedColumns,
    defaultColumnWidth: ColumnWidth,
    isGrowToFitEnabled: boolean,
    growToFittedColumns: IResizedColumns = {},
): IGridHeader[] => {
    const result = cloneDeep(columnDefinitions);
    const leaves = getTreeLeaves(result);
    leaves.forEach((columnDefinition: IGridHeader) => {
        if (columnDefinition) {
            const manualSize = manuallyResizedColumns[getColumnIdentifierFromDef(columnDefinition)];
            const autoResizeSize = autoResizedColumns[getColumnIdentifierFromDef(columnDefinition)];

            columnDefinition.maxWidth = MANUALLY_SIZED_MAX_WIDTH;

            if (manualSize) {
                columnDefinition.width = manualSize.width;
                columnDefinition.suppressSizeToFit = true;
            } else {
                columnDefinition.suppressSizeToFit = false;
                columnDefinition.width = autoResizeSize ? autoResizeSize.width : defaultColumnWidth;
                if (isGrowToFitEnabled) {
                    const growToFittedColumn =
                        growToFittedColumns[getColumnIdentifierFromDef(columnDefinition)];

                    if (growToFittedColumn) {
                        columnDefinition.width = growToFittedColumn.width;
                        if (growToFittedColumn.width > MANUALLY_SIZED_MAX_WIDTH) {
                            columnDefinition.maxWidth = undefined;
                        }
                    }
                }
            }
        }
    });
    return result;
};

export const syncSuppressSizeToFitOnColumns = (
    oldManuallyResizedColumns: IResizedColumns,
    newManuallyResizedColumns: IResizedColumns,
    columnApi: ColumnApi,
) => {
    if (!columnApi) {
        return;
    }

    const oldColumnIds = Object.keys(oldManuallyResizedColumns);
    const newColumnIds = Object.keys(newManuallyResizedColumns);
    const removedColumnIds = difference(oldColumnIds, newColumnIds);
    const addedColumnIds = difference(newColumnIds, oldColumnIds);

    const columns = columnApi.getAllColumns();

    columns.forEach(col => {
        const field = getColumnIdentifier(col);

        if (removedColumnIds.indexOf(field) !== -1) {
            col.getColDef().suppressSizeToFit = false;
        }
        if (addedColumnIds.indexOf(field) !== -1) {
            col.getColDef().suppressSizeToFit = true;
        }
    });
};

export const isColumnAutoResized = (autoResizedColumns: IResizedColumns, resizedColumnId: string) =>
    resizedColumnId && autoResizedColumns[resizedColumnId];

export const isColumnManuallyResized = (manuallyResizedColumns: IResizedColumns, resizedColumnId: string) =>
    resizedColumnId && manuallyResizedColumns[resizedColumnId];

export const resetColumnsWidthToDefault = (
    columnApi: ColumnApi,
    columns: Column[],
    manuallyResizedColumns: IResizedColumns,
    autoResizedColumns: IResizedColumns,
    defaultWidth: number,
) => {
    columns.forEach(col => {
        const id = getColumnIdentifier(col);

        if (isColumnManuallyResized(manuallyResizedColumns, id)) {
            columnApi.setColumnWidth(col, manuallyResizedColumns[id].width);
        } else if (isColumnAutoResized(autoResizedColumns, id)) {
            columnApi.setColumnWidth(col, autoResizedColumns[id].width);
        } else {
            columnApi.setColumnWidth(col, defaultWidth);
        }
    });
};
