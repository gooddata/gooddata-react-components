// (C) 2007-2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import Highcharts from "../components/visualizations/chart/highcharts/highchartsEntryPoint";
import {
    ChartElementType,
    ChartType,
    HeadlineElementType,
    HeadlineType,
    TableElementType,
    TableType,
    VisElementType,
    VisType,
} from "../constants/visualizationTypes";
import { TableRowForDrilling } from "./Table";
import { OnFiredDrillEvent, OnDrill } from "./Events";

export interface IDrillableItemUri {
    uri: string;
}

export interface IDrillableItemIdentifier {
    identifier: string;
}

export type IDrillableItem =
    | IDrillableItemUri
    | IDrillableItemIdentifier
    | (IDrillableItemUri & IDrillableItemIdentifier);

export function isDrillableItemUri(item: IDrillableItem): item is IDrillableItemUri {
    return (item as IDrillableItemUri).uri !== undefined;
}

export function isDrillableItemIdentifier(item: IDrillableItem): item is IDrillableItemIdentifier {
    return (item as IDrillableItemIdentifier).identifier !== undefined;
}

export type IDrillEventCallback = (event: IDrillEvent) => void | boolean;
export type IDrillEventExtendedCallback = (event: IDrillEventExtended) => void;

// Intersection element
export interface IDrillEventIntersectionElement {
    id: string;
    title: string;
    header?: {
        uri: string;
        identifier: string;
    };
}

export interface IDrillIntersectionAttributeItem
    extends Execution.IResultAttributeHeaderItem,
        Execution.IAttributeHeader {}

export function isDrillIntersectionAttributeItem(
    header: DrillEventIntersectionElementHeader,
): header is IDrillIntersectionAttributeItem {
    return (header as IDrillIntersectionAttributeItem).attributeHeaderItem !== undefined;
}

export type DrillEventIntersectionElementHeader =
    | Execution.IAttributeHeader
    | Execution.IMeasureHeaderItem
    | Execution.ITotalHeaderItem
    | IDrillIntersectionAttributeItem;

export function isMappingMeasureHeaderItem(
    header: DrillEventIntersectionElementHeader,
): header is Execution.IMeasureHeaderItem {
    return (header as Execution.IMeasureHeaderItem).measureHeaderItem !== undefined;
}

export interface IDrillEventIntersectionElementExtended {
    header: DrillEventIntersectionElementHeader;
}

export interface IDrillEventIntersection {
    intersection: IDrillEventIntersectionElement[];
}

export interface IDrillEventIntersectionExtended {
    intersection: IDrillEventIntersectionElementExtended[];
}

export interface IDrillEventContextTableBase {
    type: TableType;
    element: TableElementType;
    columnIndex: number;
    rowIndex: number;
    row: any[];
}

// Drill context for tables
export interface IDrillEventContextTable extends IDrillEventContextTableBase, IDrillEventIntersection {}

export interface IDrillEventContextTableExtended
    extends IDrillEventContextTableBase,
        IDrillEventIntersectionExtended {}

export function isDrillEventContextTableExtended(
    arg: IDrillEventContextBase,
): arg is IDrillEventContextTableExtended {
    return arg.type === "table";
}
// Drill context for headline
export interface IDrillEventContextHeadlineBase {
    type: HeadlineType;
    element: HeadlineElementType;
    value: string;
}
export interface IDrillEventContextHeadline extends IDrillEventContextHeadlineBase, IDrillEventIntersection {}
export interface IDrillEventContextHeadlineExtended
    extends IDrillEventContextHeadlineBase,
        IDrillEventIntersectionExtended {}

// Drill context for chart
export interface IDrillEventContextPointBase {
    type: ChartType;
    element: ChartElementType;
    elementChartType?: ChartType;
    x?: number;
    y?: number;
    z?: number;
    value?: string;
}

export interface IDrillEventContextPoint extends IDrillEventContextPointBase, IDrillEventIntersection {}
export interface IDrillEventContextPointExtended
    extends IDrillEventContextPointBase,
        IDrillEventIntersectionExtended {}

export interface IDrillPointBase {
    x: number;
    y: number;
    type?: ChartType;
}
// Chart series point with intersection element
export interface IDrillPoint extends IDrillPointBase, IDrillEventIntersection {}

export interface IDrillPointExtended extends IDrillPointBase, IDrillEventIntersectionExtended {}

// Drill context for chart element group (multiple series + click on axis value)
// where every point has own intersection
export interface IDrillEventContextGroupBase {
    type: ChartType;
    element: ChartElementType;
}
export interface IDrillEventContextGroup extends IDrillEventContextGroupBase {
    points: IDrillPoint[];
}

export interface IDrillEventContextGroupExtended extends IDrillEventContextGroupBase {
    points: IDrillPointExtended[];
}

// Drill context for all visualization types
export interface IDrillEventContextBase {
    type: VisType; // type of visualization
    element: VisElementType; // type of visualization element drilled
    x?: number; // chart x coordinate (if supported)
    y?: number; // chart y coordinate (if supported)
    z?: number; // chart z coordinate (if supported)
    columnIndex?: number;
    rowIndex?: number;
    row?: any[]; // table row data of the drilled row
    value?: string; // cell or element value drilled
}

export interface IDrillEventContext extends IDrillEventContextBase {
    // A collection of chart series points (if available)
    points?: IDrillPoint[];
    // some drill headers that are relevant for current drill element
    intersection?: IDrillEventIntersectionElement[];
}

export interface IDrillEventContextExtended extends IDrillEventContextBase {
    // A collection of chart series points (if available)
    points?: IDrillPointExtended[];
    // some drill headers that are relevant for current drill element
    intersection?: IDrillEventIntersectionElementExtended[];
}

// IDrillEvent is a parameter of the onFiredDrillEvent is callback
export interface IDrillEvent {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContext;
}

export interface IDrillEventExtended {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContextExtended;
}

export interface IHighchartsParentTick {
    leaves: number;
    startAt: number;
    label: any;
}

export interface IHighchartsCategoriesTree {
    tick: IHighchartsParentTick;
}

export interface IHighchartsPointObject extends Highcharts.Point {
    drillIntersection: IDrillEventIntersectionElementExtended[];
    z?: number; // is missing in HCH's interface
    value?: number; // is missing in HCH's interface
}

export function isGroupHighchartsDrillEvent(event: Highcharts.DrilldownEventObject) {
    return !!event.points;
}

export interface ICellDrillEvent {
    columnIndex: number;
    rowIndex: number;
    row: TableRowForDrilling;
    intersection: IDrillEventIntersectionElement[];
}

export interface IDrillConfig {
    afm: AFM.IAfm;
    onFiredDrillEvent: OnFiredDrillEvent;
    onDrill?: OnDrill;
}
