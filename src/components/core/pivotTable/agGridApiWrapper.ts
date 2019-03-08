// (C) 2007-2019 GoodData Corporation
import { GridApi } from 'ag-grid';

function getHeaderHeight(gridApi: GridApi): number {
    return (gridApi as any).headerRootComp.eHeaderContainer.clientHeight;
}

function getRowHeight(gridApi: GridApi): number {
    return (gridApi as any).getModel().rowHeight;
}

function getPinnedTopRowNode(gridApi: any): HTMLElement | null {
    return gridApi.rowRenderer.floatingTopRowComps[0]
        ? gridApi.rowRenderer.floatingTopRowComps[0].bodyContainerComp.eContainer.parentNode.parentNode
        : null;
}

export default {
    getHeaderHeight,
    getRowHeight,
    getPinnedTopRowNode
};
