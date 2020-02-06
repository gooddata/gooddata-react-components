// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import * as invariant from "invariant";
import isEqual = require("lodash/isEqual");

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";
import { geoValidatorHOC } from "./base/GeoValidatorHOC";
import {
    commonDefaultProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import GeoChartLegendRenderer, { IGeoChartLegendRendererProps } from "./geoChart/GeoChartLegendRenderer";
import GeoChartRenderer, { IGeoChartRendererProps } from "./geoChart/GeoChartRenderer";

import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { DEFAULT_DATA_POINTS_LIMIT } from "../../constants/geoChart";
import { IGeoConfig, IGeoData } from "../../interfaces/GeoChart";
import { getGeoData, isDataOfReasonableSize } from "../../helpers/geoChart";
import { TOP } from "../visualizations/chart/legend/PositionTypes";

export function renderChart(props: IGeoChartRendererProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IGeoChartLegendRendererProps): React.ReactElement {
    return <GeoChartLegendRenderer {...props} />;
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    legendPostion?: string;
    config?: IGeoConfig;
    chartRenderer?: (props: IGeoChartRendererProps) => React.ReactElement;
    legendRenderer?: (props: IGeoChartLegendRendererProps) => React.ReactElement;
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
        legendPostion: TOP,
    };

    public componentDidUpdate(prevProps: IGeoChartInnerProps) {
        if (!isEqual(this.props.execution, prevProps.execution)) {
            this.validateData();
        }
    }

    public componentDidMount() {
        this.validateData();
    }

    public renderVisualization() {
        return (
            <div className="gd-geo-component s-gd-geo-component">
                {this.renderLegend()}
                {this.renderChart()}
            </div>
        );
    }

    private renderChart = (): React.ReactElement => {
        const { config, chartRenderer, execution, afterRender } = this.props;
        const chartProps = {
            config,
            execution,
            afterRender,
        };
        return chartRenderer(chartProps);
    };

    private renderLegend = (): React.ReactElement => {
        const { config, execution, legendRenderer, locale, legendPostion: position } = this.props;
        const legendProps = {
            config,
            execution,
            locale,
            position,
        };
        return legendRenderer(legendProps);
    };

    private validateData = (): void => {
        const {
            config: { limit = DEFAULT_DATA_POINTS_LIMIT, mdObject: { buckets = [] } = {} },
            execution,
            onDataTooLarge,
        } = this.props;

        if (!execution) {
            return;
        }

        const geoData: IGeoData = getGeoData(buckets, execution.executionResponse.dimensions);
        if (!isDataOfReasonableSize(execution.executionResult, geoData, limit)) {
            // always force onDataTooLarge error handling
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            return onDataTooLarge();
        }
    };
}

export const GeoChart = geoValidatorHOC(visualizationLoadingHOC(GeoChartInner, true));
