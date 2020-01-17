// (C) 2007-2020 GoodData Corporation
import "./polyfills";
import * as AfmComponents from "./components/afm/afmComponents";
import * as VisEvents from "./interfaces/Events";
import CatalogHelper from "./helpers/CatalogHelper";
import { isEmptyResult } from "./helpers/errorHandlers";
import * as Model from "./helpers/model";
import { BaseChart as CoreBaseChart, IBaseChartProps } from "./components/core/base/BaseChart";
import { Table as CoreTable } from "./components/core/Table";
import { Headline as CoreHeadline } from "./components/core/Headline";
import { ScatterPlot as CoreScatterPlot } from "./components/core/ScatterPlot";
import { FunnelChart as CoreFunnelChart } from "./components/core/FunnelChart";
import { GeoChart as CoreGeoChart } from "./components/core/GeoChart";
import { PivotTable as CorePivotTable, IPivotTableProps } from "./components/core/PivotTable";
import { ICommonVisualizationProps } from "./components/core/base/VisualizationLoadingHOC";
import { ErrorComponent } from "./components/simple/ErrorComponent";
import { LoadingComponent } from "./components/simple/LoadingComponent";
import { Kpi } from "./components/simple/Kpi";
import { Visualization, VisualizationEnvironment } from "./components/uri/Visualization";
import { ErrorStates, ErrorCodes } from "./constants/errorStates";
import { VisualizationTypes, ChartType } from "./constants/visualizationTypes";
import { Execute } from "./execution/Execute";
import { IDrillableItem, IDrillEventExtended } from "./interfaces/DrillEvents";
import { IHeaderPredicate } from "./interfaces/HeaderPredicate";
import { IPushData, IDrillableItemPushData, IColorsData } from "./interfaces/PushData";
import { AttributeFilter } from "./components/filters/AttributeFilter/AttributeFilter";
import { AttributeElements } from "./components/filters/AttributeFilter/AttributeElements";
import { DropdownAfmWrapper as MeasureValueFilterDropdown } from "./components/filters/MeasureValueFilter/DropdownAfmWrapper";
import * as MeasureValueFilterOperators from "./constants/measureValueFilterOperators";
import * as PropTypes from "./proptypes/index";
import { generateDimensions } from "./helpers/dimensions";
import * as BucketNames from "./constants/bucketNames";
import * as MeasureTitleHelper from "./helpers/measureTitleHelper";
import * as SortsHelper from "./helpers/sorts";
import DerivedMeasureTitleSuffixFactory from "./factory/DerivedMeasureTitleSuffixFactory";
import ArithmeticMeasureTitleFactory from "./factory/ArithmeticMeasureTitleFactory";
import { IDataSourceProviderInjectedProps } from "./components/afm/DataSourceProvider";

import { BarChart } from "./components/BarChart";
import { ColumnChart } from "./components/ColumnChart";
import { BulletChart } from "./components/BulletChart";
import { LineChart } from "./components/LineChart";
import { AreaChart } from "./components/AreaChart";
import { PieChart } from "./components/PieChart";
import { Treemap } from "./components/Treemap";
import { DonutChart } from "./components/DonutChart";
import { BubbleChart } from "./components/BubbleChart";
import { PivotTable } from "./components/PivotTable";
import { Table } from "./components/Table";
import { Headline } from "./components/Headline";
import { Xirr } from "./components/Xirr";
import { ScatterPlot } from "./components/ScatterPlot";
import { ComboChart } from "./components/ComboChart";
import { FunnelChart } from "./components/FunnelChart";
import { GeoPushpinChart } from "./components/GeoPushpinChart";
import { Heatmap } from "./components/Heatmap";
import { withJsxExport } from "./components/withJsxExport";
import * as ChartConfiguration from "./interfaces/Config";
// tslint:disable-next-line:no-duplicate-imports
import { ILegendConfig, IChartConfig, IColorPalette, IColorPaletteItem } from "./interfaces/Config";
import Chart from "./components/visualizations/chart/Chart";
import ChartTransformation from "./components/visualizations/chart/ChartTransformation";
import { RuntimeError } from "./errors/RuntimeError";
import { IMeasureTitleProps, IArithmeticMeasureTitleProps } from "./interfaces/MeasureTitle";
import { OverTimeComparisonType, OverTimeComparisonTypes } from "./interfaces/OverTimeComparison";
import ColorUtils from "./components/visualizations/utils/color";
import * as HeaderPredicateFactory from "./factory/HeaderPredicateFactory";
import * as MappingHeader from "./interfaces/MappingHeader";
import { ICoreComponents } from "./interfaces/CoreComponents";
import { BucketExecutor } from "./execution/BucketExecutor";

/**
 * CoreComponents
 * A collection of BaseChart, Headline, Table, ScatterPlot, FunnelChart
 * @internal
 */
const CoreComponents: ICoreComponents = {
    BaseChart: CoreBaseChart,
    Headline: CoreHeadline,
    Table: CoreTable,
    PivotTable: CorePivotTable,
    ScatterPlot: CoreScatterPlot,
    FunnelChart: CoreFunnelChart,
    GeoPushpinChart: CoreGeoChart,
};

export * from "./components/filters/DateFilter";

export {
    AfmComponents,
    AttributeElements,
    AttributeFilter,
    MeasureValueFilterDropdown,
    MeasureValueFilterOperators,
    BarChart,
    BucketNames,
    CatalogHelper,
    Model,
    ChartType,
    ColumnChart,
    BulletChart,
    ScatterPlot,
    ComboChart,
    FunnelChart,
    GeoPushpinChart,
    CoreComponents,
    ErrorCodes,
    ErrorStates,
    ErrorComponent,
    Execute,
    BucketExecutor,
    generateDimensions,
    Headline,
    Xirr,
    IBaseChartProps,
    IPivotTableProps,
    ICommonVisualizationProps,
    IDataSourceProviderInjectedProps,
    IDrillableItem,
    IDrillEventExtended,
    ILegendConfig,
    IChartConfig,
    IColorPalette,
    IColorPaletteItem,
    IPushData,
    IDrillableItemPushData,
    IColorsData,
    isEmptyResult,
    Kpi,
    LoadingComponent,
    LineChart,
    AreaChart,
    PieChart,
    Treemap,
    BubbleChart,
    DonutChart,
    Heatmap,
    IMeasureTitleProps,
    IArithmeticMeasureTitleProps,
    MeasureTitleHelper,
    DerivedMeasureTitleSuffixFactory,
    ArithmeticMeasureTitleFactory,
    PropTypes,
    RuntimeError,
    PivotTable,
    Table,
    VisEvents,
    Visualization,
    VisualizationEnvironment,
    VisualizationTypes,
    ChartTransformation,
    Chart,
    OverTimeComparisonType,
    OverTimeComparisonTypes,
    SortsHelper,
    ChartConfiguration,
    ColorUtils,
    IHeaderPredicate,
    HeaderPredicateFactory,
    MappingHeader,
    withJsxExport,
};
