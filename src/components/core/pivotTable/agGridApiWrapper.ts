// (C) 2007-2019 GoodData Corporation
import { GridApi } from "ag-grid-community";
import { IScrollPosition } from "./stickyRowHandler";

function getHeaderHeight(gridApi: GridApi): number {
    return (gridApi as any).headerRootComp.eHeaderContainer.clientHeight;
}

function findRealColumnIndex(cells: any, attributeId: string) {
    return Object.keys(cells).find((index: string) => {
        return index.slice(0, attributeId.length) === attributeId && cells[index] !== null;
    });
}

function getCellElementWrapper(row: any, attributeId: string) {
    if (!row) {
        return null;
    }
    const columnIndex = findRealColumnIndex(row.cellComps, attributeId);
    return row.cellComps[columnIndex] ? row.cellComps[columnIndex].eGui : null;
}

function getCellElement(gridApi: GridApi, attributeId: string, rowIndex: number): HTMLElement | null {
    const rowComp = (gridApi as any).rowRenderer.rowCompsByIndex[rowIndex];
    return getCellElementWrapper(rowComp, attributeId);
}

function addCellClass(gridApi: GridApi, attributeId: string, rowIndex: number, className: string) {
    const cellElement = getCellElement(gridApi, attributeId, rowIndex);
    if (cellElement !== null) {
        cellElement.classList.add(className);
    }
}

function removeCellClass(gridApi: GridApi, attributeId: string, rowIndex: number, className: string) {
    const cellElement = getCellElement(gridApi, attributeId, rowIndex);
    if (cellElement !== null) {
        cellElement.classList.remove(className);
    }
}

function getPaginationBottomRowIndex(gridApi: GridApi): number | null {
    const paginationProxy = (gridApi as any).paginationProxy;
    if (paginationProxy) {
        const index = paginationProxy.bottomRowIndex;
        return typeof index === "number" ? index : null;
    }

    return null;
}

function getPinnedTopRow(gridApi: GridApi): any | null {
    const pinnedTopRow = (gridApi as any).rowRenderer.floatingTopRowComps[0];
    return pinnedTopRow ? pinnedTopRow : null;
}

function getPinnedTopRowElement(gridApi: GridApi): HTMLElement | null {
    const pinnedTopRow = getPinnedTopRow(gridApi);
    return pinnedTopRow ? pinnedTopRow.bodyContainerComp.eContainer.parentElement.parentElement : null;
}

function addPinnedTopRowClass(gridApi: GridApi, className: string) {
    const rowElement = getPinnedTopRowElement(gridApi);
    rowElement.classList.add(className);
}

function removePinnedTopRowClass(gridApi: GridApi, className: string) {
    const rowElement = getPinnedTopRowElement(gridApi);
    rowElement.classList.remove(className);
}

function setPinnedTopRowStyle(gridApi: GridApi, propertyName: string, propertyValue: string) {
    const rowElement = getPinnedTopRowElement(gridApi);
    rowElement.style[propertyName] = propertyValue;
}

function getPinnedTopRowCellElementWrapper(gridApi: GridApi, attributeId: string): HTMLElement | null {
    const pinnedTopRow = getPinnedTopRow(gridApi);
    return getCellElementWrapper(pinnedTopRow, attributeId);
}

function getPinnedTopRowCellElement(gridApi: GridApi, attributeId: string): HTMLElement | null {
    const pinnedTopRowCellElementWrapper = getPinnedTopRowCellElementWrapper(gridApi, attributeId);
    return pinnedTopRowCellElementWrapper ? pinnedTopRowCellElementWrapper.querySelector("span") : null;
}

function addPinnedTopRowCellClass(gridApi: GridApi, attributeId: string, className: string) {
    const cellElement = getPinnedTopRowCellElementWrapper(gridApi, attributeId);
    if (cellElement !== null) {
        cellElement.classList.add(className);
    }
}

function removePinnedTopRowCellClass(gridApi: GridApi, attributeId: string, className: string) {
    const cellElement = getPinnedTopRowCellElementWrapper(gridApi, attributeId);
    if (cellElement !== null) {
        cellElement.classList.remove(className);
    }
}

function setPinnedTopRowCellText(gridApi: GridApi, attributeId: string, text: string) {
    const cellElement = getPinnedTopRowCellElement(gridApi, attributeId);

    if (cellElement !== null) {
        cellElement.innerText = text;
    }
}

function getViewportScroll(gridApi: GridApi): IScrollPosition {
    return {
        top: (gridApi as any).rowRenderer.rowContainers.body.eViewport.scrollTop,
        left: (gridApi as any).rowRenderer.rowContainers.body.eWrapper.children[0].scrollLeft,
    };
}

export default {
    getHeaderHeight,
    // cell element
    getCellElement,
    addCellClass,
    removeCellClass,
    // pinned row element
    getPinnedTopRowElement,
    addPinnedTopRowClass,
    removePinnedTopRowClass,
    setPinnedTopRowStyle,
    // pinned row cell element
    getPinnedTopRowCellElement,
    getPinnedTopRowCellElementWrapper,
    addPinnedTopRowCellClass,
    removePinnedTopRowCellClass,
    setPinnedTopRowCellText,
    getPaginationBottomRowIndex,
    // scroll
    getViewportScroll,
};
