// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { waitForPivotTableStopLoading, checkCellValue } from "./utils/pivotTableHelpers";

fixture("Pivot Table Demo").beforeEach(loginUserAndNavigate(`${config.url}/pivot-table`));

const CELL_0_1 = ".s-cell-0-1";
const CELL_1_1 = ".s-cell-1-1";
const CELL_2_1 = ".s-cell-2-1";
const CELL_3_1 = ".s-cell-3-1";

test("should render all tables", async t => {
    const table = Selector(".s-pivot-table-sorting");
    const tableTotals = Selector(".s-pivot-table-totals");
    const tableDrilling = Selector(".s-pivot-table-drill");
    const tableDrillingCell = tableDrilling.find(".s-cell-0-2");
    const drillValue = Selector(".s-drill-value");
    await t.expect(table.exists).ok();
    await t.expect(tableTotals.exists).ok();
    await t.expect(tableDrilling.exists).ok();
    await t.click(tableDrillingCell);
    await t.expect(drillValue.textContent).eql("Alcoholic Beverages");
});

test("should render table with aggregation function", async t => {
    const pivotTableSelector = Selector("#table-with-sort-aggregation .s-pivot-table");

    await waitForPivotTableStopLoading(t, pivotTableSelector);
    // check applied filter
    await checkCellValue(t, pivotTableSelector, "526,149", CELL_0_1);
    await checkCellValue(t, pivotTableSelector, "390,553", CELL_1_1);
    await checkCellValue(t, pivotTableSelector, "175,683", CELL_2_1);
    await checkCellValue(t, pivotTableSelector, "138,075", CELL_3_1);
});
