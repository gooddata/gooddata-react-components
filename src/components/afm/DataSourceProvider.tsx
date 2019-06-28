// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { SDK, factory as createSdk, DataLayer } from "@gooddata/gooddata-js";
import * as PropTypes from "prop-types";

import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import omit = require("lodash/omit");
import { AFM, Execution } from "@gooddata/typings";
import { AfmPropTypesShape, ResultSpecPropTypesShape } from "../visualizations/proptypes/execution";

import { IChartConfig } from "../../interfaces/Config";
import { IDataSource } from "../../interfaces/DataSource";
import { ISubject } from "../../helpers/async";
import { mergeSeparatorsIntoAfm } from "../../helpers/conversion";
import { setTelemetryHeaders } from "../../helpers/utils";
import { getNativeTotals } from "../visualizations/table/totals/utils";

export type IAdapterFactory = (
    sdk: SDK,
    projectId: string,
) => DataLayer.IAdapter<Execution.IExecutionResponses>;

export interface IDataSourceProviderProps {
    afm: AFM.IAfm;
    projectId: string;
    resultSpec?: AFM.IResultSpec;
    adapterFactory?: IAdapterFactory;
    sdk?: SDK;

    [p: string]: any; // other params of inner componnent, just for pass through
}

export interface IDefaultFormats {
    [localIdentifier: string]: string;
}

export interface IDataSourceProviderState {
    dataSource: IDataSource;
    resultSpec?: AFM.IResultSpec;
}

export interface IDataSourceProviderInjectedProps extends IDataSourceProviderState {
    defaultFormats?: IDefaultFormats;
    exportTitle?: string;
    updateTotals?: (totals: AFM.ITotalItem[]) => void;
}

export type IDataSourceInfoPromise = Promise<IDataSource>;
export type IGenerateDefaultDimensionsFunction = (afm: AFM.IAfm) => AFM.IDimension[];

function defaultAdapterFactory(
    sdk: SDK,
    projectId: string,
): DataLayer.IAdapter<Execution.IExecutionResponses> {
    return new DataLayer.ExecuteAfmAdapter(sdk, projectId);
}

function addDefaultDimensions(
    afm: AFM.IAfm,
    resultSpec: AFM.IResultSpec,
    generateDefaultDimensions: IGenerateDefaultDimensionsFunction,
): AFM.IResultSpec {
    return resultSpec && resultSpec.dimensions
        ? resultSpec
        : {
              dimensions: generateDefaultDimensions(afm),
              ...resultSpec,
          };
}

/**
 * dataSourceProvider
 * is a function that creates a dataSource and passes it to InnerComponent
 * @param InnerComponent: React.ComponentClass<T & IDataSourceProviderInjectedProps>
 *   a component that will be pased dataSource prop
 * @param generateDefaultDimensions - a function that returns default dimensions
 * @param componentName: string - InnerComponent actual name
 * @internal
 */
export function dataSourceProvider<T>(
    InnerComponent: React.ComponentType<T & IDataSourceProviderInjectedProps>,
    generateDefaultDimensions: IGenerateDefaultDimensionsFunction,
    componentName: string,
    exportTitle?: string,
): React.ComponentClass<IDataSourceProviderProps> {
    return class WrappedComponent extends React.Component<
        IDataSourceProviderProps,
        IDataSourceProviderState
    > {
        public static displayName = componentName ? `${componentName}WithDataSource` : "WrappedComponent";

        public static propTypes = {
            projectId: PropTypes.string,
            afm: AfmPropTypesShape.isRequired,
            resultSpec: ResultSpecPropTypesShape,
        };

        private adapter: DataLayer.IAdapter<Execution.IExecutionResponses>;
        private subject: ISubject<IDataSourceInfoPromise>;
        private sdk: SDK;
        private defaultFormats: IDefaultFormats;

        constructor(props: IDataSourceProviderProps) {
            super(props);

            this.state = {
                dataSource: null,
                resultSpec: null,
            };

            const defaultFormats = {};
            const afmMeasures = get(props, ["afm", "measures"], []);
            afmMeasures.forEach((measure: AFM.IMeasure) => {
                defaultFormats[measure.localIdentifier] = measure.format;
            });
            this.defaultFormats = defaultFormats;

            const sdk = props.sdk || createSdk();
            this.sdk = sdk.clone();
            setTelemetryHeaders(this.sdk, componentName, props);

            this.subject = DataLayer.createSubject<IDataSource>(
                dataSource => this.setState({ dataSource }),
                error => this.handleError(error),
            );

            this.updateTotals = this.updateTotals.bind(this);
        }

        public componentDidMount() {
            const { projectId, afm, config } = this.props;
            this.createAdapter(projectId);
            this.prepareDataSource(afm, config);
        }

        public componentWillReceiveProps(nextProps: IDataSourceProviderProps) {
            const { projectId, afm, config, resultSpec, sdk } = nextProps;
            if (projectId !== this.props.projectId) {
                this.createAdapter(projectId);
            }

            if (sdk && sdk !== this.sdk) {
                this.sdk = nextProps.sdk.clone();
                setTelemetryHeaders(this.sdk, componentName, nextProps);
            }

            if (
                !isEqual(afm, this.props.afm) ||
                !isEqual(resultSpec, this.props.resultSpec) ||
                projectId !== this.props.projectId
            ) {
                this.prepareDataSource(afm, config);
            }
        }

        public componentWillUnmount() {
            this.subject.unsubscribe();
        }

        // updateTotals must be called everytime totals are updated
        // to check if we need to reload datasource to get new native totals
        // @param nextTotals lists all requested totals
        public updateTotals(nextTotals: AFM.ITotalItem[]) {
            const nativeTotals = getNativeTotals(nextTotals, this.props.resultSpec);
            const afm: AFM.IAfm = this.state.dataSource.getAfm();

            const nativeTotalsRequested = nativeTotals.length > 0;
            const hasAfmNativeTotals = !!afm.nativeTotals;
            const hasUnlistedNativeTotals = nativeTotals.some(
                total =>
                    !afm.nativeTotals ||
                    !afm.nativeTotals.find(afmNativeTotal => isEqual(afmNativeTotal, total)),
            );
            if (nativeTotalsRequested && (!hasAfmNativeTotals || hasUnlistedNativeTotals)) {
                this.prepareDataSource(
                    {
                        ...afm,
                        nativeTotals,
                    },
                    this.props.config,
                );
            }
        }

        public render() {
            const { dataSource } = this.state;
            if (!dataSource) {
                return null;
            }

            // keep projectId in props for exporter
            const props: any = omit(this.props, ["afm", "resultSpec", "adapterFactory"]);
            const resultSpec = addDefaultDimensions(
                this.props.afm,
                this.props.resultSpec,
                generateDefaultDimensions,
            );
            return (
                <InnerComponent
                    {...props}
                    dataSource={dataSource}
                    defaultFormats={this.defaultFormats}
                    exportTitle={exportTitle || componentName}
                    updateTotals={this.updateTotals}
                    resultSpec={resultSpec}
                />
            );
        }

        private createAdapter(projectId: string) {
            const adapterFactory = this.props.adapterFactory || defaultAdapterFactory;
            this.adapter = adapterFactory(this.sdk, projectId);
        }

        private handleError(error: string) {
            throw error;
        }

        private prepareDataSource(afm: AFM.IAfm, config: IChartConfig) {
            const afmWithFormat = mergeSeparatorsIntoAfm(config && config.separators, afm);

            const promise = this.adapter.createDataSource(afmWithFormat);
            this.subject.next(promise);
        }
    };
}
