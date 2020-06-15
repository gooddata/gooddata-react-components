// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import fs from "fs";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { enableDownloadForHeadlessChrome, exportToCSV, exportToExcel } from "./utils/exportUtils";

const exportButtonsCSS = ".gd-button-secondary";
const getExportCSVButton = chartSelector => {
    return chartSelector
        .parent()
        .find(exportButtonsCSS)
        .withText("Export CSV");
};
const getExportExcelButton = chartSelector => {
    return chartSelector
        .parent()
        .find(exportButtonsCSS)
        .withText("Export XLSX");
};
const getExportWithCustomNameButton = chartSelector => {
    return chartSelector
        .parent()
        .find(exportButtonsCSS)
        .withText("Export with custom name CustomName");
};

fixture("Export").beforeEach(loginUserAndNavigate(`${config.url}/export`));

test("Export chart data", async t => {
    const barChart = Selector(".s-bar-chart");
    const fileName = "BarChart";
    await enableDownloadForHeadlessChrome(t);
    await t
        .hover(getExportExcelButton(barChart))
        .click(getExportExcelButton(barChart))
        .expect(fs.existsSync(await exportToExcel(fileName)))
        .ok(`Excel file of Bar chart isn't exported`)
        .click(await getExportCSVButton(barChart))
        .expect(fs.existsSync(await exportToCSV(fileName)))
        .ok(`CSV file of Bar chart isn't exported`)
        .click(await getExportWithCustomNameButton(barChart))
        .expect(fs.existsSync(await exportToCSV("CustomName")))
        .ok(`CSV with custom name file of Bar chart isn't exported`);
});

test("Export tables data", async t => {
    const tableChart = Selector(".s-table");
    const fileName = "Table";
    await enableDownloadForHeadlessChrome(t);
    await t
        .hover(getExportExcelButton(tableChart))
        .click(getExportExcelButton(tableChart))
        .expect(fs.existsSync(await exportToExcel(fileName)))
        .ok(`Excel file of table isn't exported`)
        .click(await getExportCSVButton(tableChart))
        .expect(fs.existsSync(await exportToCSV(fileName)))
        .ok(`CSV file of table isn't exported`);
});

test("Export headline data", async t => {
    const headline = Selector(".s-headline");
    await enableDownloadForHeadlessChrome(t);
    await t
        .hover(getExportExcelButton(headline))
        .click(getExportExcelButton(headline))
        .expect(fs.existsSync(await exportToExcel("Headline")))
        .ok(`Excel file of headline isn't exported`)
        .click(await getExportCSVButton(headline))
        .expect(fs.existsSync(await exportToCSV("Headline")))
        .ok(`CSV file of headline isn't exported`);
});
