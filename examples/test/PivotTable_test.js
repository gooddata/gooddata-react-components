// (C) 2007-2020 GoodData Corporation
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { checkCellValue } from "./utils/pivotTableHelpers";

fixture("Pivot Table").beforeEach(loginUserAndNavigate(`${config.url}/hidden/pivot-table`));

test("should render all tables", async t => {
    const firstCellFirstRow = ".s-cell-0-0";
    await checkCellValue(t, ".s-measures-row-attributes-and-column-attributes", "Alabama", firstCellFirstRow);
    await checkCellValue(t, ".s-measures-and-column-attributes", "406,007", firstCellFirstRow);
    await checkCellValue(t, ".s-measures-and-attributes", "Alabama", firstCellFirstRow);
    await checkCellValue(t, ".s-measures-only", "4,214,353", firstCellFirstRow);
    await checkCellValue(t, ".s-row-attributes-only", "Alabama", firstCellFirstRow);
    await checkCellValue(t, ".s-error", null, null);
});
