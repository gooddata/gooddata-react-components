// (C) 2007-2020 GoodData Corporation
// tslint:disable:prefer-conditional-expression
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import omit = require("lodash/omit");

import { getColumnIdentifier, isMeasureColumn } from "./agGridUtils";
import {
    getColumnWidthsFromMap,
    convertColumnWidthsToMap,
    defaultWidthValidator,
    getAllowGrowToFitProp,
} from "./agGridColumnSizing";
import {
    ColumnEventSourceType,
    ColumnWidthItem,
    isAllMeasureColumnWidthItem,
    IAllMeasureColumnWidthItem,
    ColumnWidth,
    isAbsoluteColumnWidth,
    IManuallyResizedColumnsItem,
} from "../../../interfaces/PivotTable";

export interface IResizedColumnsCollection {
    [columnIdentifier: string]: IResizedColumnsCollectionItem;
}

export interface IResizedColumnsCollectionItem {
    width: ColumnWidth;
    source: ColumnEventSourceType;
}

export function isColumnWidthAuto(columnWidth: ColumnWidth): boolean {
    return columnWidth.value === "auto";
}

export class ResizedColumnsStore {
    private manuallyResizedColumns: IResizedColumnsCollection;
    private allMeasureColumnWidth: number | null;

    public constructor(manuallyResizedColumns: IResizedColumnsCollection = {}) {
        this.manuallyResizedColumns = manuallyResizedColumns;
        this.allMeasureColumnWidth = null;
    }

    public getManuallyResizedColumn(item: Column | ColDef): IManuallyResizedColumnsItem {
        const colId = getColumnIdentifier(item);

        if (this.manuallyResizedColumns[colId]) {
            return this.convertItem(this.manuallyResizedColumns[colId]);
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
            source: ColumnEventSourceType.UI_DRAGGED,
        };

        column.getColDef().suppressSizeToFit = !allowGrowToFit;
    }

    public addAllMeasureColumns(columnWidth: number, allColumns: Column[]) {
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
    }

    public removeAllMeasureColumns() {
        this.allMeasureColumnWidth = null;
        const colIds = Object.keys(this.manuallyResizedColumns);
        colIds.forEach(colId => {
            const item = this.manuallyResizedColumns[colId];
            if (isColumnWidthAuto(item.width)) {
                this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
            }
        });
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

        if (this.isAllMeasureColumWidthUsed() && isMeasureColumn(column)) {
            this.manuallyResizedColumns[colId] = this.getAutoSizeItem();
            column.getColDef().suppressSizeToFit = false;
        }
    }

    public getColumnWidthsFromMap(execution: Execution.IExecutionResponses): ColumnWidthItem[] {
        const result = getColumnWidthsFromMap(this.manuallyResizedColumns, execution);
        if (this.isAllMeasureColumWidthUsed()) {
            result.push(this.getAllMeasureColumnWidth());
        }
        return result;
    }

    public updateColumnWidths(
        columnWidths: ColumnWidthItem[],
        executionResponse: Execution.IExecutionResponse,
    ) {
        const [allMeasureColumnWidthItems, columnWidthItems] = this.partition(columnWidths, item =>
            isAllMeasureColumnWidthItem(item),
        );

        const allMeasureWidthItem = allMeasureColumnWidthItems[0];

        if (isAllMeasureColumnWidthItem(allMeasureWidthItem)) {
            const validatedWidth = defaultWidthValidator(allMeasureWidthItem.measureColumnWidthItem.width);
            this.allMeasureColumnWidth = isAbsoluteColumnWidth(validatedWidth) ? validatedWidth.value : null;
        } else {
            this.allMeasureColumnWidth = null;
        }

        const columnWidthsByField = convertColumnWidthsToMap(columnWidthItems, executionResponse);
        this.manuallyResizedColumns = columnWidthsByField;
    }

    private partition(
        array: ColumnWidthItem[],
        isValid: (elem: ColumnWidthItem) => boolean,
    ): [ColumnWidthItem[], ColumnWidthItem[]] {
        if (!array) {
            return [[], []];
        }

        return array.reduce<[ColumnWidthItem[], ColumnWidthItem[]]>(
            ([pass, fail], elem) => {
                return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
            },
            [[], []],
        );
    }

    private convertItem(item: IResizedColumnsCollectionItem): IManuallyResizedColumnsItem {
        // columns with width.value = auto are hidden
        if (isAbsoluteColumnWidth(item.width)) {
            const { width, source } = item;
            return {
                width: width.value,
                source,
                ...getAllowGrowToFitProp(width.allowGrowToFit),
            };
        }
    }

    private isAllMeasureColumWidthUsed() {
        return this.allMeasureColumnWidth !== null;
    }

    private getAutoSizeItem(): IResizedColumnsCollectionItem {
        return { width: { value: "auto" }, source: ColumnEventSourceType.UI_DRAGGED };
    }

    private getAllMeasureColumMapItem(): IManuallyResizedColumnsItem {
        return { width: this.allMeasureColumnWidth, source: ColumnEventSourceType.UI_DRAGGED };
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
}
