// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";
import {
    commonDefaultProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import GeoChartLegendRenderer, { IChartLegendProps } from "./geoChart/GeoChartLegendRenderer";
import GeoChartRenderer, { IGeoChartRendererProps } from "./geoChart/GeoChartRenderer";

import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { IGeoConfig } from "../../interfaces/GeoChart";

export function renderChart(props: IGeoChartRendererProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IChartLegendProps): React.ReactElement {
    return <GeoChartLegendRenderer {...props} />;
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    config?: IGeoConfig;
    chartRenderer?: (props: IGeoChartRendererProps) => React.ReactElement;
    legendRenderer?: (props: IChartLegendProps) => React.ReactElement;
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

    public renderVisualization() {
        return (
            <div className="gd-geo-component s-gd-geo-component">
                {this.renderChart()}
                {this.renderLegend()}
            </div>
        );
    }

    private renderChart = (): React.ReactElement => {
        const { config, chartRenderer, execution } = this.props;
        const chartProps = {
            config,
            execution,
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
}

export const GeoChart = visualizationLoadingHOC(GeoChartInner, true);
