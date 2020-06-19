// (C) 2007-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import omit = require("lodash/omit");

import {
    getColumnIdentifier,
    isMeasureColumn,
    getMappingHeaderMeasureItemLocalIdentifier,
} from "./agGridUtils";
import {
    getColumnWidthsFromMap,
    convertColumnWidthsToMap,
    defaultWidthValidator,
    getAllowGrowToFitProp,
    getWeakColumnWidthsFromMap,
} from "./agGridColumnSizing";
import {
    ColumnWidthItem,
    isAllMeasureColumnWidthItem,
    IAllMeasureColumnWidthItem,
    ColumnWidth,
    isAbsoluteColumnWidth,
    IManuallyResizedColumnsItem,
    IWeakMeasureColumnWidthItem,
    isAttributeColumnWidthItem,
    isMeasureColumnWidthItem,
    isWeakMeasureColumnWidthItem,
} from "../../../interfaces/PivotTable";
import omitBy = require("lodash/omitBy");

export interface IResizedColumnsCollection {
    [columnIdentifier: string]: IResizedColumnsCollectionItem;
}

export interface IResizedColumnsCollectionItem {
    width: ColumnWidth;
    measureIdentifier?: string;
}

export function isColumnWidthAuto(columnWidth: ColumnWidth): boolean {
    return columnWidth.value === "auto";
}

export interface IWeakMeasureColumnWidthItemsMap {
    [measureIdentifier: string]: IWeakMeasureColumnWidthItem;
}

export class ResizedColumnsStore {
    private manuallyResizedColumns: IResizedColumnsCollection;
    private allMeasureColumnWidth: number | null;
    private weakMeasuresColumnWidths: IWeakMeasureColumnWidthItemsMap;

    public constructor(
        manuallyResizedColumns: IResizedColumnsCollection = {},
        allMeasureColumnWidth: number | null = null,
        weakMeasuresColumnWidths: IWeakMeasureColumnWidthItemsMap = {},
    ) {
        this.manuallyResizedColumns = manuallyResizedColumns;
        this.allMeasureColumnWidth = allMeasureColumnWidth;
        this.weakMeasuresColumnWidths = weakMeasuresColumnWidths;
    }

    public getManuallyResizedColumn(item: Column | ColDef): IManuallyResizedColumnsItem {
        const colId = getColumnIdentifier(item);

        if (this.manuallyResizedColumns[colId]) {
            return this.convertItem(this.manuallyResizedColumns[colId]);
        }

        const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidth(item);

        if (weakColumnWidth) {
            return this.getWeakMeasureColumMapItem(weakColumnWidth);
        }

        if (isMeasureColumn(item) && this.isAllMeasureColumWidthUsed()) {
            return this.getAllMeasureColumMapItem();
        }
    }

    public isColumnManuallyResized(item: Column | ColDef) {
        return !!this.getManuallyResizedColumn(item);
    }

    public addToManuallyResizedColumn(column: Column, allowGrowToFit: boolean = false): void {
        this.manuallyResizedColumns[getColumnIdentifier(column)] = {
            width: {
                value: column.getActualWidth(),
                ...getAllowGrowToFitProp(allowGrowToFit),
            },
        };

        column.getColDef().suppressSizeToFit = !allowGrowToFit;
    }

    public addAllMeasureColumn(columnWidth: number, allColumns: Column[]) {
        this.allMeasureColumnWidth = columnWidth;
        allColumns.forEach(col => {
            if (isMeasureColumn(col)) {
                const colId = getColumnIdentifier(col);
                if (this.manuallyResizedColumns[colId]) {
                    this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
                }
                col.getColDef().suppressSizeToFit = true;
            }
        });
        this.weakMeasuresColumnWidths = {};
    }

    public addWeekMeasureColumn(column: Column) {
        const width = column.getActualWidth();
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(column);
        if (measureHeaderLocalIdentifier) {
            this.weakMeasuresColumnWidths[measureHeaderLocalIdentifier] = {
                measureColumnWidthItem: {
                    width: {
                        value: width,
                    },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: measureHeaderLocalIdentifier,
                        },
                    },
                },
            };

            const shouldBeRemoved = (resizedColumnItem: IResizedColumnsCollectionItem) =>
                resizedColumnItem.measureIdentifier === measureHeaderLocalIdentifier;

            this.manuallyResizedColumns = omitBy(this.manuallyResizedColumns, shouldBeRemoved);
        }
    }

    public removeAllMeasureColumns() {
        this.allMeasureColumnWidth = null;
        const shouldBeRemoved = (resizedColumnItem: IResizedColumnsCollectionItem) =>
            isColumnWidthAuto(resizedColumnItem.width);
        this.manuallyResizedColumns = omitBy(this.manuallyResizedColumns, shouldBeRemoved);

        this.weakMeasuresColumnWidths = {};
    }

    public removeWeakMeasureColumn(column: Column) {
        const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidth(column);
        if (weakColumnWidth) {
            this.weakMeasuresColumnWidths = omit(
                this.weakMeasuresColumnWidths,
                weakColumnWidth.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier,
            );
            const shouldBeRemoved = (resizedColumnItem: IResizedColumnsCollectionItem) => {
                return (
                    isColumnWidthAuto(resizedColumnItem.width) &&
                    this.isMatchingWeakWidth(resizedColumnItem, weakColumnWidth) &&
                    !this.isAllMeasureColumWidthUsed()
                );
            };
            this.manuallyResizedColumns = omitBy(this.manuallyResizedColumns, shouldBeRemoved);
        }
    }

    public removeFromManuallyResizedColumn(column: Column): void {
        const colId = getColumnIdentifier(column);
        const item = this.manuallyResizedColumns[colId];

        if (item) {
            this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);

            if (!this.isAllMeasureColumWidthUsed() || !isMeasureColumn(column)) {
                column.getColDef().suppressSizeToFit = false;
            }
        }

        if (
            isMeasureColumn(column) &&
            (this.isAllMeasureColumWidthUsed() || this.getMatchedWeakMeasuresColumnWidth(column))
        ) {
            // TODO INE: consider creating weakItem with width: "auto" when alt+DC over allMeasure
            this.manuallyResizedColumns[colId] = this.getAutoSizeItem(column);
            column.getColDef().suppressSizeToFit = false;
        }
    }

    public getColumnWidthsFromMap(execution: Execution.IExecutionResponses): ColumnWidthItem[] {
        const result = getColumnWidthsFromMap(this.manuallyResizedColumns, execution);
        if (this.isAllMeasureColumWidthUsed()) {
            result.push(this.getAllMeasureColumnWidth());
        }
        const weakColumnWidthItems: ColumnWidthItem[] = getWeakColumnWidthsFromMap(
            this.weakMeasuresColumnWidths,
        );

        return result.concat(weakColumnWidthItems);
    }

    public updateColumnWidths(
        columnWidths: ColumnWidthItem[],
        executionResponse: Execution.IExecutionResponse,
    ) {
        const allMeasureWidthItem = this.filterAllMeasureColumnWidthItem(columnWidths);

        if (isAllMeasureColumnWidthItem(allMeasureWidthItem)) {
            const validatedAllMeasureColumnWidth = defaultWidthValidator(
                allMeasureWidthItem.measureColumnWidthItem.width,
            );
            this.allMeasureColumnWidth = isAbsoluteColumnWidth(validatedAllMeasureColumnWidth)
                ? validatedAllMeasureColumnWidth.value
                : null;
        } else {
            this.allMeasureColumnWidth = null;
        }

        this.weakMeasuresColumnWidths = this.filterWeakColumnWidthItems(columnWidths);

        const columnWidthItems = this.filterStrongColumnWidthItems(columnWidths);
        const columnWidthsByField = convertColumnWidthsToMap(columnWidthItems, executionResponse);
        this.manuallyResizedColumns = columnWidthsByField;
    }

    public getMatchingColumnsByMeasure(targetColumn: Column, allColumns: Column[]): Column[] {
        const targetMeasureLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(targetColumn);

        if (targetMeasureLocalIdentifier) {
            return allColumns.filter((col: Column) => {
                const measureLocalIdentifier = getMappingHeaderMeasureItemLocalIdentifier(col);
                return targetMeasureLocalIdentifier === measureLocalIdentifier;
            });
        }
        return [];
    }

    public getMatchedWeakMeasuresColumnWidth(item: Column | ColDef): IWeakMeasureColumnWidthItem {
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(item);

        if (measureHeaderLocalIdentifier) {
            return this.weakMeasuresColumnWidths[measureHeaderLocalIdentifier];
        }
    }

    private filterAllMeasureColumnWidthItem(columnWidths: ColumnWidthItem[]): IAllMeasureColumnWidthItem {
        if (columnWidths) {
            return columnWidths.filter(isAllMeasureColumnWidthItem)[0];
        }
    }

    private filterStrongColumnWidthItems(columnWidths: ColumnWidthItem[]) {
        if (columnWidths) {
            return columnWidths.filter(
                item => isAttributeColumnWidthItem(item) || isMeasureColumnWidthItem(item),
            );
        }
        return [];
    }

    private filterWeakColumnWidthItems(columnWidths: ColumnWidthItem[]): IWeakMeasureColumnWidthItemsMap {
        if (columnWidths) {
            const onlyWeakWidthItems: IWeakMeasureColumnWidthItem[] = columnWidths.filter(
                isWeakMeasureColumnWidthItem,
            );
            return onlyWeakWidthItems.reduce(
                (map: IWeakMeasureColumnWidthItemsMap, weakWidthItem: IWeakMeasureColumnWidthItem) => {
                    const validatedWidth = defaultWidthValidator(weakWidthItem.measureColumnWidthItem.width);

                    if (isAbsoluteColumnWidth(validatedWidth)) {
                        return {
                            ...map,
                            [weakWidthItem.measureColumnWidthItem.locator.measureLocatorItem
                                .measureIdentifier]: {
                                measureColumnWidthItem: {
                                    ...weakWidthItem.measureColumnWidthItem,
                                    width: {
                                        ...weakWidthItem.measureColumnWidthItem.width,
                                        value: validatedWidth.value,
                                    },
                                },
                            },
                        };
                    }

                    return map;
                },
                {},
            );
        }
        return {};
    }

    private convertItem(item: IResizedColumnsCollectionItem): IManuallyResizedColumnsItem {
        // columns with width.value = auto are hidden
        if (isAbsoluteColumnWidth(item.width)) {
            const { width } = item;
            return {
                width: width.value,
                ...getAllowGrowToFitProp(width.allowGrowToFit),
            };
        }
    }

    private getWeakMeasureColumMapItem(item: IWeakMeasureColumnWidthItem): IManuallyResizedColumnsItem {
        return {
            width: item.measureColumnWidthItem.width.value,
        };
    }

    private isAllMeasureColumWidthUsed() {
        return this.allMeasureColumnWidth !== null;
    }

    private getAutoSizeItem(column: Column): IResizedColumnsCollectionItem {
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(column);
        const result: IResizedColumnsCollectionItem = { width: { value: "auto" } };
        if (measureHeaderLocalIdentifier) {
            result.measureIdentifier = measureHeaderLocalIdentifier;
        }
        return result;
    }

    private getAllMeasureColumMapItem(): IManuallyResizedColumnsItem {
        return { width: this.allMeasureColumnWidth };
    }

    private getAllMeasureColumnWidth(): IAllMeasureColumnWidthItem {
        return {
            measureColumnWidthItem: {
                width: {
                    value: this.allMeasureColumnWidth,
                },
            },
        };
    }

    private isMatchingWeakWidth(
        item: IResizedColumnsCollectionItem,
        weakColumnWidth: IWeakMeasureColumnWidthItem,
    ) {
        return (
            item.measureIdentifier ===
            weakColumnWidth.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier
        );
    }
}
