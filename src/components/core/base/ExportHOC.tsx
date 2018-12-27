// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import omit = require('lodash/omit');
import sdk, { IExportConfig } from '@gooddata/gooddata-js';
import { Execution } from '@gooddata/typings';
import { ILoadingInjectedProps } from './VisualizationLoadingHOC';
import { IDataSourceProviderInjectedProps } from '../../afm/DataSourceProvider';

export interface IExportConfigExtended extends IExportConfig {
    onExportFinished: (value: any) => void;
}

interface IExportProps {
    execution: Execution.IExecutionResponses;
    exportConfig?: IExportConfigExtended;
    projectId: string;
}

export function exportHOC<
    T extends ILoadingInjectedProps & IDataSourceProviderInjectedProps>(
    InnerComponent: React.ComponentClass<T>
): React.ComponentClass<T> {
    return class extends React.Component<T & IExportProps> {

        public static defaultProps: Partial<T> = InnerComponent.defaultProps;

        protected hasUnmounted: boolean;

        constructor(props: T & IExportProps) {
            super(props);

            this.hasUnmounted = false;
            this.exportResult = this.exportResult.bind(this);
        }

        public componentWillUnmount() {
            this.hasUnmounted = true;
            this.exportResult = () => Promise.resolve(null);
        }

        public shouldComponentUpdate(nextProps: any) {
            const { exportConfig } = nextProps;
            if (exportConfig && exportConfig !== this.props.exportConfig) {
                this.exportResult(exportConfig)
                    .then(exportConfig.onExportFinished, exportConfig.onExportFinished);
                return false;
            }
            return true;
        }

        public render() {
            const newProps = omit<T & IExportProps, any>(
                this.props,
                ['exportConfig', 'projectId']
            );
            return (
                <InnerComponent
                    key="InnerComponent"
                    {...newProps}
                />
            );
        }

        private exportResult(exportConfig: IExportConfigExtended): Promise<any> {
            const {
                execution,
                projectId
            } = this.props;

            if (this.hasUnmounted || !execution) {
                return Promise.resolve(new Error('Unknown execution'));
            }

            return sdk.report.exportResult(
                projectId,
                execution.executionResponse.links.executionResult,
                omit(exportConfig, ['onExportFinished'])
            );
        }
    };
}
