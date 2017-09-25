import * as React from 'react';
import * as sdk from 'gooddata';
import noop = require('lodash/noop');
import isEqual = require('lodash/isEqual');
import identity = require('lodash/identity');
import { Afm, DataSource, MetadataSource, UriMetadataSource, UriAdapter } from '@gooddata/data-layer';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { ErrorStates } from '../../constants/errorStates';
import { BaseChart, ChartTypes, IChartConfig } from '../core/base/BaseChart';
import { Table } from '../core/Table';
import { IEvents } from '../../interfaces/Events';
import { visualizationPropTypes } from '../../proptypes/Visualization';
import { IDrillableItem } from '../../interfaces/DrillableItem';

function isDateFilter(filter: Afm.IFilter): filter is Afm.IDateFilter {
    return filter.type === 'date';
}

function isAttributeFilter(filter: Afm.IFilter): filter is Afm.IAttributeFilter {
    return filter.type === 'attribute';
}

function getDateFilter(filters: Afm.IFilter[]): Afm.IDateFilter {
    return filters.filter(isDateFilter).shift();
}

function getAttributeFilters(filters: Afm.IFilter[]): Afm.IAttributeFilter[] {
    return filters.filter(isAttributeFilter);
}

export interface IVisualizationProps extends IEvents {
    projectId: string;
    uri?: string;
    identifier?: string;
    locale?: string;
    config?: IChartConfig;
    filters?: Afm.IFilter[];
    drillableItems?: IDrillableItem[];
    height?: number;
    minHeight?: number;
    width?: number;
    uriResolver?: (projectId: string, uri?: string, identifier?: string) => Promise<string>;
}

export interface IVisualizationExecInfo {
    type: string;
    dataSource: DataSource.IDataSource;
    metadataSource: MetadataSource.IMetadataSource;
}

export interface IVisualizationState {
    isLoading: boolean;
}

function uriResolver(projectId: string, uri?: string, identifier?: string): Promise<string> {
    if (uri) {
        return Promise.resolve(uri);
    }

    if (!identifier) {
        return Promise.reject('Neither uri or identifier specified');
    }

    return sdk.md.getObjectUri(projectId, identifier);
}

export class Visualization extends React.Component<IVisualizationProps, IVisualizationState> {
    static propTypes = visualizationPropTypes;
    static defaultProps = {
        onError: noop,
        filters: [],
        height: null,
        width: null,
        minHeight: 400,
        uriResolver
    };

    private visualizationUri: string;
    private type: string;
    private uriAdapter: UriAdapter;
    private metadataSource: MetadataSource.IMetadataSource;
    private dataSource: DataSource.IDataSource;

    private subscription: Subscription;
    private subject: Subject<Promise<IVisualizationExecInfo>>;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };

        this.visualizationUri = props.uri;

        const errorHandler = props.onError;

        this.subject = new Subject();
        this.subscription = this.subject
            // Unwraps values from promise and ensures that the latest result is returned
            // Used to be called `flatMapLatest`
            .switchMap<Promise<IVisualizationExecInfo>, IVisualizationExecInfo>(identity)

            .subscribe(
                ({ type, dataSource, metadataSource }) => {
                    this.type = type;
                    this.dataSource = dataSource;
                    this.metadataSource = metadataSource;
                    this.setState({ isLoading: false });
                },
                () => errorHandler(ErrorStates.NOT_FOUND)
            );
    }

    componentDidMount() {
        const { projectId, uri, identifier, filters } = this.props;

        this.uriAdapter = new UriAdapter(sdk, projectId);
        this.visualizationUri = uri;

        this.prepareDataSources({
            projectId,
            identifier,
            filters
        });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
        this.subject.unsubscribe();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.hasChangedProps(nextProps) || (this.state.isLoading !== nextState.isLoading);
    }

    public hasChangedProps(nextProps, propKeys = Object.keys(visualizationPropTypes)): boolean {
        return propKeys.some(propKey => !isEqual(this.props[propKey], nextProps[propKey]));
    }

    public componentWillReceiveProps(nextProps) {
        const hasInvalidResolvedUri = this.hasChangedProps(nextProps, ['uri', 'projectId', 'identifier']);
        const hasInvalidDatasource = hasInvalidResolvedUri || this.hasChangedProps(nextProps, ['filters']);
        if (hasInvalidDatasource) {
            this.setState({
                isLoading: true
            });
            const { projectId, identifier, filters } = nextProps;
            const options = {
                projectId,
                identifier,
                filters
            };
            if (hasInvalidResolvedUri) {
                this.visualizationUri = nextProps.uri;
                this.metadataSource = null;
            }
            this.prepareDataSources(options);
        }
    }

    private prepareDataSources({
        projectId,
        identifier,
        filters = [] as Afm.IFilter[]
    }) {
        const promise = this.props.uriResolver(projectId, this.visualizationUri, identifier)
            .then((visualizationUri) => {
                this.visualizationUri = visualizationUri;
                const dateFilter = getDateFilter(filters);
                const attributeFilters = getAttributeFilters(filters);
                return this.uriAdapter.createDataSource({ uri: this.visualizationUri, attributeFilters, dateFilter })
                    .then((dataSource) => {
                        this.metadataSource = this.metadataSource || new UriMetadataSource(sdk, visualizationUri);

                        return this.metadataSource.getVisualizationMetadata()
                            .then(({ metadata }) => {
                                return {
                                    type: metadata.content.type,
                                    dataSource,
                                    metadataSource: this.metadataSource
                                };
                            });
                    });
            });

        this.subject.next(promise);
    }

    public render() {
        const { dataSource, metadataSource, type } = this;
        if (!dataSource || !metadataSource || !type) {
            return null;
        }

        const {
            drillableItems,
            onError,
            onLoadingChanged,
            locale,
            config,
            height,
            width
        } = this.props;

        // only use default minHeight if height is not set
        const minHeight = height !== null ? null : this.props.minHeight;

        const minHeightCls = minHeight !== null ? 'visualisation-has-minHeight' : '';

        const minHeightStyle = minHeight !== null ? {
            flex: '1 0 ' + minHeight + 'px',
            display: 'flex',
            height: minHeight,
            flexDirection: 'column'
        } : {};

        const style = {
            height,
            width,
            ...minHeightStyle
        };

        return <div style={{ display: 'flex', flexDirection: 'column', height: height !== null ? height : '100%' }}>
            <div style={style} className={minHeightCls}>
                { type === 'table'
                    ? <Table
                        dataSource={dataSource}
                        metadataSource={metadataSource}
                        drillableItems={drillableItems}
                        onError={onError}
                        onLoadingChanged={onLoadingChanged}
                        locale={locale}
                    />
                    : <BaseChart
                        dataSource={dataSource}
                        metadataSource={metadataSource}
                        drillableItems={drillableItems}
                        onError={onError}
                        onLoadingChanged={onLoadingChanged}
                        type={type as ChartTypes}
                        locale={locale}
                        config={config}
                    />
                }
            </div>
        </div>;
    }
}
