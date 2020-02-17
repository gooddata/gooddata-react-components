// (C) 2019-2020 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";
import { ISeparators } from "@gooddata/numberjs";
import { VisualizationEnvironment } from "../../components/uri/Visualization";
import { IDrillableItem } from "../../interfaces/DrillEvents";
import { OverTimeComparisonType } from "../../interfaces/OverTimeComparison";
import { ChartType } from "../../constants/visualizationTypes";
import { IColorPalette } from "../../interfaces/Config";
import * as VisEvents from "../../interfaces/Events";
import { DATE_DATASET_ATTRIBUTE } from "../constants/bucket";

export type ILocale =
    | "en-US"
    | "de-DE"
    | "es-ES"
    | "fr-FR"
    | "ja-JP"
    | "nl-NL"
    | "pt-BR"
    | "pt-PT"
    | "zh-Hans";

export interface IFeatureFlags {
    [property: string]: string | boolean | number;
}

export interface IVisConstruct {
    projectId: string;
    element: string;
    configPanelElement: string;
    callbacks: IVisCallbacks;
    environment?: VisualizationEnvironment;
    locale?: ILocale;
    featureFlags?: IFeatureFlags;
    visualizationProperties?: IVisualizationProperties;
    references?: IReferences;
}

export interface ICustomProps {
    stickyHeaderOffset?: number;
    drillableItems?: IDrillableItem[];
    totalsEditAllowed?: boolean;
}

export interface IDimensions {
    width?: number; // Note: will not be optional once we start sending it
    height: number;
}

export interface IVisProps {
    dataSource: DataLayer.DataSource.IDataSource<Execution.IExecutionResponses>;
    resultSpec: AFM.IResultSpec;
    dimensions: IDimensions;
    custom: ICustomProps;
    locale?: ILocale;
    config?: IGdcConfig;
}

export interface IVisualizationOptions {
    dateOptionsDisabled: boolean;
}

export interface IVisCallbacks extends VisEvents.IEvents {
    afterRender?(): void;
    pushData(data: any, options?: IVisualizationOptions): void;
}

export interface IBucketFilterElement {
    title: string;
    uri: string;
}

export interface IBucketFilterInterval {
    granularity: string;
    interval: string[];
    name: string;
}

export type ComparisonConditionOperator =
    | "GREATER_THAN"
    | "GREATER_THAN_OR_EQUAL_TO"
    | "LESS_THAN"
    | "LESS_THAN_OR_EQUAL_TO"
    | "EQUAL_TO"
    | "NOT_EQUAL_TO";

export interface IComparisonCondition {
    readonly comparison: {
        readonly operator: ComparisonConditionOperator;
        readonly value: number;
    };
}

export type RangeConditionOperator = "BETWEEN" | "NOT_BETWEEN";

export interface IRangeCondition {
    readonly range: {
        readonly operator: RangeConditionOperator;
        readonly from: number;
        readonly to: number;
    };
}

export type IMeasureValueFilterCondition = IComparisonCondition | IRangeCondition;

export interface IAttributeFilter {
    attribute: string;
    isInverted: boolean;
    totalElementsCount: number;
    selectedElements: Array<{
        title: string;
        uri: string;
    }>;
}

export interface IDateFilter {
    attribute: "attr.datedataset";
    overTimeComparisonType: OverTimeComparisonType;
    interval: {
        granularity: string;
        interval: [string, string] | [number, number];
        name: string;
        type: "relative" | "absolute";
    };
}

export interface IMeasureValueFilter {
    measureLocalIdentifier: string;
    condition?: IMeasureValueFilterCondition;
}

export type IBucketFilter = IAttributeFilter | IDateFilter | IMeasureValueFilter;

export function isDateFilter(filter: IBucketFilter): filter is IDateFilter {
    return !!filter && (filter as IDateFilter).attribute === DATE_DATASET_ATTRIBUTE;
}

export function isAttributeFilter(filter: IBucketFilter): filter is IAttributeFilter {
    const filterAsAttributeFilter: IAttributeFilter = filter as IAttributeFilter;
    return (
        !!filter &&
        filterAsAttributeFilter.attribute !== DATE_DATASET_ATTRIBUTE &&
        filterAsAttributeFilter.attribute !== undefined
    );
}

export function isMeasureValueFilter(filter: IBucketFilter): filter is IMeasureValueFilter {
    return !!filter && !!(filter as IMeasureValueFilter).measureLocalIdentifier;
}

export interface ISort {
    direction: "asc" | "desc";
}

export interface IBucketItem {
    localIdentifier: string;
    type?: string;
    aggregation?: boolean;
    attribute?: string;
    filters?: IBucketFilter[];
    granularity?: string;
    showInPercent?: boolean;
    showOnSecondaryAxis?: boolean;
    sort?: ISort;
    masterLocalIdentifier?: string;
    overTimeComparisonType?: OverTimeComparisonType;
    operandLocalIdentifiers?: Array<string | null> | null;
    operator?: string | null;
}

export interface IFiltersBucketItem extends IBucketItem {
    autoCreated?: boolean;
}

export interface IBucket {
    localIdentifier: string;
    items: IBucketItem[];
    totals?: VisualizationObject.IVisualizationTotal[];
    chartType?: VisualizationObject.VisualizationType;
}

export interface IFilters {
    localIdentifier: "filters";
    items: IFiltersBucketItem[];
}

export interface IRecommendations {
    [key: string]: boolean;
}

export interface IBucketUiConfig {
    accepts?: string[];
    canAddItems?: boolean;
    warningMessage?: string;
    title?: string;
    subtitle?: string;
    icon?: string;
    allowsDuplicateItems?: boolean;
    allowsReordering?: boolean;
    allowsSwapping?: boolean;
    enabled?: boolean;
    itemsLimit?: number;
    isShowInPercentEnabled?: boolean;
    isShowInPercentVisible?: boolean;
    isShowOnSecondaryAxisVisible?: boolean;
    allowShowOnSecondaryAxis?: boolean;
    allowSelectChartType?: boolean;
    allowOptionalStacking?: boolean;
}

export interface IBucketsUiConfig {
    [localIdentifier: string]: IBucketUiConfig;
}

export interface IExportUiConfig {
    supported?: boolean;
}

export interface IOpenAsReportUiConfig {
    supported?: boolean;
    warningMessage?: string;
}

export interface ICustomError {
    heading: string;
    text: string;
}

export interface IOptionalStacking {
    supported?: boolean;
    disabled?: boolean;
    stackMeasures?: boolean;
    stackMeasuresToPercent?: boolean;
    canStackInPercent?: boolean;
}

export interface ISupportedLocationIcon {
    supported?: boolean;
}

export interface IUiConfig {
    buckets: IBucketsUiConfig;
    recommendations?: IRecommendations;
    exportConfig?: IExportUiConfig;
    openAsReport?: IOpenAsReportUiConfig;
    customError?: ICustomError;
    supportedOverTimeComparisonTypes?: OverTimeComparisonType[];
    supportedChartTypes?: ChartType[];
    axis?: string;
    optionalStacking?: IOptionalStacking;
    supportedLocationIcon?: ISupportedLocationIcon;
}

export interface IVisualizationProperties {
    // This can be anything depending on a visualization type
    // perhaps consider adding: sortItems?: AFM.SortItem[]
    [property: string]: any;
}

export interface IReferencePoint {
    buckets: IBucket[];
    filters: IFilters;
    properties?: IVisualizationProperties; // properties are under plugvis creator's control
}

export interface IReferences {
    [identifier: string]: string;
}

export interface IExtendedReferencePoint {
    buckets: IBucket[];
    filters: IFilters;
    properties?: IVisualizationProperties; // properties are under plugvis creator's control
    uiConfig: IUiConfig;
}

export interface IVisualization {
    // visualizationProperties are used for visualization configuration
    update(
        props: IVisProps,
        visualizationProperties: IVisualizationProperties,
        mdObject: VisualizationObject.IVisualizationObjectContent,
        references: IReferences,
    ): void;

    unmount(): void;

    addNewDerivedBucketItems(
        referencePoint: IReferencePoint,
        newDerivedBucketItems: IBucketItem[],
    ): Promise<IReferencePoint>;

    /**
     * Called every time the reference point or the visualization class change
     * to allow visualizations to get updated ExtendedReferencePoint.
     * @param referencePoint The new value of the reference point.
     * @param previousReferencePoint The previous value of the reference point.
     * This value is only provided if the visualization class was not changed
     * (i. e. both points are related to the same visualization class).
     * @returns Promise of the new ExtendedReferencePoint.
     */
    getExtendedReferencePoint(
        referencePoint: IReferencePoint,
        previousReferencePoint?: IReferencePoint,
    ): Promise<IExtendedReferencePoint>;
}

export interface IGdcConfig {
    separators?: ISeparators;
    colorPalette?: IColorPalette;
}
