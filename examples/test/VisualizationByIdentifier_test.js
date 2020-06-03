// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { waitForPivotTableStopLoading, checkCellValue } from "./utils/pivotTableHelpers";
import { HIGHCHART_VERSION } from "./utils/constants";

const CELL_0_1 = ".s-cell-0-1";
const CELL_1_1 = ".s-cell-1-1";
const CELL_2_1 = ".s-cell-2-1";

fixture("Visualization by identifier").beforeEach(
    loginUserAndNavigate(`${config.url}/visualization/visualization-by-identifier`),
);

async function checkRenderedChart(selector, t) {
    const loading = Selector(".s-loading");
    const chart = Selector(selector);
    await t
        .expect(loading.exists)
        .ok()
        .expect(chart.exists)
        .ok()
        .expect(chart.textContent)
        .ok();
}

test("Chart visualization should render", async t => {
    const chart = Selector(".s-visualization-chart svg"); // could need timeout ie 20 secs to work
    await t
        .expect(chart.exists)
        .ok()
        .expect(chart.textContent)
        .eql(
            `Created with Highcharts ${HIGHCHART_VERSION}Month/Year (Date)$ Total Sales$2,707,184$2,625,617$2,579,553Jan 2016Feb 2016Mar 201601M2M3M`,
        );
});

test("Custom visualization should render", async t => {
    const chart = Selector(".s-visualization-custom .recharts-surface");
    const legend = Selector(".s-visualization-custom .recharts-legend-wrapper");
    await t
        .expect(chart.exists)
        .ok()
        .expect(legend.textContent)
        .eql(
            "$ Franchise Fees (Ad Royalty)$ Franchise Fees (Initial Franchise Fee)$ Franchise Fees (Ongoing Royalty)",
        );
});

test("Table visualization should render", async t => {
    const table = Selector(".s-visualization-table");
    const tableHeader = Selector(
        ".s-visualization-table .s-table-measure-column-header-group-cell-0 .s-header-cell-label",
    );

    await t.expect(table.exists).eql(true);
    await t.expect(tableHeader.exists).eql(true);
    await t.expect(tableHeader.textContent).eql("Month/Year (Date)");
});

test("Bar chart should render", async t => {
    await checkRenderedChart(".s-visualization-bar", t);
});

test("Line chart should render", async t => {
    await checkRenderedChart(".s-visualization-line", t);
});

test("Area chart should render", async t => {
    await checkRenderedChart(".s-visualization-area", t);
});

test("Headline chart should render", async t => {
    await checkRenderedChart(".s-visualization-headline", t);
});

test("Scatter plot should render", async t => {
    await checkRenderedChart(".s-visualization-scatter", t);
});

test("Bubble chart should render", async t => {
    await checkRenderedChart(".s-visualization-bubble", t);
});

test("Pie chart should render", async t => {
    await checkRenderedChart(".s-visualization-pie", t);
});

test("Donut chart should render", async t => {
    await checkRenderedChart(".s-visualization-donut", t);
});

test("Treemap should render", async t => {
    await checkRenderedChart(".s-visualization-treemap", t);
});

test("Heatmap should render", async t => {
    await checkRenderedChart(".s-visualization-heatmap", t);
});

test("GeoPushpinChart should render", async t => {
    await checkRenderedChart(".s-visualization-geo-pushpin", t);
});

test("Measure value filter should render", async t => {
    const chartValues = Selector(
        "#measure-value-filter-column-chart ~ div .s-visualization-chart .highcharts-data-label",
    );
    await t
        .expect(chartValues.exists)
        .ok()
        .expect(chartValues.nth(0).textContent)
        .eql("53,986,994.50")
        .expect(chartValues.nth(1).textContent)
        .eql("57,264,327.95");
});

test("Measure Value Filter that treats null as zero should render", async t => {
    const pivotTableSelector = Selector("#measure-value-filter-treat-null-as-zero ~ div .s-pivot-table");

    await waitForPivotTableStopLoading(t, pivotTableSelector);

    await checkCellValue(t, pivotTableSelector, "1.00", CELL_0_1);
    await checkCellValue(t, pivotTableSelector, "–", CELL_1_1);
    await checkCellValue(t, pivotTableSelector, "–", CELL_2_1);
});
