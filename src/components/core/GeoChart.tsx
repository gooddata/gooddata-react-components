// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";

import { Execution } from "@gooddata/typings";

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";
import {
    commonDefaultProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import { createPushPinDataLayer } from "./geoChart/geoChartDataLayers";
import { createPushPinDataSource } from "./geoChart/geoChartDataSource";
import GeoChartLegendRenderer, { IChartLegendProps } from "./geoChart/GeoChartLegendRenderer";
import GeoChartRenderer, { IChartProps } from "./geoChart/GeoChartRenderer";

import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { LoadingComponent } from "../simple/LoadingComponent";
import { DEFAULT_DATA_SOURCE_NAME } from "../../constants/geoChart";
import { IGeoConfig } from "../../interfaces/GeoChart";
import { getGeoDataIndex } from "../../helpers/geoChart";

export interface IChartHTMLElement extends HTMLDivElement {
    getChart(): mapboxgl.Map;
    getChartRef(): HTMLDivElement;
}

export function renderChart(props: IChartProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IChartLegendProps): React.ReactElement {
    return <GeoChartLegendRenderer {...props} />;
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    config?: IGeoConfig;
    execution: Execution.IExecutionResponses;
    chartRenderer(props: IChartProps): React.ReactElement;
    legendRenderer(props: IChartLegendProps): React.ReactElement;
}

export type IGeoChartInnerProps = ICoreGeoChartProps &
    ILoadingInjectedProps &
    IDataSourceProviderInjectedProps &
    WrappedComponentProps;

/**
 * Geo Chart react component
 */
export class GeoChartInner extends BaseVisualization<IGeoChartInnerProps, {}> {
    public static defaultProps: Partial<IGeoChartInnerProps> = {
        ...commonDefaultProps,
        chartRenderer: renderChart,
        legendRenderer: renderLegend,
    };

    private chartRef: IChartHTMLElement;

    public renderVisualization() {
        return (
            <div className="gd-geo-component s-gd-geo-component">
                {this.renderChart()}
                {this.renderLegend()}
                {this.renderLoadingOverlay()}
            </div>
        );
    }

    private renderChart = (): React.ReactElement => {
        const { config, chartRenderer } = this.props;
        const chartProps = {
            config,
            mapLoaded: this.setupMap,
            ref: this.setChartRef,
        };
        return chartRenderer(chartProps);
    };

    private renderLegend = (): React.ReactElement => {
        const { legendRenderer } = this.props;
        const legendProps = {
            domProps: {},
        };
        return legendRenderer(legendProps);
    };

    private renderLoadingOverlay = (): React.ReactElement => {
        if (this.props.isLoading) {
            return <LoadingComponent />;
        }
        return null;
    };

    //
    // getters / setters / manipulators
    //

    private setChartRef = (chartRef: IChartHTMLElement) => {
        this.chartRef = chartRef;
    };

    //
    // working with data
    //

    private setupMap = (): void => {
        const {
            execution: { executionResult },
            config: { mdObject: { buckets = [] } = {} },
        } = this.props;

        if (!this.chartRef) {
            return;
        }

        const chart = this.chartRef.getChart();
        const geoDataIndex = getGeoDataIndex(buckets);

        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushPinDataSource(executionResult, geoDataIndex));
        chart.addLayer(createPushPinDataLayer(DEFAULT_DATA_SOURCE_NAME, executionResult, geoDataIndex));
    };
}

export const GeoChart = visualizationLoadingHOC(GeoChartInner, true);
