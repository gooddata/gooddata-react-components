// (C) 2007-2018 GoodData Corporation
import { AFM } from '@gooddata/typings';
import {
    HeadlineElementType,
    HeadlineType,
    TableElementType,
    TableType,
    VisElementType,
    VisType
} from '../constants/visualizationTypes';

export interface IDrillableItemUri {
    uri: string;
}

export interface IDrillableItemIdentifier {
    identifier: string;
}

export type IDrillableItem =
    IDrillableItemUri |
    IDrillableItemIdentifier |
    (IDrillableItemUri & IDrillableItemIdentifier);

export function isDrillableItemUri(item: IDrillableItem): item is IDrillableItemUri {
    return (item as IDrillableItemUri).uri !== undefined;
}

export function isDrillableItemIdentifier(item: IDrillableItem): item is IDrillableItemIdentifier {
    return (item as IDrillableItemIdentifier).identifier !== undefined;
}

export type IDrillEventCallback = (event: IDrillEvent) => void | boolean;

// Intersection element
export interface IDrillEventIntersectionElement {
    id: string;
    title: string;
    header?: {
        uri: string;
        identifier: string;
    };
}

// Drill context for tables
export interface IDrillEventContextTable {
    type: TableType;
    element: TableElementType;
    columnIndex: number;
    rowIndex: number;
    row: any[];
    intersection: IDrillEventIntersectionElement[];
}

// Drill context for headline
export interface IDrillEventContextHeadline {
    type: HeadlineType;
    element: HeadlineElementType;
    value: string;
    intersection: IDrillEventIntersectionElement[];
}

// Chart series point with intersection element
export interface IDrillPoint {
    x: number;
    y: number;
    intersection: IDrillEventIntersectionElement[];
}

// Shared drill context for all visualizations used in onFiredDrillEvent
export interface IDrillEventContext {
    type: VisType;
    element: VisElementType;
    x?: number;
    y?: number;
    z?: number;
    columnIndex?: number;
    rowIndex?: number;
    row?: any[];
    value?: string;
    intersection?: IDrillEventIntersectionElement[];
    points?: IDrillPoint[];
}

// IDrillEvent is a parameter of the onFiredDrillEvent is callback
export interface IDrillEvent {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContext;
}
