// (C) 2007-2020 GoodData Corporation
import { ISeparators } from "@gooddata/numberjs";
import { AFM } from "@gooddata/typings";
import { isEmpty } from "lodash";

export interface IMenu {
    aggregations?: boolean;
    aggregationsSubMenu?: boolean;
}

export type DefaultColumnWidth = "viewport" | "unset"; // | "auto"  | number; can be added later see ONE-4276
export interface IColumnSizing {
    defaultWidth?: DefaultColumnWidth;
    growToFit?: boolean;
    columnWidths?: ColumnWidthItem[];
}

export interface IPivotTableConfig {
    columnSizing?: IColumnSizing;
    separators?: ISeparators;
    menu?: IMenu;
    maxHeight?: number;
}

export interface IMenuAggregationClickConfig {
    type: AFM.TotalType;
    measureIdentifiers: string[];
    attributeIdentifier: string;
    include: boolean;
}

export enum ColumnEventSourceType {
    AUTOSIZE_COLUMNS = "autosizeColumns",
    UI_DRAGGED = "uiColumnDragged",
    FIT_GROW = "growToFit",
}

export enum UIClick {
    CLICK = 1,
    DOUBLE_CLICK = 2,
}

export interface IResizedColumnsItem {
    width: number;
    source: ColumnEventSourceType;
}

export interface IResizedColumns {
    [columnIdentifier: string]: IResizedColumnsItem;
}

export type ColumnWidthItem =
    | IAttributeColumnWidthItem
    | IMeasureColumnWidthItem
    | IAllMeasureColumnWidthItem;
export type AbsoluteColumnWidth = number;
export type ColumnWidth = AbsoluteColumnWidth | "auto";

export function isAbsoluteColumnWidth(columnWidth: ColumnWidth): columnWidth is AbsoluteColumnWidth {
    return Number(columnWidth) === columnWidth;
}

export function isColumnWidthAuto(columnWidth: ColumnWidth): boolean {
    return columnWidth === "auto";
}

export interface IAttributeColumnWidthItem {
    attributeColumnWidthItem: {
        width: AbsoluteColumnWidth;
        attributeIdentifier: AFM.Identifier;
        aggregation?: "sum";
    };
}

export interface IMeasureColumnWidthItem {
    measureColumnWidthItem: {
        width: ColumnWidth;
        locators: LocatorItem[];
    };
}

export interface IAllMeasureColumnWidthItem {
    measureColumnWidthItem: {
        width: AbsoluteColumnWidth;
    };
}

type LocatorItem = IAttributeLocatorItem | AFM.IMeasureLocatorItem;
interface IAttributeLocatorItem {
    attributeLocatorItem: {
        attributeIdentifier: AFM.Identifier;
        element?: string; // this is difference from AFM.IAttributeLocatorItem
    };
}

export function isAttributeColumnWidthItem(
    columnWidthItem: ColumnWidthItem,
): columnWidthItem is IAttributeColumnWidthItem {
    return (
        !isEmpty(columnWidthItem) &&
        (columnWidthItem as IAttributeColumnWidthItem).attributeColumnWidthItem !== undefined
    );
}

export function isMeasureColumnWidthItem(
    columnWidthItem: ColumnWidthItem,
): columnWidthItem is IMeasureColumnWidthItem {
    return (
        !isEmpty(columnWidthItem) &&
        (columnWidthItem as IMeasureColumnWidthItem).measureColumnWidthItem !== undefined &&
        (columnWidthItem as IMeasureColumnWidthItem).measureColumnWidthItem.locators !== undefined
    );
}

export function isAllMeasureColumnWidthItem(
    columnWidthItem: ColumnWidthItem,
): columnWidthItem is IAllMeasureColumnWidthItem {
    return (
        !isEmpty(columnWidthItem) &&
        (columnWidthItem as IAllMeasureColumnWidthItem).measureColumnWidthItem !== undefined &&
        (columnWidthItem as IMeasureColumnWidthItem).measureColumnWidthItem.locators === undefined
    );
}

export function isMeasureLocatorItem(locator: LocatorItem): locator is AFM.IMeasureLocatorItem {
    return !isEmpty(locator) && (locator as AFM.IMeasureLocatorItem).measureLocatorItem !== undefined;
}
