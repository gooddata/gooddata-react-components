// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import noop = require("lodash/noop");

import { Visualization } from "../../visualizations/Visualization";

import { IntlWrapper } from "./IntlWrapper";
import { ChartType } from "../../../constants/visualizationTypes";
import { IntlTranslationsProvider, ITranslationsComponentProps } from "./TranslationsProvider";
import { IDataSourceProviderInjectedProps } from "../../afm/DataSourceProvider";
import { fixEmptyHeaderItems } from "./utils/fixEmptyHeaderItems";
import {
    ICommonVisualizationProps,
    visualizationLoadingHOC,
    ILoadingInjectedProps,
    commonDefaultProps,
} from "./VisualizationLoadingHOC";
import { ChartPropTypes, Requireable } from "../../../proptypes/Chart";
import { BaseVisualization } from "./BaseVisualization";
import { OnLegendReady } from "../../../interfaces/Events";
import { getValidColorPalette } from "../../visualizations/utils/color";
import { IChartConfig } from "../../../interfaces/Config";
export { Requireable };

export interface ICommonChartProps extends ICommonVisualizationProps {
    config?: IChartConfig;
    height?: number;
    environment?: string;
}

export type IChartProps = ICommonChartProps & IDataSourceProviderInjectedProps;

export interface IBaseChartProps extends IChartProps {
    type: ChartType;
    visualizationComponent?: React.ComponentClass<any>; // for testing
    onLegendReady?: OnLegendReady;
}

export class StatelessBaseChart extends BaseVisualization<IBaseChartProps & ILoadingInjectedProps, {}> {
    public static defaultProps: Partial<IBaseChartProps & ILoadingInjectedProps> = {
        ...commonDefaultProps,
        onDataTooLarge: noop,
        onLegendReady: noop,
        config: {},
        visualizationComponent: Visualization,
    };

    public static propTypes = ChartPropTypes;

    public renderVisualization(): JSX.Element {
        const { afterRender, height, locale, config, type, execution, onDataTooLarge, pushData } = this.props;
        const { colors, colorPalette } = config;

        const validColorPalette = getValidColorPalette(colors, colorPalette);

        const fullConfig = {
            ...config,
            type,
            colorPalette: validColorPalette,
        };

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(translationProps: ITranslationsComponentProps) => {
                        const fixedExecutionResult = fixEmptyHeaderItems(
                            execution.executionResult,
                            translationProps.emptyHeaderString,
                        );

                        return (
                            <this.props.visualizationComponent
                                executionRequest={{
                                    afm: this.props.dataSource.getAfm(),
                                    resultSpec: this.props.resultSpec,
                                }}
                                executionResponse={execution.executionResponse}
                                executionResult={fixedExecutionResult}
                                height={height}
                                config={fullConfig}
                                afterRender={afterRender}
                                onDataTooLarge={onDataTooLarge}
                                onNegativeValues={this.props.onNegativeValues}
                                drillableItems={this.props.drillableItems}
                                onFiredDrillEvent={this.props.onFiredDrillEvent}
                                onDrill={this.props.onDrill}
                                onLegendReady={this.props.onLegendReady}
                                numericSymbols={translationProps.numericSymbols}
                                locale={locale}
                                pushData={pushData}
                            />
                        );
                    }}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}

export const BaseChart = visualizationLoadingHOC(StatelessBaseChart);
