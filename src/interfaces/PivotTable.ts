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

export interface IResizedColumns {
    [columnIdentifier: string]: { width: number; source: ColumnEventSourceType };
}

export type ColumnWidthItem = IAttributeColumnWidthItem | IMeasureColumnWidthItem;
export type ColumnWidth = number;
export interface IAttributeColumnWidthItem {
    attributeColumnWidthItem: {
        width: ColumnWidth;
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
        (columnWidthItem as IMeasureColumnWidthItem).measureColumnWidthItem !== undefined
    );
}

export function isMeasureLocatorItem(locator: LocatorItem): locator is AFM.IMeasureLocatorItem {
    return !isEmpty(locator) && (locator as AFM.IMeasureLocatorItem).measureLocatorItem !== undefined;
}
