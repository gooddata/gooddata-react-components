// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import * as invariant from "invariant";
import get = require("lodash/get");
import uniq = require("lodash/uniq");
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
import { DEFAULT_DATA_POINTS_LIMIT, EMPTY_SEGMENT_ITEM } from "../../constants/geoChart";
import {
    IGeoConfig,
    IGeoData,
    IPushpinCategoryLegendItem,
    IValidationResult,
    IGeoLngLat,
} from "../../interfaces/GeoChart";
import { DEFAULT_COLORS } from "../visualizations/utils/color";
import { isDataOfReasonableSize } from "../../helpers/geoChart/common";
import { getGeoData, getGeoBucketsFromMdObject } from "../../helpers/geoChart/data";
import { TOP, BOTTOM } from "../visualizations/chart/legend/PositionTypes";

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
    onCenterPositionChanged?: (center: IGeoLngLat) => void;
    onZoomChanged?: (zoom: number) => void;
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
    categoryItems: IPushpinCategoryLegendItem[];
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

    public constructor(props: IGeoChartInnerProps) {
        super(props);
        this.state = {
            enabledLegendItems: [],
        };
    }

    public componentDidUpdate(prevProps: IGeoChartInnerProps) {
        if (!this.shouldGeoChartUpdate(prevProps)) {
            return;
        }

        const {
            config: { mdObject },
            execution,
            onDataTooLarge,
        } = this.props;
        const buckets = getGeoBucketsFromMdObject(mdObject);
        const geoData: IGeoData = getGeoData(buckets, execution);

        const { isDataTooLarge } = this.validateData(geoData);
        if (isDataTooLarge) {
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            return onDataTooLarge();
        }

        this.setGeoChartInnerOptions(geoData);

        const {
            categoryItems,
            geoData: { segment },
        } = this.geoChartOptions;

        if (segment) {
            this.setState({
                enabledLegendItems: [...categoryItems],
            });
        }
    }

    public renderVisualization() {
        const classes: string = `gd-geo-component s-gd-geo-component flex-direction-${this.getFlexDirection()}`;
        return (
            <div className={classes}>
                {this.renderLegend()}
                {this.renderChart()}
            </div>
        );
    }

    private getFlexDirection() {
        const { legendPosition: position } = this.props;

        if (position === TOP || position === BOTTOM) {
            return "column";
        }

        return "row";
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

    private getCategoryLegendItems(data: string[]): IPushpinCategoryLegendItem[] {
        const segmentItemsUniq: string[] = uniq(data);
        const defaultColorsNumber = DEFAULT_COLORS.length;

        return segmentItemsUniq.map(
            (item: string, legendIndex: number): IPushpinCategoryLegendItem => {
                const name: string = item || EMPTY_SEGMENT_ITEM;
                const color: string = DEFAULT_COLORS[legendIndex % defaultColorsNumber];
                return {
                    name,
                    legendIndex,
                    color,
                    isVisible: true,
                };
            },
        );
    }

    private setGeoChartInnerOptions(geoData: IGeoData) {
        const { segment } = geoData;
        let categoryItems: IPushpinCategoryLegendItem[] = [];
        if (segment) {
            categoryItems = this.getCategoryLegendItems(segment.data);
        }

        this.geoChartOptions = {
            geoData,
            categoryItems,
        };
    }

    private getLegendProps(): IGeoChartLegendRendererProps {
        const { geoChartOptions } = this;
        const { config, legendPosition: position } = this.props;

        if (!geoChartOptions) {
            return {
                config,
                position,
                geoData: {},
            };
        }

        const { geoData } = geoChartOptions;
        const { segment } = geoData;
        const { enabledLegendItems } = this.state;

        if (segment && enabledLegendItems.length) {
            return {
                config,
                position,
                geoData,
                categoryItems: enabledLegendItems,
                onItemClick: this.onLegendItemClick,
            };
        }

        return { config, position, geoData };
    }

    private getChartProps(): IGeoChartRendererProps {
        const { geoChartOptions } = this;
        const { config, execution, afterRender, onCenterPositionChanged, onZoomChanged } = this.props;

        if (!geoChartOptions) {
            return {
                config,
                execution,
                afterRender,
                geoData: {},
                onCenterPositionChanged,
                onZoomChanged,
            };
        }

        const { geoData } = geoChartOptions;
        const segmentIndex: number = get(geoChartOptions, "geoData.segment.index");

        const chartProps: IGeoChartRendererProps = {
            config,
            execution,
            afterRender,
            geoData,
            onCenterPositionChanged,
            onZoomChanged,
        };

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
