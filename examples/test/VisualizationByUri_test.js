// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUserAndNavigate } from "./utils/helpers";
import { HIGHCHART_VERSION } from "./utils/constants";

fixture("Visualization by URI").beforeEach(
    loginUserAndNavigate(`${config.url}/visualization/visualization-by-uri`),
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

test("Table visualization should render", async t => {
    const table = Selector(".s-visualization-table");
    const tableHeader = Selector(
        ".s-visualization-table .gd-column-group-header--first .s-header-cell-label",
    );
    await t
        .expect(table.exists)
        .ok()
        .expect(tableHeader.textContent)
        .eql("Month/Year (Date)");
});

test("Bar chart should render with data sorted in descending order", async t => {
    await checkRenderedChart(".s-visualization-bar", t);
    const chartValues = Selector(".s-visualization-bar .highcharts-data-label");

    await t
        .expect(chartValues.nth(0).textContent)
        .eql("$16,077,036")
        .expect(chartValues.nth(1).textContent)
        .eql("$13,851,506")
        .expect(chartValues.nth(2).textContent)
        .eql("$9,392,461")
        .expect(chartValues.nth(3).textContent)
        .eql("$8,856,994")
        .expect(chartValues.nth(4).textContent)
        .eql("$8,428,501")
        .expect(chartValues.nth(5).textContent)
        .eql("$8,287,671")
        .expect(chartValues.nth(6).textContent)
        .eql("$8,265,962")
        .expect(chartValues.nth(7).textContent)
        .eql("$6,276,176")
        .expect(chartValues.nth(8).textContent)
        .eql("$4,589,119")
        .expect(chartValues.nth(9).textContent)
        .eql("$4,476,814")
        .expect(chartValues.nth(10).textContent)
        .eql("$4,054,336");
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
    const geoPushpinChart = Selector(".s-visualization-geo-pushpin");
    await t
        .expect(geoPushpinChart.exists)
        .ok()
        .expect(geoPushpinChart.find(".mapboxgl-canvas").exists)
        .ok();
});
