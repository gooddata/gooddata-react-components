// (C) 2007-2019 GoodData Corporation
import { GridApi } from 'ag-grid';

function getHeaderHeight(gridApi: GridApi): number {
    return (gridApi as any).headerRootComp.eHeaderContainer.clientHeight;
}

function getRowHeight(gridApi: GridApi): number {
    return (gridApi as any).getModel().rowHeight;
}

function getScrollTop(gridApi: GridApi): number {
    return (gridApi as any).gridPanel.getVScrollPosition().top;
}

function getPinnedTopRow(gridApi: GridApi): any | null {
    const pinnedTopRow = (gridApi as any).rowRenderer.floatingTopRowComps[0];
    return pinnedTopRow ? pinnedTopRow : null;
}

function getPinnedTopRowNode(gridApi: GridApi): HTMLElement | null {
    const pinnedTopRow = getPinnedTopRow(gridApi);
    return pinnedTopRow
        ? pinnedTopRow.bodyContainerComp.eContainer.parentNode.parentNode
        : null;
}

function getPinnedTopRowAttributeNode(gridApi: GridApi, attributeId: string): HTMLElement | null {
    const pinnedTopRow = getPinnedTopRow(gridApi);
    return pinnedTopRow && pinnedTopRow.cellComps[attributeId]
        ? pinnedTopRow.cellComps[attributeId].eGui
        : null;
}

export default {
    getHeaderHeight,
    getRowHeight,
    getScrollTop,
    getPinnedTopRow,
    getPinnedTopRowNode,
    getPinnedTopRowAttributeNode
};
