// (C) 2019-2020 GoodData Corporation
import * as React from "react";

import { IBaseChartProps, IChartProps } from "../components/core/base/BaseChart";
import { ITableProps } from "../components/core/PureTable";
import { ICommonVisualizationProps } from "../components/core/base/VisualizationLoadingHOC";
import { IDataSourceProviderInjectedProps } from "../components/afm/DataSourceProvider";
import { IPivotTableProps } from "../components/core/PivotTable";
import { ICoreGeoChartProps } from "../components/core/GeoChart";

export interface ICoreComponents {
    BaseChart: React.ComponentClass<IBaseChartProps>;
    Headline: React.ComponentClass<ICommonVisualizationProps & IDataSourceProviderInjectedProps>;
    Table: React.ComponentClass<ITableProps & IDataSourceProviderInjectedProps>;
    PivotTable: React.ComponentClass<IPivotTableProps>;
    ScatterPlot: React.ComponentClass<IChartProps>;
    FunnelChart: React.ComponentClass<IChartProps>;
    GeoPushpinChart: React.ComponentClass<ICoreGeoChartProps>;
}
