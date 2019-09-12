// (C) 2007-2019 GoodData Corporation
// TODO BB-1694 - Uncomment this test
// import { Selector } from "testcafe";
// import { loginUsingLoginForm, waitForPivotTableStopLoading, checkCellValue } from "./utils/helpers";
// import config from "./utils/config";

// const FILTER_PRESET_GREATER_THAN_FILTER = ".s-filter-preset-greaterThanFilter";
// const FILTER_PRESET_BETWEEN_FILTER = ".s-filter-preset-betweenFilter";
// const PIVOT_TABLE_MEASURE_VALUE_FILTER = ".s-pivot-table-measure-value-filter";

// const CELL_0_0 = ".s-cell-0-0";
// const CELL_1_0 = ".s-cell-1-0";
// const CELL_2_0 = ".s-cell-2-0";
// const CELL_3_0 = ".s-cell-3-0";
// const CELL_4_0 = ".s-cell-4-0";
// const CELL_5_0 = ".s-cell-5-0";
// const CELL_0_1 = ".s-cell-0-1";
// const CELL_1_1 = ".s-cell-1-1";
// const CELL_2_1 = ".s-cell-2-1";
// const CELL_3_1 = ".s-cell-3-1";
// const CELL_4_1 = ".s-cell-4-1";
// const CELL_5_1 = ".s-cell-5-1";

// TODO BB-1694 - Update the url after adding the Measure Value Filter example to the menu
// fixture("Measure Value Filter")
//     .page(config.url)
//     .beforeEach(loginUsingLoginForm(`${config.url}/hidden/measure-value-filter`));

// test("should be initiated with no filter", async t => {
//     await waitForPivotTableStopLoading(t);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Deerfield Beach", CELL_0_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Highland Village", CELL_1_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Irving", CELL_2_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Montgomery", CELL_3_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "San Jose - Blossom Hill", CELL_4_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "San Jose - Saratoga", CELL_5_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "420,529", CELL_0_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "756,423", CELL_1_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "573,475", CELL_2_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "1,406,548", CELL_3_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "701,653", CELL_4_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "555,725", CELL_5_1);
// });

// test("should filter the data with a comparison operator", async t => {
//     await t.click(Selector(FILTER_PRESET_GREATER_THAN_FILTER));
//     await waitForPivotTableStopLoading(t);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Highland Village", CELL_0_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Montgomery", CELL_1_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "San Jose - Blossom Hill", CELL_2_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "756,423", CELL_0_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "1,406,548", CELL_1_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "701,653", CELL_2_1);
// });

// test("should filter the data with a range operator", async t => {
//     await t.click(Selector(FILTER_PRESET_BETWEEN_FILTER));
//     await waitForPivotTableStopLoading(t);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Highland Village", CELL_0_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "Irving", CELL_1_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "San Jose - Blossom Hill", CELL_2_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "San Jose - Saratoga", CELL_3_0);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "756,423", CELL_0_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "573,475", CELL_1_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "701,653", CELL_2_1);
//     await checkCellValue(t, PIVOT_TABLE_MEASURE_VALUE_FILTER, "555,725", CELL_3_1);
// });
