// (C) 2007-2020 GoodData Corporation
import { ISeparators } from "@gooddata/numberjs";
import { AFM } from "@gooddata/typings";

export interface IMenu {
    aggregations?: boolean;
    aggregationsSubMenu?: boolean;
}

export type DefaultColumnWidth = "viewport" | "unset"; // | "auto"  | number; can be added later see ONE-4276
export interface IColumnSizing {
    defaultWidth: DefaultColumnWidth;
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
