// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { loginUserAndNavigate } from "./utils/helpers";
import { waitForPivotTableStopLoading, checkCellValue } from "./utils/pivotTableHelpers";
import config from "./utils/config";

const CELL_0_1 = ".s-cell-0-1";
const CELL_0_2 = ".s-cell-0-2";
const CELL_3_1 = ".s-cell-3-1";
const CELL_3_2 = ".s-cell-3-2";

const markers = ".highcharts-markers *";
const dataLabels = ".highcharts-data-label tspan";
const tooltipCssSelector = ".gd-viz-tooltip-item .gd-viz-tooltip-value";

fixture("Time Over Time Comparison").beforeEach(
    loginUserAndNavigate(`${config.url}/time-over-time-comparison`),
);

test("should compare the data with a comparing to the SPPY in column chart", async t => {
    const columnChart = Selector(".s-compare-to-the-same-period-previous-year-example-1");
    const chartValues = columnChart.find(dataLabels);

    await t
        .expect(chartValues.exists)
        .ok()
        .expect(chartValues.nth(0).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(1).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(2).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(3).textContent)
        .eql("$21,894,393")
        .expect(chartValues.nth(4).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(5).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(6).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(7).textContent)
        .eql("$21,894,393");
});

test("should compare the data with a comparing to the SPPY in pivot table", async t => {
    const pivotTableSelector = Selector(".s-compare-to-the-same-period-previous-year-example-2");

    await waitForPivotTableStopLoading(t, pivotTableSelector);

    await checkCellValue(t, pivotTableSelector, "$23,737,061", CELL_0_1);
    await checkCellValue(t, pivotTableSelector, "$23,737,061", CELL_0_2);
    await checkCellValue(t, pivotTableSelector, "$21,894,393", CELL_3_1);
    await checkCellValue(t, pivotTableSelector, "$21,894,393", CELL_3_2);
});

test("should compare the data with a comparing to the SPPY in bar chart", async t => {
    const barChart = Selector(".s-compare-to-the-same-period-previous-year-example-3");
    const chartValues = barChart.find(dataLabels);

    await t
        .expect(chartValues.exists)
        .ok()
        .expect(chartValues.nth(0).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(1).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(2).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(3).textContent)
        .eql("$21,894,393")
        .expect(chartValues.nth(4).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(5).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(6).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(7).textContent)
        .eql("$21,894,393");
});

test("should compare the data with a comparing to the SPPY in line chart", async t => {
    const lineChart = Selector(".s-compare-to-the-same-period-previous-year-example-4");
    const chartMarkers = lineChart.find(markers);

    await t
        .expect(chartMarkers.exists)
        .ok()
        .expect(chartMarkers.count)
        .eql(8);
});

test("should compare the data with a comparing to the SPPY in combo chart", async t => {
    const comboChart = Selector(".s-compare-to-the-same-period-previous-year-example-5");
    const chartMarkers = comboChart.find(markers);
    const chartValues = comboChart.find(dataLabels);

    await t
        .expect(chartMarkers.exists)
        .ok()
        .expect(chartMarkers.count)
        .eql(4)
        .expect(chartValues.nth(0).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(1).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(2).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(3).textContent)
        .eql("$21,894,393")
        .expect(chartValues.nth(4).textContent)
        .eql("$23,737,061")
        .expect(chartValues.nth(5).textContent)
        .eql("$23,754,681")
        .expect(chartValues.nth(6).textContent)
        .eql("$23,170,443")
        .expect(chartValues.nth(7).textContent)
        .eql("$21,894,393");
});

test("should compare the data with a comparing to the SPPY in head line", async t => {
    const headLine = Selector(".s-compare-to-the-same-period-previous-year-example-6");

    const primaryItem = headLine.find(".s-headline-primary-item");
    const secondaryItem = headLine.find(".s-headline-secondary-item");

    await t
        .expect(primaryItem.textContent)
        .eql("$92,556,577")
        .expect(secondaryItem.textContent)
        .eql("$92,556,577$ Total Sales - SP year ago");
});

test("should compare the data with a comparing to the SPPY in bullet chart", async t => {
    const bulletCharts = Selector(".s-compare-to-the-same-period-previous-year-example-7");
    const tooltip = Selector(tooltipCssSelector);
    const legend = ".viz-legend .series-item";

    await t
        .expect(bulletCharts.exists)
        .ok()
        .hover(bulletCharts.find(".highcharts-series-0 rect").nth(0))
        .expect(tooltip.nth(1).textContent)
        .eql("$8,856,994")
        .hover(bulletCharts.find(".highcharts-series-1 .highcharts-bullet-target").nth(0))
        .expect(tooltip.nth(1).textContent)
        .eql("$8,856,994")
        .click(bulletCharts.find(legend).nth(0))
        .hover(bulletCharts.find(".highcharts-series-2 rect").nth(0))
        .expect(tooltip.nth(1).textContent)
        .eql("223,841");
});
