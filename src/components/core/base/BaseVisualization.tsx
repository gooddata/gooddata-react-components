import * as React from 'react';
import noop = require('lodash/noop');
import isEqual = require('lodash/isEqual');
import {
    DataSource,
    DataSourceUtils,
    createSubject
} from '@gooddata/data-layer';
import { AFM, Execution } from '@gooddata/typings';

import { IEvents, ILoadingState } from '../../../interfaces/Events';
import { IDrillableItem } from '../../../interfaces/DrillEvents';

import { ErrorStates } from '../../../constants/errorStates';
import { getVisualizationOptions } from '../../../helpers/options';
import { convertErrors, checkEmptyResult } from '../../../helpers/errorHandlers';
import { ISubject } from '../../../helpers/async';

export type IHeadlineDataPromise = Promise<Execution.IExecutionResponses>;

export interface IBaseVisualizationProps extends IEvents {
    dataSource: DataSource.IDataSource<Execution.IExecutionResponses>;
    resultSpec?: AFM.IResultSpec;
    locale?: string;
    drillableItems?: IDrillableItem[];
    afterRender?: Function;
    pushData?: Function;
    ErrorComponent?: React.ComponentClass<any>;
    LoadingComponent?: React.ComponentClass<any>;
}

export interface IBaseVisualizationState {
    error: string;
    result: Execution.IExecutionResponses;
    isLoading: boolean;
}

export abstract class BaseVisualization<P extends IBaseVisualizationProps, S extends IBaseVisualizationState>
    extends React.Component<P, S> {

    protected subject: ISubject<IHeadlineDataPromise>;

    constructor(props: P) {
        super(props);

        this.onLoadingChanged = this.onLoadingChanged.bind(this);
        this.onDataTooLarge = this.onDataTooLarge.bind(this);
        this.onError = this.onError.bind(this);

        this.initSubject();
    }

    public componentWillMount() {
        this.setState({
            error: ErrorStates.OK,
            result: null,
            isLoading: false
        });
    }

    public componentDidMount() {
        const { dataSource, resultSpec } = this.props;
        this.initDataLoading(dataSource, resultSpec);
    }

    public render() {
        const { result, isLoading, error } = this.state;
        const { ErrorComponent, LoadingComponent } = this.props;

        if (error !== ErrorStates.OK) {
            return ErrorComponent ? <ErrorComponent error={{ status: error }} props={this.props} /> : null;
        }
        if (isLoading || !result) {
            return LoadingComponent ? <LoadingComponent props={this.props} /> : null;
        }

        return this.renderVisualization();
    }

    public isDataReloadRequired(nextProps: P) {
        return !DataSourceUtils.dataSourcesMatch(this.props.dataSource, nextProps.dataSource)
            || !isEqual(this.props.resultSpec, nextProps.resultSpec);
    }

    public componentWillReceiveProps(nextProps: P) {
        if (this.isDataReloadRequired(nextProps)) {
            const { dataSource, resultSpec } = nextProps;
            this.initDataLoading(dataSource, resultSpec);
        }
    }

    public componentWillUnmount() {
        this.subject.unsubscribe();
        this.onLoadingChanged = noop;
        this.onError = noop;
    }

    protected abstract renderVisualization(): JSX.Element;

    protected initSubject() {
        this.subject = createSubject<Execution.IExecutionResponses>((result) => {
            this.setState({
                result
            });
            const options = getVisualizationOptions(this.props.dataSource.getAfm());
            this.props.pushData({
                result,
                options
            });
            this.onLoadingChanged({ isLoading: false });
        }, error => this.onError(error));
    }

    protected onLoadingChanged(loadingState: ILoadingState) {
        this.props.onLoadingChanged(loadingState);
        const isLoading = loadingState.isLoading;

        if (isLoading) {
            this.props.onError({ status: ErrorStates.OK });
            this.setState({
                isLoading,
                error: ErrorStates.OK
            });
        } else {
            this.setState({
                isLoading
            });
        }
    }

    protected onError(errorCode: string, dataSource = this.props.dataSource) {
        if (DataSourceUtils.dataSourcesMatch(this.props.dataSource, dataSource)) {
            const options = getVisualizationOptions(this.props.dataSource.getAfm());
            this.setState({
                error: errorCode
            });
            this.onLoadingChanged({ isLoading: false });
            this.props.onError({ status: errorCode, options });
        }
    }

    protected onDataTooLarge() {
        this.onError(ErrorStates.DATA_TOO_LARGE_TO_DISPLAY);
    }

    protected initDataLoading(
        dataSource: DataSource.IDataSource<Execution.IExecutionResponses>,
        resultSpec: AFM.IResultSpec
    ) {
        this.onLoadingChanged({ isLoading: true });
        this.setState({ result: null });

        const promise = dataSource.getData(resultSpec)
            .then(checkEmptyResult)
            .catch(convertErrors);

        this.subject.next(promise);
    }
}
