// (C) 2007-2020 GoodData Corporation
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
    XirrType,
    VisualizationTypes,
} from "../constants/visualizationTypes";
import { IGeoLngLat } from "../interfaces/GeoChart";
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
    return arg.type === VisualizationTypes.TABLE;
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

export function isDrillEventContextHeadlineExtended(
    arg: IDrillEventContextBase,
): arg is IDrillEventContextHeadlineExtended {
    return arg.type === VisualizationTypes.HEADLINE;
}

// Drill context for XIRR
export interface IDrillEventContextXirrBase {
    type: XirrType;
    element: HeadlineElementType; // XIRR uses Headline internally, so its drill context is the same as that of Headline
    value: string;
}
export interface IDrillEventContextXirr extends IDrillEventContextXirrBase, IDrillEventIntersection {}
export interface IDrillEventContextXirrExtended
    extends IDrillEventContextXirrBase,
        IDrillEventIntersectionExtended {}

export function isDrillEventContextXirrExtended(
    arg: IDrillEventContextBase,
): arg is IDrillEventContextXirrExtended {
    return arg.type === VisualizationTypes.XIRR;
}

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

export interface IGeoDrillEvent extends IDrillEventContextExtended {
    color?: number; // geo chart: color value of the drilled pin
    location?: IGeoLngLat; // geo chart: location of the drilled pin
    locationName?: string; // geo chart: location name of the drilled pin
    segmentBy?: string; // geo chart: segmentBy of the drilled pin
    size?: number; // geo chart: size value of the drilled pin
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
