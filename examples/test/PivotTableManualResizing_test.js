// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { checkCellValue, getCell, clickOnMenuAggregationItem, sortColumn } from "./utils/pivotTableHelpers";

fixture("Pivot Table Manual Resizing").beforeEach(loginUserAndNavigate(`${config.url}/pivot-table`));

const getMeasureCell = (tableSelectorStr, column) => {
    return Selector(`${tableSelectorStr} .s-table-measure-column-header-cell-${column}`);
};

test("should render pivot table with manual resizing", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    await checkCellValue(t, tableSelectorStr, "Alabama", cellSelectorStr);
});

test("should change width of attribute column to properly value by click on button", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidth = 400;
    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-attribute");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});

test("should change width of measure column to properly value by click on button", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-1";
    const correctCellWidth = 60;
    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-measure");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});

test("should reset width of column to default value by click on button", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidthBeforeReset = 400;
    const correctCellWidthAfterReset = 200;
    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-attribute");

    let actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidthBeforeReset);

    await t.click(".s-change-width-button-remove");

    actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidthAfterReset);
});

test("should change width of column after change of sorting", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidth = 400;

    await sortColumn(t, tableSelectorStr, 0);

    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);
    await t.click(".s-change-width-button-attribute");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});

test("should change width of column after adding total", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidth = 400;

    const measureCell = getMeasureCell(tableSelectorStr, 0);

    await clickOnMenuAggregationItem(t, measureCell, ".s-menu-aggregation-sum");

    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);
    await t.click(".s-change-width-button-attribute");

    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});

test("should keep manual width of column even after adding total", async t => {
    const tableSelectorStr = ".s-pivot-table-manual-resizing";
    const cellSelectorStr = ".s-cell-0-0";
    const correctCellWidth = 400;

    const cell = await getCell(t, tableSelectorStr, cellSelectorStr);

    await t.click(".s-change-width-button-attribute");
    let actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);

    const measureCell = getMeasureCell(tableSelectorStr, 0);
    await clickOnMenuAggregationItem(t, measureCell, ".s-menu-aggregation-sum");

    actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(correctCellWidth);
});
