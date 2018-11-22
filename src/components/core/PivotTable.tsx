// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import * as classNames from 'classnames';
import noop = require('lodash/noop');
import get = require('lodash/get');
import isEqual = require('lodash/isEqual');
import { AFM, Execution, VisualizationObject } from '@gooddata/typings';
import {
    ColDef,
    IDatasource,
    IGetRowsParams,
    GridApi,
    GridReadyEvent,
    ICellRendererParams,
    GridOptions
} from 'ag-grid';
import { CellClassParams } from 'ag-grid/dist/lib/entities/colDef'; // this is not exported from ag-grid index

import {
    executionToAGGridAdapter,
    ROW_ATTRIBUTE_COLUMN,
    COLUMN_ATTRIBUTE_COLUMN,
    MEASURE_COLUMN,
    FIELD_SEPARATOR,
    ID_SEPARATOR,
    getIdsFromUri,
    ROW_TOTAL,
    assortDimensionHeaders,
    getParsedFields
} from '../../helpers/agGrid';

import { LoadingComponent } from '../simple/LoadingComponent';
import { IDataSourceProviderInjectedProps } from '../afm/DataSourceProvider';

import {
    visualizationLoadingHOC,
    ILoadingInjectedProps,
    commonDefaultProps,
    IGetPage
} from './base/VisualizationLoadingHOC';

import { ICommonChartProps } from './base/BaseChart';
import { IDataSource } from '../../interfaces/DataSource';
import { IPivotTableConfig } from '../../interfaces/Table';
import { BaseVisualization } from './base/BaseVisualization';
import ColumnHeader from './pivotTable/ColumnHeader';

import { getCellClassNames, getMeasureCellFormattedValue, getMeasureCellStyle } from '../../helpers/tableCell';

import {
    IDrillableItem,
    IDrillEvent,
    IDrillEventIntersectionElement,
    isDrillHeaderLocalId,
    IDrillHeader,
    IDrillHeaderBasic,
    isDrillHeaderUri, isDrillHeaderIdentifier
} from '../../interfaces/DrillEvents';

import {
    isDrillable,
    getMeasureUriOrIdentifier
} from '../visualizations/utils/drilldownEventing';

import { VisualizationTypes } from '../../constants/visualizationTypes';
import { IColumnDefOptions, IGridCellEvent, IGridHeader, IGridRow } from '../../interfaces/AGGrid';
import * as invariant from 'invariant';

import InjectedIntlProps = ReactIntl.InjectedIntlProps;
import InjectedIntl = ReactIntl.InjectedIntl;
import { AVAILABLE_TOTALS } from '../visualizations/table/totals/utils';

import '../../../styles/scss/pivotTable.scss';
import ColumnGroupHeader from './pivotTable/ColumnGroupHeader';

export interface IPivotTableProps extends ICommonChartProps {
    resultSpec?: AFM.IResultSpec;
    dataSource: IDataSource;
    totals?: VisualizationObject.IVisualizationTotal[];
    totalsEditAllowed?: boolean;
    onSortChange?: (sortBy: AFM.SortItem[]) => AFM.SortItem[];
    getPage?: IGetPage;
    cancelPagePromises?: () => void;
    pageSize?: number;
    config?: IPivotTableConfig;
}

export interface IPivotTableState {
    columnDefs: ColDef[];
    // rowData an an array of different objects depending on the content of the table.
    rowData: IGridRow[];
    execution: Execution.IExecutionResponses;
}

export interface ICustomGridOptions extends GridOptions {
    enableMenu?: boolean;
}

const AG_NUMERIC_CELL_CLASSNAME = 'ag-numeric-cell';
const AG_NUMERIC_HEADER_CLASSNAME = 'ag-numeric-header';

export const getDrillRowData = (leafColumnDefs: ColDef[], rowData: {[key: string]: any}) => {
    return leafColumnDefs.reduce((drillRow, colDef: ColDef) => {
        const { type } = colDef;
        // colDef without field is a utility column (e.g. top column label)
        if (colDef.field) {
            if (type === MEASURE_COLUMN) {
                return [...drillRow, rowData[colDef.field]];
            }
            const drillItem = get<any, IDrillHeader>(rowData, ['drillItemMap', colDef.field]);
            if (
                drillItem &&
                isDrillHeaderUri(drillItem) &&
                (type === COLUMN_ATTRIBUTE_COLUMN || type === ROW_ATTRIBUTE_COLUMN)
            ) {
                return [...drillRow, {
                    // Unlike fields, drilling data should not be sanitized, because it is not used in HTML properties
                    id: getIdsFromUri(drillItem.uri, false)[1],
                    title: rowData[colDef.field]
                }];
            }
        }
        return drillRow;
    }, []);
};

export const indexOfTreeNode = (
    node: any,
    tree: any,
    matchNode = (nodeA: any, nodeB: any) => (nodeA === nodeB),
    getChildren = (node: any) => ((node && node.children) || []),
    indexes: number[] = []
): number[] => {
    const nodes = Array.isArray(tree) ? [...tree] : [tree];
    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
        const currentNode = nodes[nodeIndex];
        // match current node
        if (matchNode(currentNode, node)) {
            return [...indexes, nodeIndex];
        }
        // check children
        const childrenMatchIndexes = indexOfTreeNode(
            node,
            getChildren(currentNode),
            matchNode,
            getChildren,
            [...indexes, nodeIndex]
        );
        if (childrenMatchIndexes !== null) {
            return childrenMatchIndexes;
        }
    }
    return null;
};

export const getTreeLeaves = (tree: any, getChildren = (node: any) => node && node.children) => {
    const leaves = [];
    const nodes = Array.isArray(tree) ? [...tree] : [tree];
    let node;
    let children;
    while (
        // tslint:disable-next-line:no-conditional-assignment ban-comma-operator
        node = nodes.shift(), children = getChildren(node),
        ((children && children.length) || (leaves.push(node) && nodes.length))
    ) {
        if (children) {
            nodes.push(...children);
        }
    }
    return leaves;
};

export const getSortItemByColId = (
    execution: Execution.IExecutionResponses,
    colId: string,
    direction: AFM.SortDirection
): AFM.IMeasureSortItem | AFM.IAttributeSortItem => {
    const dimensions: Execution.IResultDimension[] = execution.executionResponse.dimensions;
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders(dimensions);
    const fields = getParsedFields(colId);
    const [lastFieldType, lastFieldId] = fields[fields.length - 1];

    if (lastFieldType === 'a') {
        for (const header of attributeHeaders) {
            if (getIdsFromUri(header.attributeHeader.uri)[0] === lastFieldId) {
                const attributeSortItem: AFM.IAttributeSortItem = {
                    attributeSortItem: {
                        direction,
                        attributeIdentifier: header.attributeHeader.localIdentifier
                    }
                };
                return attributeSortItem;
            }
        }
        invariant(false, `could not find attribute header matching ${colId}`);
    } else if (lastFieldType === 'm') {
        const headerItem = measureHeaderItems[parseInt(lastFieldId, 10)];
        const attributeLocators = fields.slice(0, -1).map((field: string[]) => {
            // first item is type which should be always 'a'
            const [, fieldId, fieldValueId] = field;
            const attributeHeaderMatch = attributeHeaders.find((attributeHeader: Execution.IAttributeHeader) => {
                return getIdsFromUri(attributeHeader.attributeHeader.formOf.uri)[0] === fieldId;
            });
            invariant(
                attributeHeaderMatch,
                `Could not find matching attribute header to field ${field.join(ID_SEPARATOR)}`
            );
            const attributeLocatorItem: AFM.IAttributeLocatorItem = {
                attributeLocatorItem: {
                    attributeIdentifier: attributeHeaderMatch.attributeHeader.localIdentifier,
                    element: `${attributeHeaderMatch.attributeHeader.formOf.uri}/elements?id=${fieldValueId}`
                }
            };
            return attributeLocatorItem;
        });
        const measureSortItem: AFM.IMeasureSortItem = {
            measureSortItem: {
                direction,
                locators: [
                    ...attributeLocators,
                    {
                        measureLocatorItem: {
                            measureIdentifier: headerItem.measureHeaderItem.localIdentifier
                        }
                    }
                ]
            }
        };
        return measureSortItem;
    }
    invariant(false, `could not find header matching ${colId}`);
};

export interface ISortModelItem {
    colId: string;
    sort: AFM.SortDirection;
}

export const getSortsFromModel = (
    sortModel: ISortModelItem[], // AgGrid has any, but we can do better
    execution: Execution.IExecutionResponses
) => {
    return sortModel.map((sortModelItem: ISortModelItem) => {
        const { colId, sort } = sortModelItem;
        const sortHeader = getSortItemByColId(execution, colId, sort);
        invariant(sortHeader, `unable to find sort item by field ${colId}`);
        return sortHeader;
    });
};

export const getGridDataSource = (
    resultSpec: AFM.IResultSpec,
    getPage: IGetPage,
    cancelPagePromises: () => void,
    getExecution: () => Execution.IExecutionResponses,
    onSuccess: (execution: Execution.IExecutionResponses, columnDefs: IGridHeader[]) => void,
    getGridApi: () => any,
    intl: InjectedIntl,
    columnDefOptions: IColumnDefOptions = {}
): IDatasource => ({
    getRows: ({ startRow, endRow, successCallback, sortModel }: IGetRowsParams) => {
        const execution = getExecution();
        // If execution is null, this means this is a fresh dataSource and we should ignore current sortModel
        const resultSpecWithSorting = (sortModel.length > 0 && execution)
            ? {
                ...resultSpec,
                // override sorting based on sortModel
                sorts: getSortsFromModel(sortModel, execution)
            }
            : resultSpec;

        const pagePromise = getPage(
            resultSpecWithSorting,
            // column limit defaults to SERVERSIDE_COLUMN_LIMIT (1000), because 1000 columns is hopefully enough.
            [endRow - startRow, undefined],
            // column offset defaults to 0, because we do not support horizontal paging yet
            [startRow, undefined]
        );
        return pagePromise
            .then(
                (execution: Execution.IExecutionResponses | null) => {
                    if (!execution) {
                        return null;
                    }
                    const { columnDefs, rowData, rowTotals } = executionToAGGridAdapter(
                        execution,
                        resultSpecWithSorting,
                        intl,
                        {
                            addLoadingRenderer: 'loadingRenderer',
                            columnDefOptions
                        }
                    );
                    const { offset, count, total } = execution.executionResult.paging;
                    // RAIL-1130: Backend returns incorrectly total: [1, N], when count: [0, N] and offset: [0, N]
                    const lastRow = offset[0] === 0 && count[0] === 0 ? 0 : total[0];
                    onSuccess(execution, columnDefs);
                    successCallback(rowData, lastRow);
                    // set totals
                    getGridApi().setPinnedBottomRowData(rowTotals);

                    return execution;
                }
            );
    },
    destroy: () => {
        cancelPagePromises();
    }
});

export const RowLoadingElement = (props: ICellRendererParams) => {
    // rows that are still loading do not have node.id
    // pinned rows (totals) do not have node.id as well, but we want to render them using the default renderer anyway
    if (props.node.id !== undefined || props.node.rowPinned) {
        // props.value is always unformatted
        // there is props.formattedValue, but this is null for row attributes for some reason
        return <span>{props.formatValue(props.value)}</span>;
    }
    return <LoadingComponent width={36} imageHeight={8} height={26} speed={2} />;
};

export const getDrillIntersection = (
    drillItems: IDrillHeader[],
    afm: AFM.IAfm
): IDrillEventIntersectionElement[] => {
    // Drilling needs refactoring: all '' should be replaced by null (breaking change)
    // intersection consists of
        // 0..1 measure
        // 0..1 row attribute and row attribute value
        // 0..n column attribute and column attribute values
    return drillItems.map((drillItem: IDrillHeaderBasic) => {
        const uri = isDrillHeaderUri(drillItem) ? drillItem.uri : '';
        const identifier = isDrillHeaderIdentifier(drillItem) ? drillItem.identifier : '';
        return {
            // id: Measure localIdentifier or attribute identifier
            // Properties default to empty strings to maintain compatibility
            id: isDrillHeaderLocalId(drillItem) ? drillItem.localIdentifier : identifier,
            title: drillItem.title,
            header: {
                uri: isDrillHeaderLocalId(drillItem)
                    ? get(
                        getMeasureUriOrIdentifier(afm, drillItem.localIdentifier),
                        'uri',
                        uri
                    ) : uri,
                identifier: isDrillHeaderLocalId(drillItem)
                    ? get(
                        getMeasureUriOrIdentifier(afm, drillItem.localIdentifier),
                        'identifier',
                        identifier
                    ) : identifier
            }
        };
    });
};

export class PivotTableInner extends
        BaseVisualization<
            IPivotTableProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps & InjectedIntlProps,
            IPivotTableState
        > {
    public static defaultProps: Partial<IPivotTableProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps> = {
        ...commonDefaultProps,
        onDataTooLarge: noop,
        pageSize: 100
    };

    private gridDataSource: IDatasource;
    private gridApi: GridApi;

    constructor(props: IPivotTableProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps) {
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
            execution: null
        };
        this.gridDataSource = null;
        this.gridApi = null;
    }

    public componentWillMount() {
        const { resultSpec, getPage, cancelPagePromises } = this.props;
        this.createDataSource(resultSpec, getPage, cancelPagePromises);
    }

    public componentWillReceiveProps(
        nextProps: IPivotTableProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps
    ) {
        const propsRequiringNewDataSource = [
            'resultSpec',
            'getPage',
            'dataSource',
            // drillable items need fresh execution because drillable context for row attribute is kept in rowData
            // It could be refactored to assign drillability without execution,
            // but it would suffer a significant performance hit
            'drillableItems'
        ];

        if (propsRequiringNewDataSource.some(propKey => !isEqual(this.props[propKey], nextProps[propKey]))) {
            this.createDataSource(nextProps.resultSpec, nextProps.getPage, nextProps.cancelPagePromises);
            this.setGridDataSource();
        }
    }

    /**
     * getCellClass returns class for drillable cells. (maybe format in the future as well)
     */
    public getCellClass = (classList: string) => (cellClassParams: CellClassParams): string => {
        const { drillableItems, dataSource } = this.props;
        const { rowIndex } = cellClassParams;
        const colDef = cellClassParams.colDef as IGridHeader;
        // return none if no drillableItems are specified

        const afm: AFM.IAfm = dataSource.getAfm();

        let hasDrillableHeader = false;
        const isRowTotal = get(cellClassParams, ['data', 'type', ROW_TOTAL]);
        if (drillableItems.length !== 0 && !isRowTotal) {
            const rowDrillItem =
                get<CellClassParams, IDrillableItem>(cellClassParams, ['data', 'drillItemMap', colDef.field]);
            const drillItems = rowDrillItem ? [...colDef.drillItems, rowDrillItem] : colDef.drillItems;
            hasDrillableHeader = drillItems
                .some(
                    (drillItem: IDrillHeader) => isDrillable(drillableItems, drillItem, afm)
                );
        }

        const className = classNames(
            classList,
            getCellClassNames(rowIndex, colDef.index, hasDrillableHeader),
            colDef.index !== undefined ? `gd-column-index-${colDef.index}` : null,
            colDef.measureIndex !== undefined ? `gd-column-measure-${colDef.measureIndex}` : null,
            isRowTotal ? 'gd-row-total' : null
        );
        return className;
    }

    public getHeaderClass = (classList: string) => (headerClassParams: any): string => {
        const colDef: ColDef = headerClassParams.colDef;
        const { field } = colDef;
        const treeIndexes = colDef ? indexOfTreeNode(
            colDef,
            this.state.columnDefs,
            (nodeA, nodeB) => nodeA.field !== undefined && nodeA.field === nodeB.field
        ) : null;
        const colGroupIndex = treeIndexes
            ? treeIndexes[treeIndexes.length - 1]
            : null;
        const isFirstColumn = treeIndexes !== null && !treeIndexes.some(index => index !== 0);
        const className = classNames(
            classList,
            'gd-column-group-header',
            colGroupIndex !== null ? `gd-column-group-header-${colGroupIndex}` : null,
            !field ? 'gd-column-group-header--empty' : null,
            isFirstColumn ? 'gd-column-group-header--first' : null
        );
        return className;
    }

    public getExecution = () => {
        return this.state.execution;
    }

    public createDataSource(resultSpec: AFM.IResultSpec, getPage: IGetPage, cancelPagePromises: () => void) {
        const onSuccess = (execution: Execution.IExecutionResponses, columnDefs: IGridHeader[]) => {
            if (!isEqual(columnDefs, this.state.columnDefs)) {
                this.setState({
                    columnDefs
                });
            }
            if (!isEqual(execution, this.state.execution)) {
                this.setState({
                    execution
                });
            }
        };
        this.gridDataSource = getGridDataSource(
            resultSpec,
            getPage,
            cancelPagePromises,
            this.getExecution,
            onSuccess,
            this.getGridApi,
            this.props.intl,
            {}
        );
    }

    public getGridApi = () => this.gridApi;

    public onGridReady = (params: GridReadyEvent) => {
        this.gridApi = params.api;
        this.setGridDataSource();
    }

    public setGridDataSource() {
        this.setState({ execution: null });
        this.gridApi.setDatasource(this.gridDataSource);
    }

    public cellClicked = (cellEvent: IGridCellEvent) => {
        const { drillableItems, onFiredDrillEvent } = this.props;
        const { columnDefs } = this.state;
        const afm: AFM.IAfm = this.props.dataSource.getAfm();

        const { colDef, rowIndex } = cellEvent;
        const isRowTotal = get<IGridCellEvent, string>(cellEvent, ['data', 'type', ROW_TOTAL]);
        const rowDrillItem = get<IGridCellEvent, IDrillHeader>(cellEvent, ['data', 'drillItemMap', colDef.field]);
        const drillItems: IDrillHeader[] = rowDrillItem ? [...colDef.drillItems, rowDrillItem] : colDef.drillItems;
        const drillableHeaders = drillItems
            .filter(
                (drillItem: IDrillHeader) => isDrillable(drillableItems, drillItem, afm)
            );
        if (isRowTotal || drillableHeaders.length === 0) {
            return false;
        }

        const leafColumnDefs = getTreeLeaves(columnDefs);
        const drillEvent: IDrillEvent = {
            executionContext: afm,
            drillContext: {
                type: VisualizationTypes.TABLE,
                element: 'cell',
                columnIndex: leafColumnDefs.findIndex(gridHeader => gridHeader.field === colDef.field),
                rowIndex,
                row: getDrillRowData(leafColumnDefs, cellEvent.data),
                intersection: getDrillIntersection(drillItems, afm),
                value: cellEvent.value ? cellEvent.value.toString() : null
            }
        };

        return onFiredDrillEvent(drillEvent);
    }

    public renderVisualization() {
        const { columnDefs, rowData } = this.state;
        const { pageSize } = this.props;

        const separators = get(this.props, 'config.separators', undefined);

        const gridOptions: ICustomGridOptions = {
            // Initial data
            columnDefs,
            rowData,

            defaultColDef: {
                cellClass: this.getCellClass(null),
                headerComponentFramework: ColumnHeader as any,
                headerComponentParams: {
                    enableMenu: false
                }
            },
            defaultColGroupDef: {
                headerClass: this.getHeaderClass(null),
                children: [],
                headerGroupComponentFramework: ColumnGroupHeader as any,
                headerGroupComponentParams: {
                    enableMenu: false
                }
            },
            onCellClicked: this.cellClicked,

            // Basic options
            suppressMovableColumns: true,
            enableFilter: false,
            enableColResize: true,
            enableServerSideSorting: true,

            // infinite scrolling model
            rowModelType: 'infinite',
            paginationPageSize: pageSize,
            cacheOverflowSize: pageSize,
            cacheBlockSize: pageSize,
            maxConcurrentDatasourceRequests: 1,
            infiniteInitialRowCount: pageSize,
            maxBlocksInCache: 10,
            onGridReady: this.onGridReady,

            // this provides persistent row selection (if enabled)
            getRowNodeId: (item) => {
                const id = Object.keys(item.drillItemMap).map(
                    key => `${key}${ID_SEPARATOR}${getIdsFromUri(item.drillItemMap[key].uri)[1]}`
                ).join(FIELD_SEPARATOR);
                return id;
            },

            // Column types
            columnTypes: {
                [ROW_ATTRIBUTE_COLUMN]: {
                    cellClass: this.getCellClass('gd-row-attribute-column'),
                    headerClass: this.getHeaderClass('gd-row-attribute-column-header'),
                    colSpan: (params: any) => {
                        if (
                            // params.data is undefined when rows are in loading state
                            params.data &&
                            params.data.colSpan &&
                            AVAILABLE_TOTALS.find(item => item === params.data[params.data.colSpan.headerKey])
                        ) {
                            return params.data.colSpan.count;
                        }
                        return 1;
                    }
                },
                [COLUMN_ATTRIBUTE_COLUMN]: {
                    cellClass: this.getCellClass('gd-column-attribute-column'),
                    headerClass: this.getHeaderClass('gd-column-attribute-column-header')
                },
                [MEASURE_COLUMN]: {
                    cellClass: this.getCellClass(classNames(
                        AG_NUMERIC_CELL_CLASSNAME, 'gd-measure-column')),
                    headerClass: this.getHeaderClass(classNames(
                        AG_NUMERIC_HEADER_CLASSNAME, 'gd-measure-column-header')),
                    valueFormatter: (params: any) => {
                        return params.value === undefined
                            ? null
                            : getMeasureCellFormattedValue(
                                params.value,
                                this.getMeasureFormat(params),
                                separators
                            );
                    },
                    cellStyle: (params: any) => {
                        return params.value === undefined
                            ? null
                            : getMeasureCellStyle(
                                params.value,
                                this.getMeasureFormat(params),
                                separators,
                                true
                            );
                    }
                }
            },

            // Custom renderers
            frameworkComponents: {
                // any is needed here because of incompatible types with AgGridReact types
                loadingRenderer: RowLoadingElement as any // loading indicator
            },

            // Custom CSS classes
            rowClass: 'gd-table-row'
        };

        // columnDefs are loaded with first page request. Show overlay loading before first page is available.
        const tableLoadingOverlay = columnDefs.length === 0 ? (
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <LoadingComponent />
            </div>
        ) : null;

        return (
            <div
                className="gd-table ag-theme-balham s-pivot-table"
                style={{ height: '100%', position: 'relative' }}
            >
                {tableLoadingOverlay}
                <AgGridReact
                    {...gridOptions}
                />
            </div>
        );
    }

    private getMeasureFormat(params: any): string {
        const headers = this.state.execution.executionResponse.dimensions[1].headers;
        const header = headers[headers.length - 1];

        if (Execution.isMeasureGroupHeader(header)) {
            const measureIndex = params.colDef.measureIndex;
            return header.measureGroupHeader.items[measureIndex].measureHeaderItem.format;
        }

        throw new Error(`Cannot get measure format from header ${header}`);
    }
}

export const PivotTable = visualizationLoadingHOC(PivotTableInner, false);
