// (C) 2007-2019 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import isEqual = require("lodash/isEqual");
import { IDatasource, IGetRowsParams, GridApi } from "ag-grid";

import InjectedIntl = ReactIntl.InjectedIntl;

import { executionToAGGridAdapter, ROW_ATTRIBUTE_COLUMN } from "../../../helpers/agGrid";
import { IGridHeader, IGridTotalsRow } from "../../../interfaces/AGGrid";

import { IGetPage } from "../base/VisualizationLoadingHOC";
import { IGroupingProvider } from "../pivotTable/GroupingProvider";
import { getSortsFromModel, IPreviousAgGridRowsData } from "../PivotTable";

const areTotalsChanged = (gridApi: GridApi, totals: IGridTotalsRow[]) => {
    const totalsCount = gridApi.getPinnedBottomRowCount();
    if (!totals || totalsCount !== totals.length) {
        return true;
    }

    for (let i = 0; i < totalsCount; i++) {
        if (!isEqual(gridApi.getPinnedBottomRow(i).data, totals[i])) {
            return true;
        }
    }

    return false;
};

export const getDataSourceRowsGetter = (
    resultSpec: AFM.IResultSpec,
    getPage: IGetPage,
    getExecution: () => Execution.IExecutionResponses,
    onSuccess: (
        execution: Execution.IExecutionResponses,
        columnDefs: IGridHeader[],
        resultSpec: AFM.IResultSpec,
    ) => void,
    getGridApi: () => any,
    intl: InjectedIntl,
    columnTotals: AFM.ITotalItem[],
    getGroupingProvider: () => IGroupingProvider,
    previousAGGridRowsData: IPreviousAgGridRowsData,
    previousColDefs: IGridHeader[] = [],
) => {
    return (getRowsParams: IGetRowsParams) => {
        const { startRow, endRow, successCallback, sortModel } = getRowsParams;

        const execution = getExecution();
        const groupingProvider = getGroupingProvider();

        let resultSpecUpdated: AFM.IResultSpec = resultSpec;
        // If execution is null, this means this is a fresh dataSource and we should ignore current sortModel
        if (sortModel.length > 0 && execution) {
            resultSpecUpdated = {
                ...resultSpecUpdated,
                sorts: getSortsFromModel(sortModel, execution),
            };
        }
        if (columnTotals && columnTotals.length > 0) {
            resultSpecUpdated = {
                ...resultSpecUpdated,
                dimensions: [
                    {
                        ...resultSpecUpdated.dimensions[0],
                        totals: columnTotals,
                    },
                    ...resultSpecUpdated.dimensions.slice(1),
                ],
            };
        }

        const spec = {
            resultSpec: resultSpecUpdated,
            previousColDefs,
            startRow,
            endRow,
        };

        // We skip data fetching if spec did not change from previous request, this is because of ag-grid bug
        // where it call getRows twice, see "IPreviousAgGridRowsData" interface for more information.
        if (isEqual(previousAGGridRowsData.spec, spec)) {
            previousAGGridRowsData.spec = spec;

            groupingProvider.processPage(
                previousAGGridRowsData.result.rowData,
                previousAGGridRowsData.result.offset[0],
                previousAGGridRowsData.result.rowAttributeIds,
            );
            successCallback(previousAGGridRowsData.result.rowData, previousAGGridRowsData.result.lastRow);
            return;
        }
        previousAGGridRowsData.spec = spec;

        const pagePromise = getPage(
            resultSpecUpdated,
            // column limit defaults to SERVERSIDE_COLUMN_LIMIT (1000), because 1000 columns is hopefully enough.
            [endRow - startRow, undefined],
            // column offset defaults to 0, because we do not support horizontal paging yet
            [startRow, undefined],
        );
        return pagePromise.then((execution: Execution.IExecutionResponses | null) => {
            if (!execution) {
                return null;
            }

            const { columnDefs, rowData, rowTotals } = executionToAGGridAdapter(
                execution,
                resultSpecUpdated,
                intl,
                {
                    addLoadingRenderer: "loadingRenderer",
                    columnDefOptions: {},
                },
            );
            const { offset, count, total } = execution.executionResult.paging;

            const rowAttributeIds = columnDefs
                .filter(columnDef => columnDef.type === ROW_ATTRIBUTE_COLUMN)
                .map(columnDef => columnDef.field);
            groupingProvider.processPage(rowData, offset[0], rowAttributeIds);
            // RAIL-1130: Backend returns incorrectly total: [1, N], when count: [0, N] and offset: [0, N]
            const lastRow = offset[0] === 0 && count[0] === 0 ? 0 : total[0];
            onSuccess(execution, columnDefs, resultSpecUpdated);
            successCallback(rowData, lastRow);

            // set totals
            if (areTotalsChanged(getGridApi(), rowTotals)) {
                getGridApi().setPinnedBottomRowData(rowTotals);
            }

            previousAGGridRowsData.result = { rowData, lastRow, offset, rowAttributeIds };

            return execution;
        });
    };
};

export const getAGGridDataSource = (
    resultSpec: AFM.IResultSpec,
    getPage: IGetPage,
    getExecution: () => Execution.IExecutionResponses,
    onSuccess: (
        execution: Execution.IExecutionResponses,
        columnDefs: IGridHeader[],
        resultSpec: AFM.IResultSpec,
    ) => void,
    getGridApi: () => any,
    intl: InjectedIntl,
    columnTotals: AFM.ITotalItem[],
    getGroupingProvider: () => IGroupingProvider,
    cancelPagePromises: () => void,
    previousAGGridRowsData: IPreviousAgGridRowsData,
    previousColDefs: IGridHeader[] = [],
): IDatasource => ({
    getRows: getDataSourceRowsGetter(
        resultSpec,
        getPage,
        getExecution,
        onSuccess,
        getGridApi,
        intl,
        columnTotals,
        getGroupingProvider,
        previousAGGridRowsData,
        previousColDefs,
    ),
    destroy: () => {
        cancelPagePromises();
    },
});
