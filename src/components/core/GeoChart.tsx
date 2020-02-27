// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import * as invariant from "invariant";
import get = require("lodash/get");
import unionBy = require("lodash/unionBy");
import isEqual = require("lodash/isEqual");
import { Execution } from "@gooddata/typings";
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
import { calculateLegendData } from "./geoChart/geoChartDataSource";
import { DEFAULT_DATA_POINTS_LIMIT, EMPTY_SEGMENT_ITEM } from "../../constants/geoChart";
import {
    IGeoConfig,
    IGeoData,
    IPushpinCategoryLegendItem,
    IValidationResult,
} from "../../interfaces/GeoChart";
import { DEFAULT_COLORS } from "../visualizations/utils/color";
import {
    getGeoData,
    isDataOfReasonableSize,
    getFormatFromExecutionResponse,
    getGeoAttributeHeaderItems,
} from "../../helpers/geoChart";
import { TOP } from "../visualizations/chart/legend/PositionTypes";
import { getHeaderItemName } from "../../helpers/executionResultHelper";

export function renderChart(props: IGeoChartRendererProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IGeoChartLegendRendererProps): React.ReactElement {
    return <GeoChartLegendRenderer {...props} />;
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    legendPosition?: string;
    config?: IGeoConfig;
    chartRenderer?: (props: IGeoChartRendererProps) => React.ReactElement;
    legendRenderer?: (props: IGeoChartLegendRendererProps) => React.ReactElement;
}

export type IGeoChartInnerProps = ICoreGeoChartProps &
    ILoadingInjectedProps &
    IDataSourceProviderInjectedProps &
    WrappedComponentProps;

export interface IGeoChartInnerState {
    enabledLegendItems: IPushpinCategoryLegendItem[];
}
export interface IGeoChartInnerOptions {
    geoData: IGeoData;
    segmentData: IPushpinCategoryLegendItem[];
}
/**
 * Geo Chart react component
 */
export class GeoChartInner extends BaseVisualization<IGeoChartInnerProps, IGeoChartInnerState> {
    public static defaultProps: Partial<IGeoChartInnerProps> = {
        ...commonDefaultProps,
        chartRenderer: renderChart,
        legendRenderer: renderLegend,
        legendPosition: TOP,
        config: {
            mapboxToken: "",
        },
    };

    private geoChartOptions: IGeoChartInnerOptions;

    public componentDidUpdate(prevProps: IGeoChartInnerProps) {
        if (!this.shouldGeoChartUpdate(prevProps)) {
            return;
        }
        const {
            config: { mdObject: { buckets = [] } = {} },
            execution: {
                executionResponse: { dimensions },
            },
            onDataTooLarge,
        } = this.props;

        const geoData: IGeoData = getGeoData(buckets, dimensions);
        const { isDataTooLarge } = this.validateData(geoData);
        if (isDataTooLarge) {
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            return onDataTooLarge();
        }
        this.geoChartOptions = this.getGeoChartInnerOptions(geoData);
        const {
            segmentData,
            geoData: { segment },
        } = this.geoChartOptions;
        if (segment) {
            this.setState({
                enabledLegendItems: [...segmentData],
            });
        }
    }

    public renderVisualization() {
        return (
            <div className="gd-geo-component s-gd-geo-component">
                {this.renderLegend()}
                {this.renderChart()}
            </div>
        );
    }

    private shouldGeoChartUpdate = (prevProps: IGeoChartInnerProps): boolean => {
        if (!this.props.execution) {
            return false;
        }
        if (!prevProps.execution) {
            return true;
        }
        const {
            execution: { executionResponse: prevExecutionResponse },
        } = prevProps;
        const {
            execution: { executionResponse },
        } = this.props;

        return !isEqual(prevExecutionResponse, executionResponse);
    };

    private onLegendItemClick = (item: IPushpinCategoryLegendItem): void => {
        const enabledLegendItems: IPushpinCategoryLegendItem[] = this.state.enabledLegendItems.map(
            (legendItem: IPushpinCategoryLegendItem, index: number): IPushpinCategoryLegendItem => {
                if (index === item.legendIndex) {
                    return { ...item, isVisible: !item.isVisible };
                }
                return legendItem;
            },
        );
        this.setState({ enabledLegendItems });
    };

    private getSegmentSeries(data: Execution.IResultHeaderItem[]): IPushpinCategoryLegendItem[] {
        const segmentItemsUniq: Execution.IResultHeaderItem[] = unionBy(data, getHeaderItemName);
        const defaultColorsNumber = DEFAULT_COLORS.length;

        return segmentItemsUniq.map(
            (item: Execution.IResultHeaderItem, index: number): IPushpinCategoryLegendItem => {
                const segmentItemName: string = getHeaderItemName(item) || EMPTY_SEGMENT_ITEM;
                const color: string = DEFAULT_COLORS[index % defaultColorsNumber];
                return {
                    name: segmentItemName,
                    legendIndex: index,
                    color,
                    isVisible: true,
                };
            },
        );
    }

    private getGeoChartInnerOptions(geoData: IGeoData): IGeoChartInnerOptions {
        const {
            execution: { executionResult },
        } = this.props;
        const { segment } = geoData;
        const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);
        let segmentData: IPushpinCategoryLegendItem[] = [];
        if (segment) {
            const segmentAttributeHeaderItems = attributeHeaderItems[segment.index];
            segmentData = this.getSegmentSeries(segmentAttributeHeaderItems);
        }
        return {
            geoData,
            segmentData,
        };
    }

    private getLegendProps(): IGeoChartLegendRendererProps {
        const { geoChartOptions } = this;
        const {
            config,
            legendPosition: position,
            execution: { executionResult, executionResponse },
        } = this.props;

        if (!geoChartOptions) {
            return {
                config,
                position,
                geoData: {},
            };
        }
        const { geoData } = geoChartOptions;
        const { size, color, segment } = geoData;
        const { colorData, sizeData } = calculateLegendData(executionResult, geoData);
        let legendProps: IGeoChartLegendRendererProps = { config, position, geoData };

        if (sizeData) {
            const sizeFormat: string = getFormatFromExecutionResponse(size.index, executionResponse);
            legendProps = { ...legendProps, sizeData, sizeFormat };
        }

        if (colorData) {
            const colorFormat: string = getFormatFromExecutionResponse(color.index, executionResponse);
            legendProps = { ...legendProps, colorData, colorFormat };
        }

        if (segment && this.state.enabledLegendItems.length) {
            const { enabledLegendItems } = this.state;
            legendProps = {
                ...legendProps,
                segmentData: enabledLegendItems,
                onItemClick: this.onLegendItemClick,
            };
        }

        return legendProps;
    }

    private getChartProps(): IGeoChartRendererProps {
        const { geoChartOptions } = this;
        const { config, execution, afterRender } = this.props;

        if (!geoChartOptions) {
            return {
                config,
                execution,
                afterRender,
                geoData: {},
            };
        }

        const { geoData } = geoChartOptions;
        const segmentIndex: number = get(geoChartOptions, "geoData.segment.index");

        const chartProps: IGeoChartRendererProps = { config, execution, afterRender, geoData };

        if (segmentIndex) {
            const selectedSegmentItems: string[] = this.state.enabledLegendItems.reduce(
                (result: string[], item: IPushpinCategoryLegendItem): string[] => {
                    if (item.isVisible) {
                        return [...result, item.name];
                    }
                    return result;
                },
                [],
            );
            return {
                ...chartProps,
                config: { ...config, selectedSegmentItems },
            };
        }

        return chartProps;
    }

    private renderChart = (): React.ReactElement => {
        const { chartRenderer } = this.props;
        const chartProps: IGeoChartRendererProps = this.getChartProps();
        return chartRenderer(chartProps);
    };

    private renderLegend = (): React.ReactElement => {
        const { legendRenderer } = this.props;
        const legendProps: IGeoChartLegendRendererProps = this.getLegendProps();
        return legendRenderer(legendProps);
    };

    private validateData = (geoData: IGeoData): IValidationResult => {
        if (!this.props.execution) {
            return;
        }
        const {
            config: { limit = DEFAULT_DATA_POINTS_LIMIT },
            execution: { executionResult },
        } = this.props;

        return {
            isDataTooLarge: !isDataOfReasonableSize(executionResult, geoData, limit),
        };
    };
}

export const GeoChart = geoValidatorHOC(visualizationLoadingHOC(GeoChartInner, true));
