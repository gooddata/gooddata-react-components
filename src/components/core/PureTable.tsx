import * as React from 'react';
import noop = require('lodash/noop');
import {
    ResponsiveTable,
    Table as IndigoTable,
    TableTransformation
} from '@gooddata/indigo-visualizations';
import { AFM, Execution, VisualizationObject } from '@gooddata/typings';

import { IntlWrapper } from './base/IntlWrapper';
import { IntlTranslationsProvider, ITranslationsComponentProps } from './base/TranslationsProvider';
import { fixEmptyHeaderItems } from './base/utils/fixEmptyHeaderItems';
import { IVisualizationProperties } from '../../interfaces/VisualizationProperties';
import { TablePropTypes, Requireable } from '../../proptypes/Table';

import { ErrorStates } from '../../constants/errorStates';
import { VisualizationEnvironment } from '../uri/Visualization';
import { IIndexedTotalItem } from '../../interfaces/Totals';
import { convertToIndexedTotals, convertToTotals } from '../../helpers/TotalsConverter';

export { Requireable };

import { IBaseVisualizationProps, IBaseVisualizationState, BaseVisualization } from './base/BaseVisualization';

export interface ITableProps extends IBaseVisualizationProps {
    height?: number;
    maxHeight?: number;
    environment?: VisualizationEnvironment;
    stickyHeaderOffset?: number;
    totals?: VisualizationObject.IVisualizationTotal[];
    totalsEditAllowed?: boolean;
    onTotalsEdit?: Function;
    visualizationProperties?: IVisualizationProperties;
}

export interface ITableState extends IBaseVisualizationState {
    page: number;
}

const ROWS_PER_PAGE_IN_RESPONSIVE_TABLE = 9;

export type ITableDataPromise = Promise<Execution.IExecutionResponses>;

const defaultErrorHandler = (error: any) => {
    if (error && error.status !== ErrorStates.OK) {
        console.error(error); // tslint:disable-line:no-console
    }
};

export class PureTable extends BaseVisualization<ITableProps, ITableState> {
    public static defaultProps: Partial<ITableProps> = {
        resultSpec: {},
        onError: defaultErrorHandler,
        onLoadingChanged: noop,
        ErrorComponent: null,
        LoadingComponent: null,
        afterRender: noop,
        pushData: noop,
        stickyHeaderOffset: 0,
        height: null,
        maxHeight: null,
        locale: 'en-US',
        environment: 'none',
        drillableItems: [],
        totals: [],
        totalsEditAllowed: false,
        onTotalsEdit: noop,
        onFiredDrillEvent: noop,
        visualizationProperties: null
    };

    public static propTypes = TablePropTypes;

    constructor(props: ITableProps) {
        super(props);

        this.onSortChange = this.onSortChange.bind(this);
        this.onMore = this.onMore.bind(this);
        this.onLess = this.onLess.bind(this);
        this.onTotalsEdit = this.onTotalsEdit.bind(this);

        this.initSubject();
    }

    public componentWillMount() {
        this.setState({ page: 1 });
    }

    public onSortChange(sortItem: AFM.SortItem) {
        this.props.pushData({
            properties: {
                sortItems: [sortItem]
            }
        });
    }

    public onTotalsEdit(indexedTotals: IIndexedTotalItem[]) {
        const { dataSource, pushData } = this.props;

        // Short term solution (See BB-641)
        const totals = convertToTotals(indexedTotals, dataSource.getAfm());

        pushData({
            properties: {
                totals
            }
        });
    }

    public onMore({ page }: { page: number }) {
        this.setState({
            page
        });
    }

    public onLess() {
        this.setState({
            page: 1
        });
    }

    protected renderVisualization(): JSX.Element {
        const tableRenderer = this.getTableRenderer();
        return this.renderTable(tableRenderer);
    }

    private getTableRenderer() {
        const { environment, totals, maxHeight } = this.props;
        const { page } = this.state;

        if (environment === 'dashboards') {
            return (props: ITableProps) => (
                <ResponsiveTable
                    {...props}
                    onSortChange={this.onSortChange}
                    rowsPerPage={ROWS_PER_PAGE_IN_RESPONSIVE_TABLE}
                    page={page}
                    onMore={this.onMore}
                    onLess={this.onLess}
                    totals={totals}
                />
            );
        }

        return (props: ITableProps) => (
            <IndigoTable
                {...props}
                containerMaxHeight={maxHeight}
                onSortChange={this.onSortChange}
            />
        );
    }

    private renderTable(tableRenderer: Function) {
        const {
            afterRender,
            dataSource,
            drillableItems,
            height,
            maxHeight,
            locale,
            stickyHeaderOffset,
            environment,
            resultSpec,
            onFiredDrillEvent,
            totals,
            totalsEditAllowed
        } = this.props;
        const { result } = this.state;
        const {
            executionResponse,
            executionResult
        } = (result as Execution.IExecutionResponses);

        // Short term solution (See BB-641)
        const indexedTotals = convertToIndexedTotals(totals, dataSource.getAfm(), resultSpec);

        const onDataTooLarge = environment === 'dashboards' ? this.onDataTooLarge : noop;
        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(props: ITranslationsComponentProps) => (
                        <TableTransformation
                            executionRequest={{
                                afm: dataSource.getAfm(),
                                resultSpec
                            }}
                            executionResponse={executionResponse.executionResponse}
                            executionResult={
                                fixEmptyHeaderItems(executionResult, props.emptyHeaderString).executionResult
                            }
                            afterRender={afterRender}
                            config={{ stickyHeaderOffset }}
                            drillableItems={drillableItems}
                            height={height}
                            maxHeight={maxHeight}
                            onDataTooLarge={onDataTooLarge}
                            tableRenderer={tableRenderer}
                            onFiredDrillEvent={onFiredDrillEvent}
                            totals={indexedTotals}
                            totalsEditAllowed={totalsEditAllowed}
                            onTotalsEdit={this.onTotalsEdit}
                        />
                    )}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}
