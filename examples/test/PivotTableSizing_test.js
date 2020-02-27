// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { checkCellValue, loginUsingLoginForm } from "./utils/helpers";

fixture("Pivot Table Sizing")
    .page(config.url)
    .beforeEach(loginUsingLoginForm(`${config.url}/hidden/pivot-table-sizing`));

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
