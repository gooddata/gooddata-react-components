// (C) 2007-2018 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUsingGreyPages } from "./utils/helpers";
import { HIGHCHART_VERSION } from "./utils/constants";

fixture("Visualization by identifier") // eslint-disable-line no-undef
    .page(config.url)
    .beforeEach(loginUsingGreyPages(`${config.url}/visualization/visualization-by-identifier`));

async function checkRenderedChart(selector, t) {
    const loading = Selector(".s-loading");
    const chart = Selector(selector);
    await t
        .expect(loading.exists)
        .ok()
        .expect(chart.exists)
        .ok()
        .expect(chart.textContent);
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
        ".s-visualization-table .gd-column-group-header--first .s-header-cell-label",
    );
    await t
        .expect(table.exists)
        .ok()
        .expect(tableHeader.textContent)
        .eql("Month/Year (Date)");
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
