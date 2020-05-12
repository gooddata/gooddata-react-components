// (C) 2007-2020 GoodData Corporation
import { Selector, ClientFunction } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate, sleep } from "./utils/helpers";
import { waitForPivotTableStopLoading, checkCellValue } from "./utils/pivotTableHelpers";

fixture("Pivot Table Sizing").beforeEach(loginUserAndNavigate(`${config.url}/hidden/pivot-table-sizing`));

test("should render all tables", async t => {
    const firstCellSelector = ".s-cell-0-0";
    await checkCellValue(t, ".s-pivot-table-sizing", "Aaron Clements", firstCellSelector);
    await checkCellValue(t, ".s-pivot-table-sizing-with-subtotals", "Alabama", firstCellSelector);
    await checkCellValue(
        t,
        ".s-pivot-table-sizing-with-attribute-filter",
        "10-ounce Steak Mary Anne",
        firstCellSelector,
    );
});

async function filterOutLongAttributeElements(t, tableWrapper) {
    const secondCell = ".s-cell-0-1";
    const wrapper = Selector(tableWrapper);
    await checkCellValue(t, tableWrapper, "520,409", secondCell);
    await t
        .click(wrapper.find(".s-menu_item_name"))
        .click(Selector(".s-clear"))
        .typeText(Selector(".gd-list-searchfield .gd-input-field"), "Agnello");
    await Selector(".gd-attribute-filter-overlay .s-isLoading", { visibilityCheck: true })();
    await t.click(Selector(".s-attribute-filter-list-item").nth(0)).click(Selector(".s-apply"));
    await checkCellValue(t, tableWrapper, "615,726", secondCell);
}

test("should trigger resize after attribute filter change", async t => {
    const tableWrapper = ".s-pivot-table-sizing-with-attribute-filter";
    const firstAttributeCellSelector = ".s-cell-0-0";
    const originalWidth = await Selector(tableWrapper).find(firstAttributeCellSelector).clientWidth;
    await filterOutLongAttributeElements(t, tableWrapper);
    const newWidth = await Selector(tableWrapper).find(firstAttributeCellSelector).clientWidth;
    await t.expect(newWidth).lt(originalWidth);
});

async function resizeTable(t, tableQuerySelector, width) {
    await t.eval(
        () => {
            document.querySelector(tableQuerySelector).style.width = width;
        },
        { dependencies: { tableQuerySelector, width } },
    );
}

async function resizeAndVerifyColumnVisibility(t, tableSelector, columnSelector) {
    const tableElement = Selector(tableSelector);
    const columnElement = await tableElement.find(columnSelector);
    await t.expect(columnElement.exists).eql(false);
    await resizeTable(t, tableSelector, "1200px");
    await t.expect(columnElement.visible).eql(true);
}

test("should resize newly displayed columns after the whole table is resized", async t => {
    const table = ".s-pivot-table-sizing-with-subtotals";
    const originalAttributeCell = ".s-cell-1-4";
    const newlyDisplayedAttributeCell = ".s-cell-1-8";

    await resizeAndVerifyColumnVisibility(t, table, newlyDisplayedAttributeCell);
    const newlyDisplayedColumnWidth = await Selector(table).find(newlyDisplayedAttributeCell).clientWidth;
    const originalColumnWidth = await Selector(table).find(originalAttributeCell).clientWidth;
    await t.expect(newlyDisplayedColumnWidth).eql(originalColumnWidth);
});

fixture("Pivot Table Grow to fit").beforeEach(
    loginUserAndNavigate(`${config.url}/hidden/pivot-table-sizing`),
);

test("should render table auto-resized and fitted to container", async t => {
    const tableSelector = Selector(".s-pivot-table-columns-grow-to-fit");
    const headersContainer = ".ag-header-container";
    const headersViewport = ".ag-header-viewport";
    const toleranceWithScrollBar = 20;

    await waitForPivotTableStopLoading(t, tableSelector);

    const rowHeadersWidth = await tableSelector.find(headersContainer).clientWidth;
    const headersViewportWidth = await tableSelector.find(headersViewport).clientWidth;

    await t.expect(headersViewportWidth - rowHeadersWidth).gte(0);
    await t.expect(headersViewportWidth - rowHeadersWidth).lte(toleranceWithScrollBar);
});

test("should fit to container after resize (size increased)", async t => {
    const AGGRID_ON_RESIZE_TIMEOUT = 500;
    const tableSelectorStr = ".s-pivot-table-columns-grow-to-fit";
    const tableSelector = Selector(tableSelectorStr);
    const headersContainer = ".ag-header-container";
    const headersViewport = ".ag-header-viewport";
    const toleranceWithScrollBar = 20;

    await waitForPivotTableStopLoading(t, tableSelector);
    await resizeTable(t, tableSelectorStr, "1200px");

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const rowHeadersWidth = await tableSelector.find(headersContainer).clientWidth;
    const headersViewportWidth = await tableSelector.find(headersViewport).clientWidth;

    await t.expect(headersViewportWidth - rowHeadersWidth).gte(0);
    await t.expect(headersViewportWidth - rowHeadersWidth).lte(toleranceWithScrollBar);
});

test("should fit to container after resize (size decreased)", async t => {
    const AGGRID_ON_RESIZE_TIMEOUT = 500;
    const tableSelectorStr = ".s-pivot-table-columns-grow-to-fit";
    const tableSelector = Selector(tableSelectorStr);
    const headersContainer = ".ag-header-container";
    const headersViewport = ".ag-header-viewport";
    const toleranceWithScrollBar = 20;

    await waitForPivotTableStopLoading(t, tableSelector);
    await resizeTable(t, tableSelectorStr, "650px");

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const rowHeadersWidth = await tableSelector.find(headersContainer).clientWidth;
    const headersViewportWidth = await tableSelector.find(headersViewport).clientWidth;

    await t.expect(headersViewportWidth - rowHeadersWidth).gte(0);
    await t.expect(headersViewportWidth - rowHeadersWidth).lte(toleranceWithScrollBar);
});

async function calculateRowWidth(tableSelector, rowIndex, cellCount) {
    let total = 0;
    const scrollContainer = tableSelector.find(".ag-center-cols-viewport");

    const scrollFn = ClientFunction(
        scrollValue => {
            scrollContainer().scrollLeft = scrollValue;
        },
        { dependencies: { scrollContainer } },
    );

    await scrollFn(500);

    for (let i = 0; i < cellCount; i += 1) {
        const cellSelector = `.ag-center-cols-viewport .s-cell-${rowIndex}-${i}`;
        // eslint-disable-next-line no-await-in-loop
        const cellWidth = await tableSelector.find(cellSelector).clientWidth;
        total += cellWidth;
    }

    return total;
}

test("should not call fit to grow when container after resize is smaller than cols", async t => {
    const AGGRID_ON_RESIZE_TIMEOUT = 500;
    const toleranceWithScrollBar = 20;
    const tableSelectorStr = ".s-pivot-table-columns-grow-to-fit";
    const tableSelector = Selector(tableSelectorStr);

    const tableNotGrowToFitSelectorStr = ".s-pivot-table-sizing";
    const tableNotGrowToFitSelector = Selector(tableNotGrowToFitSelectorStr);

    await waitForPivotTableStopLoading(t, tableSelector);
    await resizeTable(t, tableSelectorStr, "300px");

    await sleep(AGGRID_ON_RESIZE_TIMEOUT);

    const rowNotGrowToFitWidth = await calculateRowWidth(tableNotGrowToFitSelector, 0, 7);
    const rowWidth = await calculateRowWidth(tableSelector, 0, 7);
    await t.expect(rowNotGrowToFitWidth - rowWidth).lte(toleranceWithScrollBar);
});
