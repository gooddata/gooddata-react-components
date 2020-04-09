// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import Measure, { MeasuredComponentProps } from "react-measure";
import * as cx from "classnames";
import * as invariant from "invariant";
import get = require("lodash/get");
import uniq = require("lodash/uniq");
import isEqual = require("lodash/isEqual");
import throttle = require("lodash/throttle");
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
import { FLUID_LEGEND_THRESHOLD } from "../../constants/legend";
import {
    IGeoConfig,
    IGeoData,
    IPushpinCategoryLegendItem,
    IValidationResult,
    IGeoLngLat,
} from "../../interfaces/GeoChart";
import { DEFAULT_COLORS } from "../visualizations/utils/color";
import { isDataOfReasonableSize, isFluidLegendEnabled } from "../../helpers/geoChart/common";
import { getAvailableLegends, getGeoData, getGeoBucketsFromMdObject } from "../../helpers/geoChart/data";
import { BOTTOM, LEFT, RIGHT, TOP, SUPPORTED_POSITIONS } from "../visualizations/chart/legend/PositionTypes";
import { PositionType } from "../visualizations/typings/legend";
import { HEIGHT_OF_SIZE_LEGEND } from "./geoChart/legends/PushpinCategoryLegend";

const HEIGHT_OF_COLOR_LEGEND = 210;

export function renderChart(props: IGeoChartRendererProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IGeoChartLegendRendererProps): React.ReactElement {
    return <GeoChartLegendRenderer {...props} />;
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    config?: IGeoConfig;
    documentObj?: Document;
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
    showFluidLegend: boolean;
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
        documentObj: document,
        chartRenderer: renderChart,
        legendRenderer: renderLegend,
        config: {
            mapboxToken: "",
        },
    };

    private geoChartOptions: IGeoChartInnerOptions;
    private throttledOnWindowResize: ReturnType<typeof throttle>;

    public constructor(props: IGeoChartInnerProps) {
        super(props);
        this.state = {
            enabledLegendItems: [],
            showFluidLegend: this.shouldShowFluidLegend(),
        };
        this.throttledOnWindowResize = throttle(this.onWindowResize.bind(this), 100);
    }

    public componentDidMount() {
        window.addEventListener("resize", this.throttledOnWindowResize);
    }

    public componentWillUnmount() {
        this.throttledOnWindowResize.cancel();
        window.removeEventListener("resize", this.throttledOnWindowResize);
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

        if (!execution) {
            return;
        }

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

        this.updateConfigurationPanel();

        if (segment) {
            this.setState({
                enabledLegendItems: [...categoryItems],
            });
        }
    }

    public renderVisualization() {
        const { height } = this.props;
        if (height !== undefined) {
            return this.renderVisualizationContent(undefined, height);
        }

        return (
            <Measure client={true}>
                {({ measureRef, contentRect }: MeasuredComponentProps) => {
                    const { client: contentRectClient } = contentRect;
                    return this.renderVisualizationContent(
                        measureRef,
                        contentRectClient && contentRectClient.height,
                    );
                }}
            </Measure>
        );
    }

    private renderVisualizationContent(
        measureRef: MeasuredComponentProps["measureRef"],
        height: number,
    ): JSX.Element {
        const {
            config: { legend: { responsive = false } = {} },
        } = this.props;
        const { showFluidLegend } = this.state;

        const position = this.getLegendPosition(height);

        const flexDirection = this.getFlexDirection(position);
        const classes: string = cx("viz-line-family-chart-wrap", "gd-geo-component", "s-gd-geo-component", {
            "responsive-legend": responsive,
            "non-responsive-legend": !responsive,
            [`flex-direction-${flexDirection}`]: true,
            "legend-position-bottom": position === BOTTOM,
        });
        const isLegendRenderedFirst: boolean = position === TOP || (position === LEFT && !showFluidLegend);

        return (
            <div className={classes} ref={measureRef}>
                {isLegendRenderedFirst && this.renderLegend(position)}
                {this.renderChart()}
                {!isLegendRenderedFirst && this.renderLegend(position)}
            </div>
        );
    }

    private getFlexDirection(position: PositionType) {
        const {
            config: { legend: { responsive = false } = {} },
        } = this.props;
        const { showFluidLegend } = this.state;
        const isFluidLegend = isFluidLegendEnabled(responsive, showFluidLegend);

        if (position === TOP || position === BOTTOM || isFluidLegend) {
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

    private getLegendPosition(height: number): PositionType {
        const {
            config: { legend: { position = TOP } = {} },
        } = this.props;

        const validatedPosition = position && SUPPORTED_POSITIONS.includes(position) ? position : TOP;

        // if height of color + size is bigger than container
        // then show legend at bottom instead of left or right
        if (height !== undefined && (validatedPosition === LEFT || validatedPosition === RIGHT)) {
            const { enabledLegendItems } = this.state;
            const { geoData = {} } = this.geoChartOptions || {};
            const { hasColorLegend, hasSizeLegend } = getAvailableLegends(enabledLegendItems, geoData);

            const heightOfColorAndSizeLegend = HEIGHT_OF_COLOR_LEGEND + HEIGHT_OF_SIZE_LEGEND;
            const isLegendOverHigh: boolean = height < heightOfColorAndSizeLegend;

            if (hasColorLegend && hasSizeLegend && isLegendOverHigh) {
                return BOTTOM;
            }
        }

        return validatedPosition;
    }

    private getLegendProps(position: PositionType): IGeoChartLegendRendererProps {
        const { geoChartOptions } = this;
        const {
            config: { legend: { responsive = false } = {} },
            height,
            locale,
        } = this.props;
        const { enabledLegendItems, showFluidLegend } = this.state;

        const legendProps = {
            height,
            locale,
            position,
            responsive,
            showFluidLegend,
            onItemClick: this.onLegendItemClick,
        };

        if (!geoChartOptions) {
            return {
                ...legendProps,
                geoData: {},
            };
        }

        const { geoData } = geoChartOptions;
        const { segment } = geoData;
        const colorFormat = get(geoData, "color.format");
        const sizeFormat = get(geoData, "size.format");
        const propsFromData = {
            format: colorFormat || sizeFormat,
            geoData,
        };

        if (segment && enabledLegendItems.length) {
            return {
                ...legendProps,
                ...propsFromData,
                categoryItems: enabledLegendItems,
            };
        }

        return {
            ...legendProps,
            ...propsFromData,
        };
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

    private renderLegend = (position: PositionType): React.ReactElement => {
        const {
            config: { legend: { enabled = true } = {} },
            legendRenderer,
        } = this.props;

        if (!enabled) {
            return null;
        }

        const legendProps: IGeoChartLegendRendererProps = this.getLegendProps(position);
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

    private onWindowResize() {
        this.setState({
            showFluidLegend: this.shouldShowFluidLegend(),
        });
    }

    private shouldShowFluidLegend() {
        const { documentObj } = this.props;
        return documentObj.documentElement.clientWidth < FLUID_LEGEND_THRESHOLD;
    }

    private updateConfigurationPanel() {
        const { pushData } = this.props;
        const { categoryItems, geoData } = this.geoChartOptions;
        const { hasCategoryLegend, hasColorLegend, hasSizeLegend } = getAvailableLegends(
            categoryItems,
            geoData,
        );
        const isLegendVisible = hasCategoryLegend || hasColorLegend || hasSizeLegend;
        pushData({
            propertiesMeta: {
                // toggle legend section
                legend_enabled: isLegendVisible,
            },
        });
    }
}

export const GeoChart = geoValidatorHOC(visualizationLoadingHOC(GeoChartInner, true));
