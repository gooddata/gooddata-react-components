// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import Measure, { Rect } from "react-measure";
import * as cx from "classnames";

import isEmpty = require("lodash/isEmpty");

import FluidLegend from "./FluidLegend";
import StaticLegend from "./StaticLegend";
import { ChartType } from "../../../../constants/visualizationTypes";
import { isComboChart, isHeatmap } from "../../utils/common";
import HeatmapLegend from "./HeatmapLegend";
import { IntlWrapper } from "../../../core/base/IntlWrapper";
import {
    IntlTranslationsProvider,
    ITranslationsComponentProps,
} from "../../../core/base/TranslationsProvider";
import { getComboChartSeries, transformToDualAxesSeries } from "./helpers";

export interface ILegendProps {
    responsive?: boolean;
    interactive?: boolean;
    legendItemsEnabled?: any[];
    height?: number;
    position: string;
    chartType: ChartType;
    series: any;
    format?: string;
    locale?: string;
    showFluidLegend?: boolean;
    onItemClick(item: any): void;
    validateOverHeight(legendClient: Rect): void;
}

export interface ILegendState {
    showFluid: boolean;
}

export default class Legend extends React.PureComponent<ILegendProps, ILegendState> {
    public static defaultProps = {
        responsive: false,
        interactive: true,
        legendItemsEnabled: [] as any,
        height: 0,
        showFluidLegend: false,
        isLegendOverHeight: false,
    };

    constructor(props: ILegendProps) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
    }

    public onItemClick(item: any) {
        const { interactive, onItemClick } = this.props;
        if (interactive) {
            onItemClick(item);
        }
    }

    public getSeries() {
        const { series, legendItemsEnabled, chartType } = this.props;

        const seriesWithVisibility = series.map((seriesItem: any) => {
            const isVisible = legendItemsEnabled[seriesItem.legendIndex];
            return {
                ...seriesItem,
                isVisible,
            };
        });

        if (isComboChart(chartType)) {
            return getComboChartSeries(seriesWithVisibility);
        }

        return transformToDualAxesSeries(seriesWithVisibility, chartType);
    }

    public renderFluid() {
        const { chartType } = this.props;

        return (
            <Measure client={true}>
                {({ measureRef, contentRect }: any) => {
                    const usedWidth =
                        contentRect.client && contentRect.client.width
                            ? Math.floor(contentRect.client.width)
                            : 0;
                    return (
                        <div className="viz-fluid-legend-wrap" ref={measureRef}>
                            <FluidLegend
                                series={this.getSeries()}
                                chartType={chartType}
                                interactive={this.props.interactive}
                                onItemClick={this.onItemClick}
                                containerWidth={usedWidth}
                            />
                        </div>
                    );
                }}
            </Measure>
        );
    }

    public renderStatic() {
        const { chartType, position, height, format, locale, responsive, interactive } = this.props;

        const classNames = cx("viz-static-legend-wrap", `position-${position}`);

        return (
            <Measure client={true}>
                {({ measureRef, contentRect }: any) => {
                    const measuredHeight =
                        contentRect.client && contentRect.client.height
                            ? Math.floor(contentRect.client.height)
                            : 0;
                    const usedHeight = height || measuredHeight;

                    if (!isEmpty(contentRect.client)) {
                        this.props.validateOverHeight(contentRect.client);
                    }

                    return (
                        <div className={classNames} ref={measureRef}>
                            <StaticLegend
                                series={this.getSeries()}
                                chartType={chartType}
                                interactive={interactive}
                                onItemClick={this.onItemClick}
                                position={position}
                                format={format}
                                locale={locale}
                                responsive={responsive}
                                containerHeight={usedHeight}
                            />
                        </div>
                    );
                }}
            </Measure>
        );
    }

    public render() {
        const { responsive, showFluidLegend, chartType } = this.props;

        const fluidLegend = responsive && showFluidLegend;

        if (isHeatmap(chartType)) {
            return this.renderHeatmapLegend();
        }

        if (fluidLegend) {
            return this.renderFluid();
        }

        return this.renderStatic();
    }

    private renderHeatmapLegend() {
        const { locale, format, responsive, position } = this.props;
        const { showFluidLegend } = this.props;
        const series = this.getSeries();
        const isSmall = responsive && showFluidLegend;

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(props: ITranslationsComponentProps) => (
                        <HeatmapLegend
                            series={series}
                            format={format}
                            isSmall={isSmall}
                            numericSymbols={props.numericSymbols}
                            position={position}
                        />
                    )}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}
