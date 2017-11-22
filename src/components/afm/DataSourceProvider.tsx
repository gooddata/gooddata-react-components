import * as React from 'react';
import * as GoodData from 'gooddata';

import isEqual = require('lodash/isEqual');
import omit = require('lodash/omit');
import { AFM } from '@gooddata/typings';
import {
    ExecuteAfmAdapter,
    createSubject
} from '@gooddata/data-layer';

import { IDataSource } from '../../interfaces/DataSource';
import { ISubject } from '../../helpers/async';

export interface IDataSourceProviderProps {
    afm: AFM.IAfm;
    projectId: string;
    resultSpec?: AFM.IResultSpec;

    [p: string]: any; // other params of inner componnent, just for pass through
}

export interface IDataSourceProviderInjectedProps {
    dataSource: IDataSource;
    resultSpec?: AFM.IResultSpec;
}

export type IDataSourceInfoPromise = Promise<IDataSource>;

export function dataSourceProvider<T>(
    InnerComponent: React.ComponentClass<T & IDataSourceProviderInjectedProps>,
    generateDefaultDimensions: Function
): React.ComponentClass<IDataSourceProviderProps> {
    function addDefaultDimensions(
        afm: AFM.IAfm,
        resultSpec: AFM.IResultSpec
    ): AFM.IResultSpec {
        const dimensions = generateDefaultDimensions(afm);
        return {
            dimensions,
            ...resultSpec
        };
    }

    return class WrappedComponent
        extends React.Component<IDataSourceProviderProps, IDataSourceProviderInjectedProps> {

        private adapter: ExecuteAfmAdapter;
        private subject: ISubject<IDataSourceInfoPromise>;

        constructor(props: IDataSourceProviderProps) {
            super(props);

            this.state = {
                dataSource: null,
                resultSpec: null
            };

            this.subject = createSubject<IDataSource>((dataSource) => {
                this.setState({
                    dataSource
                });
            }, error => this.handleError(error));
        }

        public componentDidMount() {
            const { projectId, afm } = this.props;
            this.createAdapter(projectId);
            this.prepareDataSource(afm);
        }

        // TODO consider using componentDidUpdate
        public componentWillReceiveProps(nextProps: IDataSourceProviderProps) {
            const { projectId, afm, resultSpec } = nextProps;
            if (projectId !== this.props.projectId) {
                this.createAdapter(projectId);
            }
            if (
                !isEqual(afm, this.props.afm)
                || !isEqual(resultSpec, this.props.resultSpec)
                || projectId !== this.props.projectId
            ) {
                this.prepareDataSource(afm);
            }
        }

        public componentWillUnmount() {
            this.subject.unsubscribe();
        }

        public render() {
            const { dataSource } = this.state;
            if (!dataSource) {
                return null;
            }

            const props = omit<any, IDataSourceProviderProps>(this.props, ['afm', 'projectId', 'resultSpec']);
            const resultSpec = addDefaultDimensions(this.props.afm, this.props.resultSpec);
            return (
                <InnerComponent
                    {...props}
                    dataSource={dataSource}
                    resultSpec={resultSpec}
                />
            );
        }

        private createAdapter(projectId: string) {
            this.adapter = new ExecuteAfmAdapter(GoodData, projectId);
        }

        private handleError(error: string) {
            throw error;
        }

        private prepareDataSource(afm: AFM.IAfm) {
            const promise = this.adapter.createDataSource(afm);
            this.subject.next(promise);
        }
    };
}
