// (C) 2007-2018 GoodData Corporation
import { AFM, Execution } from '@gooddata/typings';
import { VisType, VisElementType } from '../constants/visualizationTypes';
import IAfm = AFM.IAfm;

// IDrillEvent is a parameter of the onFiredDrillEvent is callback
export interface IDrillEvent {
    executionContext: AFM.IAfm;
    drillContext: {
        type: VisType; // type of visualization
        element: VisElementType; // type of visualization element drilled
        x?: number; // chart x coordinate (if supported)
        y?: number; // chart y coordinate (if supported)
        columnIndex?: number;
        rowIndex?: number;
        row?: any[]; // table row data of the drilled row
        value?: string; // cell or element value drilled
        // some drill headers that are relevant for current drill element
        intersection: IDrillEventIntersectionElement[];
        // A collection of chart series points (if available)
        points?: IDrillEventPoint[];
    };
}

// Chart series point with intersection element
export interface IDrillEventPoint {
    x: number;
    y: number;
    intersection: IDrillEventIntersectionElement[];
}

// Intersection element
// Can be a measure, attribute or attribute value. Attribute values have only uri.
export interface IDrillEventIntersectionElement {
    id: string;
    title: string;
    header?: {
        uri: string;
        identifier: string;
    };
}

// TODO BB-1127 Is it okay to rename base interface?
export interface IDrillableItemSimple {
    uri?: string;
    identifier?: string;
    title?: string; // FIXME This must not be here
}

export interface IDrillableItemComposedFrom {
    composedFrom: IDrillableItemSimple[];
}

// Internal precursor to IDrillEventIntersectionElement
// TODO: Refactor internal drilling functions and replace with IDrillEventIntersectionElement
// XXX: BB-1127 This is only one SDK public interface
export type IDrillableItem = IDrillableItemSimple | IDrillableItemComposedFrom;

export type IDrillEventCallback = (event: IDrillEvent) => void | boolean;

// Consider refactoring and removing this as a separate type
export interface IDrillableItemLocalId extends IDrillableItemSimple {
    localIdentifier: AFM.Identifier;
}

export type IDrillItem = IDrillableItem | IDrillableItemLocalId;

// Internal precursor to IDrillEventIntersectionElement
// TODO: Refactor internal drilling functions and replace with IDrillEventIntersectionElement
export interface IDrillIntersection {
    id: string;
    title?: string;
    value?: Execution.DataValue;
    name?: string;
    uri: string;
    identifier: AFM.Identifier;
}

// TODO BB-1127 This must be renamed to isDrillItemLocalId
export function isDrillableItemLocalId(item: IDrillItem): item is IDrillableItemLocalId {
    return (item as IDrillableItemLocalId).localIdentifier !== undefined;
}

export function isDrillableItemComposedFrom(item: IDrillableItem): item is IDrillableItemComposedFrom {
    return (item as IDrillableItemComposedFrom).composedFrom !== undefined;
}

export type IDrillablePredicate = (header: IDrillableItem, afm: IAfm) => boolean;
