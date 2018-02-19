import * as React from 'react';
import noop = require('lodash/noop');
import { Execution } from '@gooddata/typings';
import { Visualization } from '@gooddata/indigo-visualizations';

import { IBaseVisualizationProps, IBaseVisualizationState, BaseVisualization } from './BaseVisualization';

import { IntlWrapper } from './IntlWrapper';
import { IVisualizationProperties } from '../../../interfaces/VisualizationProperties';
import { ChartType } from '../../../constants/visualizationTypes';
import { ErrorStates } from '../../../constants/errorStates';
import { IntlTranslationsProvider, ITranslationsComponentProps } from './TranslationsProvider';
import { IDataSourceProviderInjectedProps } from '../../afm/DataSourceProvider';
import { fixEmptyHeaderItems } from './utils/fixEmptyHeaderItems';

export interface ILegendConfig {
    enabled?: boolean;
    position?: 'top' | 'left' | 'right' | 'bottom';
    responsive?: boolean;
}

export interface IChartConfig {
    colors?: string[];
    legend?: ILegendConfig;
    limits?: {
        series?: number,
        categories?: number
    };
}

export interface ICommonChartProps extends IBaseVisualizationProps {
    config?: IChartConfig;
    height?: number;
    environment?: string;
    visualizationProperties?: IVisualizationProperties;
}

export type IChartProps = ICommonChartProps & IDataSourceProviderInjectedProps;

export interface IBaseChartProps extends IChartProps {
    type: ChartType;
    visualizationComponent?: React.ComponentClass<any>; // for testing
}

const defaultErrorHandler = (error: any) => {
    if (error && error.status !== ErrorStates.OK) {
        console.error(error); // tslint:disable-line:no-console
    }
};

export class BaseChart extends BaseVisualization<IBaseChartProps, IBaseVisualizationState> {
    public static defaultProps: Partial<IBaseChartProps> = {
        resultSpec: {},
        onError: defaultErrorHandler,
        ErrorComponent: null,
        LoadingComponent: null,
        onLoadingChanged: noop,
        pushData: noop,
        drillableItems: [],
        onFiredDrillEvent: noop,
        config: {},
        visualizationProperties: null,
        visualizationComponent: Visualization
    };

    constructor(props: IBaseChartProps) {
        super(props);

        this.onNegativeValues = this.onNegativeValues.bind(this);

        this.initSubject();
    }

    public componentWillUnmount() {
        this.subject.unsubscribe();
        this.onLoadingChanged = noop;
        this.onError = noop;
        this.initDataLoading = noop;
    }

    protected renderVisualization(): JSX.Element {
        const { result } = this.state;
        const {
            afterRender,
            height,
            locale,
            config,
            type
        } = this.props;
        const {
            executionResponse,
            executionResult
        } = (result as Execution.IExecutionResponses);

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(translationProps: ITranslationsComponentProps) => {
                        const fixedExecutionResult = fixEmptyHeaderItems(
                            executionResult,
                            translationProps.emptyHeaderString
                        );

                        return (
                            <this.props.visualizationComponent
                                executionRequest={{
                                    afm: this.props.dataSource.getAfm(),
                                    resultSpec: this.props.resultSpec
                                }}
                                executionResponse={executionResponse.executionResponse}
                                executionResult={fixedExecutionResult.executionResult}
                                height={height}
                                config={{ ...config, type }}
                                afterRender={afterRender}
                                onDataTooLarge={this.onDataTooLarge}
                                onNegativeValues={this.onNegativeValues}
                                drillableItems={this.props.drillableItems}
                                onFiredDrillEvent={this.props.onFiredDrillEvent}
                                numericSymbols={translationProps.numericSymbols}
                            />
                        );
                    }}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }

    private onNegativeValues() {
        this.onError(ErrorStates.NEGATIVE_VALUES);
    }
}
