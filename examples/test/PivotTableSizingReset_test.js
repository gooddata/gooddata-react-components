// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate, sleep } from "./utils/helpers";

import {
    getCell,
    waitForPivotTableStopLoading,
    dragResizer,
    checkWidthWithTolerance,
    getCallbackArray,
    getAttributeColumnWidthItemByIdentifier,
    getMeasureColumnWidthItemByLocator,
    setAutoResize,
} from "./utils/pivotTableHelpers";

fixture("Pivot Table Sizing and Reset by double click").beforeEach(
    loginUserAndNavigate(`${config.url}/hidden/pivot-table-sizing`),
);

const TABLE_SELECTOR_STR = ".s-pivot-table-sizing-complex";
const CHANGE_WIDTH_BUTTON_ATTRIBUTE_STR = ".s-change-width-button-attribute";
const CHANGE_WIDTH_BUTTON_MEASURE_STR = ".s-change-width-button-measure";

const AGGRID_ON_RESIZE_TIMEOUT = 500;
const AUTO_SIZE_TOLERANCE = 5;
const DND_SIZE_TOLERANCE = 5;
const CELL_DEFAULT_WIDTH = 200;
const FIRST_CELL_AUTORESIZE_WIDTH = 111;
const SECOND_CELL_AUTORESIZE_WIDTH = 125;
const FIRST_CELL_MANUAL_WIDTH = 400;
const SECOND_CELL_MANUAL_WIDTH = 60;
const ATTRIBUTE_IDENTIFIER = "state";
const MEASURE_LOCATOR_ITEM = "franchiseFees";
const ATTRIBUTE_LOCATOR_ITEM_ATT_ID = "quarterDate";
const ATTRIBUTE_LOCATOR_ITEM_ATT_ELM = "/gdc/md/xms7ga4tf3g3nzucd8380o2bev8oeknp/obj/2009/elements?id=1";

const getFirstCellResizer = async (t, tableSelectorStr) => {
    const tableSelector = Selector(tableSelectorStr);
    await t.expect(tableSelector.exists).eql(true, `${tableSelectorStr} not found`);

    const firstHeaderCell = `.s-table-measure-column-header-group-cell-0.gd-column-group-header--first .ag-header-cell-resize`;

    const resizer = await tableSelector.find(firstHeaderCell);

    return resizer;
};

const getSecondCellResizer = async (t, tableSelectorStr) => {
    const tableSelector = Selector(tableSelectorStr);
    await t.expect(tableSelector.exists).eql(true, `${tableSelectorStr} not found`);

    const secondHeaderCell = `.s-table-measure-column-header-group-cell-0.s-table-measure-column-header-index-1 .ag-header-cell-resize`;

    const resizer = await tableSelector.find(secondHeaderCell);

    return resizer;
};

// first attribute column

test("should reset first column with default width by double click to auto size and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-0";

    await waitForPivotTableStopLoading(t, tableSelector);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(CELL_DEFAULT_WIDTH);

    const resizer = await getFirstCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        FIRST_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getAttributeColumnWidthItemByIdentifier(callBack, ATTRIBUTE_IDENTIFIER);
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.attributeColumnWidthItem.width,
        FIRST_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});

test("should reset first column with manual width by double click to auto size and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-0";

    await waitForPivotTableStopLoading(t, tableSelector);

    await t.click(CHANGE_WIDTH_BUTTON_ATTRIBUTE_STR);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(FIRST_CELL_MANUAL_WIDTH);

    const resizer = await getFirstCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        FIRST_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getAttributeColumnWidthItemByIdentifier(callBack, ATTRIBUTE_IDENTIFIER);
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.attributeColumnWidthItem.width,
        FIRST_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});

test("when auto resize is on should reset first column with manual width by double click to auto size and remove this column from manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-0";

    await waitForPivotTableStopLoading(t, tableSelector);

    await t.click(CHANGE_WIDTH_BUTTON_ATTRIBUTE_STR);

    await setAutoResize(t, TABLE_SELECTOR_STR);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        actualCellWidth,
        FIRST_CELL_MANUAL_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const resizer = await getFirstCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        FIRST_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(0);
});

test("should resize first column by DnD and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-0";
    const dragOffset = 100;

    await waitForPivotTableStopLoading(t, tableSelector);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(CELL_DEFAULT_WIDTH);

    const resizer = await getFirstCellResizer(t, TABLE_SELECTOR_STR);
    await dragResizer(t, resizer, dragOffset);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        CELL_DEFAULT_WIDTH + dragOffset,
        DND_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getAttributeColumnWidthItemByIdentifier(callBack, ATTRIBUTE_IDENTIFIER);
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.attributeColumnWidthItem.width,
        CELL_DEFAULT_WIDTH + dragOffset,
        DND_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});

// second measure column

test("should reset second column with default width by double click to auto size and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-1";

    await waitForPivotTableStopLoading(t, tableSelector);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(CELL_DEFAULT_WIDTH);

    const resizer = await getSecondCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        SECOND_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getMeasureColumnWidthItemByLocator(
        callBack,
        MEASURE_LOCATOR_ITEM,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ID,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ELM,
    );
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.measureColumnWidthItem.width,
        SECOND_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});

test("should reset second column with manual width by double click to auto size and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-1";

    await waitForPivotTableStopLoading(t, tableSelector);

    await t.click(CHANGE_WIDTH_BUTTON_MEASURE_STR);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(SECOND_CELL_MANUAL_WIDTH);

    const resizer = await getSecondCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        SECOND_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getMeasureColumnWidthItemByLocator(
        callBack,
        MEASURE_LOCATOR_ITEM,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ID,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ELM,
    );
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.measureColumnWidthItem.width,
        SECOND_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});

test("when auto resize is on should reset second column with manual width by double click to auto size and remove this column from manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-1";

    await waitForPivotTableStopLoading(t, tableSelector);

    await t.click(CHANGE_WIDTH_BUTTON_MEASURE_STR);

    await setAutoResize(t, TABLE_SELECTOR_STR);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        actualCellWidth,
        SECOND_CELL_MANUAL_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const resizer = await getSecondCellResizer(t, TABLE_SELECTOR_STR);
    await t.doubleClick(resizer);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        SECOND_CELL_AUTORESIZE_WIDTH,
        AUTO_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(0);
});

test("should resize second column by DnD and notify column as manually resized via props", async t => {
    const tableSelector = Selector(TABLE_SELECTOR_STR);
    const cellSelectorStr = ".s-cell-0-1";
    const dragOffset = 100;

    await waitForPivotTableStopLoading(t, tableSelector);

    const cell = await getCell(t, TABLE_SELECTOR_STR, cellSelectorStr);
    const actualCellWidth = await cell.getBoundingClientRectProperty("width");
    await t.expect(actualCellWidth).eql(CELL_DEFAULT_WIDTH);

    const resizer = await getSecondCellResizer(t, TABLE_SELECTOR_STR);
    await dragResizer(t, resizer, dragOffset);

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const resizedCellWidth = await cell.getBoundingClientRectProperty("width");
    await checkWidthWithTolerance(
        t,
        resizedCellWidth,
        CELL_DEFAULT_WIDTH + dragOffset,
        DND_SIZE_TOLERANCE,
        "Width of table column",
    );

    const callBack = await getCallbackArray(TABLE_SELECTOR_STR);
    await t.expect(callBack.length).eql(1);

    const item = getMeasureColumnWidthItemByLocator(
        callBack,
        MEASURE_LOCATOR_ITEM,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ID,
        ATTRIBUTE_LOCATOR_ITEM_ATT_ELM,
    );
    await t.expect(item).notEql(undefined);
    await checkWidthWithTolerance(
        t,
        item.measureColumnWidthItem.width,
        CELL_DEFAULT_WIDTH + dragOffset,
        DND_SIZE_TOLERANCE,
        "Width of item from callback array",
    );
});
