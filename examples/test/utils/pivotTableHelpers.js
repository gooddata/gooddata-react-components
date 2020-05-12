// (C) 2020 GoodData Corporation
import { Selector } from "testcafe";

export async function getCell(t, selector, cellSelector) {
    const chart = Selector(selector);
    await t.expect(chart.exists).eql(true, `${selector} not found`);
    if (!cellSelector) {
        return null;
    }
    const cell = await chart.find(`.ag-body-viewport ${cellSelector}`);
    await t.expect(cell.exists).eql(true, `${cellSelector} not found in ${selector}`);
    return cell;
}

export async function checkCellValue(t, selector, cellValue, cellSelector = ".ag-cell") {
    const cell = await getCell(t, selector, cellSelector);
    if (cellValue) {
        await t
            .expect(cell.textContent)
            .eql(cellValue, `expected ${cellSelector} to contain text ${cellValue}`);
    }
}

export async function checkCellHasClassName(t, selector, expectedClassName, cellSelector) {
    const cell = await getCell(t, selector, cellSelector);
    await t
        .expect(cell.hasClass(expectedClassName))
        .ok(`expected ${cellSelector} to has class ${expectedClassName}`);
}

export async function checkCellHasNotClassName(t, selector, expectedClassName, cellSelector) {
    const cell = await getCell(t, selector, cellSelector);
    await t
        .expect(cell.hasClass(expectedClassName))
        .notOk(`expected ${cellSelector} to has not class ${expectedClassName}`);
}

export const waitForPivotTableStopLoading = async (t, pivotSelector) => {
    const loadingSelectorString = ".s-pivot-table .s-loading";
    const loadingSelector = pivotSelector
        ? pivotSelector.find(loadingSelectorString)
        : Selector(loadingSelectorString);

    await t.expect(loadingSelector.exists).notOk();
};

export const getMenu = cell => {
    return cell.find(".s-table-header-menu");
};

export const clickOnMenuAggregationItem = async (t, cell, aggregationItemClass, attribute) => {
    await t.hover(cell);
    const menu = getMenu(cell);
    await t.click(menu);

    const sumTotal = Selector(aggregationItemClass).find(".s-menu-aggregation-inner");

    if (attribute) {
        await t.hover(sumTotal);
        await t.wait(1000);
        const submenu = Selector(".s-table-header-submenu-content");
        await t.click(submenu.find(`.s-aggregation-item-${attribute}`));
    } else {
        await t.click(sumTotal);
    }

    await waitForPivotTableStopLoading(t);
};

export async function sortColumn(t, tableSelectorStr, columnIndex) {
    const tableSelector = Selector(tableSelectorStr);
    await t.expect(tableSelector.exists).eql(true, `${tableSelectorStr} not found`);
    const tableHeader = tableSelector
        .find(".s-pivot-table-column-header .s-header-cell-label")
        .nth(columnIndex);
    await t.click(tableHeader);
    await t.expect(tableHeader.find(".s-sort-direction-arrow").exists).ok();
    await waitForPivotTableStopLoading(t);
}
