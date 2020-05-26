// (C) 2020 GoodData Corporation
import * as React from "react";
import * as cx from "classnames";
import { WrappedComponentProps } from "react-intl";
import Measure, { MeasuredComponentProps } from "react-measure";
import get = require("lodash/get");
import throttle = require("lodash/throttle");

import { ICommonChartProps } from "../base/BaseChart";
import { IColorPalette, IDataSourceProviderInjectedProps } from "../../..";
import { IGeoConfig, IGeoData, IGeoLngLat, IPushpinCategoryLegendItem } from "../../../interfaces/GeoChart";
import GeoChartRenderer, { IGeoChartRendererProps } from "./GeoChartRenderer";
import GeoChartLegendRenderer, { IGeoChartLegendRendererProps } from "./GeoChartLegendRenderer";
import { commonDefaultProps, ILoadingInjectedProps } from "../base/VisualizationLoadingHOC";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import { BOTTOM, LEFT, SUPPORTED_POSITIONS, TOP } from "../../visualizations/chart/legend/PositionTypes";
import { PositionType } from "../../visualizations/typings/legend";
import { isFluidLegendEnabled, isColorAssignmentItemChanged } from "../../../helpers/geoChart/common";
import { getAvailableLegends } from "../../../helpers/geoChart/data";
import { convertDrillableItemsToPredicates } from "../../../helpers/headerPredicate";
import { shouldShowFluid } from "../../../helpers/utils";
import { IColorAssignment } from "../../../interfaces/Config";
import { IDrillConfig } from "../../../interfaces/DrillEvents";
import { IntlWrapper } from "../base/IntlWrapper";
import { IntlTranslationsProvider, ITranslationsComponentProps } from "../base/TranslationsProvider";

export function renderChart(props: IGeoChartRendererProps): React.ReactElement {
    return <GeoChartRenderer {...props} />;
}

export function renderLegend(props: IGeoChartLegendRendererProps): React.ReactElement {
    return (
        <IntlWrapper locale={props.locale}>
            <IntlTranslationsProvider>
                {(transplationProps: ITranslationsComponentProps) => (
                    <GeoChartLegendRenderer {...props} numericSymbols={transplationProps.numericSymbols} />
                )}
            </IntlTranslationsProvider>
        </IntlWrapper>
    );
}

export interface ICoreGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    config?: IGeoConfig;
    documentObj?: Document;
    chartRenderer?: (props: IGeoChartRendererProps) => React.ReactElement;
    legendRenderer?: (props: IGeoChartLegendRendererProps) => React.ReactElement;
    onCenterPositionChanged?: (center: IGeoLngLat) => void;
    onZoomChanged?: (zoom: number) => void;
    geoChartOptions?: IGeoChartInnerOptions;
}

export type IGeoChartInnerProps = ICoreGeoChartProps &
    ILoadingInjectedProps &
    IDataSourceProviderInjectedProps &
    WrappedComponentProps;

export interface IGeoChartInnerState {
    enabledLegendItems: boolean[];
    showFluidLegend: boolean;
    colorAssignmentItem: IColorAssignment[];
}
export interface IGeoChartInnerOptions {
    geoData: IGeoData;
    categoryItems: IPushpinCategoryLegendItem[];
    colorStrategy: IColorStrategy;
    colorPalette: IColorPalette;
}
/**
 * Geo Chart react component
 */
export class GeoChartInner extends React.PureComponent<IGeoChartInnerProps, IGeoChartInnerState> {
    public static defaultProps: Partial<IGeoChartInnerProps> = {
        ...commonDefaultProps,
        documentObj: document,
        chartRenderer: renderChart,
        legendRenderer: renderLegend,
        config: {
            mapboxToken: "",
        },
    };

    public static getDerivedStateFromProps(
        nextProps: IGeoChartInnerProps,
        prevState: IGeoChartInnerState,
    ): Partial<IGeoChartInnerState> {
        const {
            geoChartOptions: { categoryItems, colorStrategy },
        } = nextProps;
        const colorAssignmentItem = colorStrategy.getColorAssignment();

        if (!isColorAssignmentItemChanged(prevState.colorAssignmentItem, colorAssignmentItem)) {
            return null;
        }

        return {
            enabledLegendItems: new Array(categoryItems.length).fill(true),
            colorAssignmentItem,
        };
    }

    private readonly throttledOnWindowResize: ReturnType<typeof throttle>;

    public constructor(props: IGeoChartInnerProps) {
        super(props);
        this.state = {
            enabledLegendItems: [],
            showFluidLegend: shouldShowFluid(props.documentObj),
            colorAssignmentItem: [],
        };
        this.throttledOnWindowResize = throttle(this.onWindowResize, 100);
    }

    public componentDidMount() {
        this.updateConfigurationPanel(this.props.geoChartOptions);
        window.addEventListener("resize", this.throttledOnWindowResize);
    }

    public componentDidUpdate() {
        this.updateConfigurationPanel(this.props.geoChartOptions);
    }

    public componentWillUnmount() {
        this.throttledOnWindowResize.cancel();
        window.removeEventListener("resize", this.throttledOnWindowResize);
    }

    public render(): React.ReactElement {
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
    ): React.ReactElement {
        const { geoChartOptions: geoChartOptionsProp } = this.props;
        const geoChartOptions = this.syncWithLegendItemStates(geoChartOptionsProp);
        const position = this.getLegendPosition();
        const classes = this.getContainerClassName(position);
        const isLegendRenderedFirst: boolean =
            position === TOP || (position === LEFT && !this.state.showFluidLegend);
        const legendComponent = this.renderLegend(height, position, geoChartOptions);

        return (
            <div className={classes} ref={measureRef}>
                {isLegendRenderedFirst && legendComponent}
                {this.renderChart(geoChartOptions)}
                {!isLegendRenderedFirst && legendComponent}
            </div>
        );
    }

    private syncWithLegendItemStates(geoChartOptions: IGeoChartInnerOptions): IGeoChartInnerOptions {
        const { categoryItems } = geoChartOptions;
        const { enabledLegendItems } = this.state;

        const withLegendItemStates = categoryItems.map(
            (item: IPushpinCategoryLegendItem, index: number): IPushpinCategoryLegendItem => ({
                ...item,
                isVisible: enabledLegendItems[index],
            }),
        );

        return {
            ...geoChartOptions,
            categoryItems: withLegendItemStates,
        };
    }

    private getContainerClassName(position: PositionType): string {
        const {
            config: { legend: { responsive = false } = {} },
        } = this.props;

        const flexDirection = this.getFlexDirection(position);
        return cx("viz-line-family-chart-wrap", "gd-geo-component", "s-gd-geo-component", {
            "responsive-legend": responsive,
            "non-responsive-legend": !responsive,
            [`flex-direction-${flexDirection}`]: true,
            "legend-position-bottom": position === BOTTOM,
        });
    }

    private getFlexDirection(position: PositionType): string {
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

    private onLegendItemClick = (item: IPushpinCategoryLegendItem): void => {
        const enabledLegendItems: boolean[] = this.state.enabledLegendItems.map(
            (legendItem: boolean, index: number): boolean => {
                if (index === item.legendIndex) {
                    return !legendItem;
                }
                return legendItem;
            },
        );
        this.setState({ enabledLegendItems });
    };

    private getLegendPosition(): PositionType {
        const {
            config: { legend: { position = TOP } = {} },
        } = this.props;
        return SUPPORTED_POSITIONS.includes(position) ? position : TOP;
    }

    private getLegendProps(
        height: number,
        position: PositionType,
        geoChartOptions: IGeoChartInnerOptions,
    ): IGeoChartLegendRendererProps {
        const {
            config: { legend: { responsive = false } = {} },
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
        const { geoData, colorStrategy, categoryItems } = geoChartOptions;
        const { segment } = geoData;
        const colorFormat = get(geoData, "color.format");
        const sizeFormat = get(geoData, "size.format");
        const propsFromData = {
            format: colorFormat || sizeFormat,
            geoData,
        };
        const colorLegendValue: string = colorStrategy.getColorByIndex(0);

        if (segment && enabledLegendItems.length) {
            return {
                ...legendProps,
                ...propsFromData,
                categoryItems,
                colorLegendValue,
            };
        }

        return {
            ...legendProps,
            ...propsFromData,
            colorLegendValue,
        };
    }

    private getChartProps(geoChartOptions: IGeoChartInnerOptions): IGeoChartRendererProps {
        const {
            config,
            dataSource,
            drillableItems,
            execution,
            afterRender,
            onCenterPositionChanged,
            onDrill,
            onFiredDrillEvent,
            onZoomChanged,
        } = this.props;
        const { geoData, colorStrategy, categoryItems } = geoChartOptions;
        const segmentIndex: number = get(geoChartOptions, "geoData.segment.index");
        const drillablePredicates = convertDrillableItemsToPredicates(drillableItems);
        const drillConfig: IDrillConfig = { afm: dataSource.getAfm(), onDrill, onFiredDrillEvent };

        const chartProps: IGeoChartRendererProps = {
            colorStrategy,
            config,
            drillableItems: drillablePredicates,
            drillConfig,
            execution,
            afterRender,
            geoData,
            onCenterPositionChanged,
            onZoomChanged,
        };

        if (segmentIndex) {
            const selectedSegmentItems: string[] = categoryItems.reduce(
                (result: string[], item: IPushpinCategoryLegendItem): string[] => {
                    if (item.isVisible) {
                        return [...result, item.uri];
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

    private renderChart = (geoChartOptions: IGeoChartInnerOptions): React.ReactElement => {
        const { chartRenderer } = this.props;
        const chartProps: IGeoChartRendererProps = this.getChartProps(geoChartOptions);
        return chartRenderer(chartProps);
    };

    private renderLegend = (
        height: number,
        position: PositionType,
        geoChartOptions: IGeoChartInnerOptions,
    ): React.ReactElement => {
        const {
            config: { legend: { enabled = true } = {} },
            legendRenderer,
        } = this.props;

        if (!enabled) {
            return null;
        }

        const legendProps: IGeoChartLegendRendererProps = this.getLegendProps(
            height,
            position,
            geoChartOptions,
        );
        return legendRenderer(legendProps);
    };

    private onWindowResize = () => {
        this.setState({
            showFluidLegend: shouldShowFluid(this.props.documentObj),
        });
    };

    private updateConfigurationPanel(geoChartOptions: IGeoChartInnerOptions): void {
        const { pushData } = this.props;
        const { categoryItems, geoData, colorStrategy, colorPalette } = geoChartOptions;
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
            colors: {
                colorAssignments: colorStrategy.getColorAssignment(),
                colorPalette,
            },
        });
    }
}
