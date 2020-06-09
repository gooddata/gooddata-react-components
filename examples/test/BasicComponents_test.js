// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { checkRenderChart, loginUserAndNavigate } from "./utils/helpers";

fixture("Basic components").beforeEach(loginUserAndNavigate(config.url));

const tooltipItem = Selector(".gd-viz-tooltip-item");
const tooltipValue = tooltipItem.find(".gd-viz-tooltip-value");
const tooltipTitle = tooltipItem.find(".gd-viz-tooltip-title");
const xAxisTitleCssSelector = ".highcharts-xaxis .highcharts-axis-title";
const yAxisTitleCssSelector = ".highcharts-yaxis .highcharts-axis-title";
const valuePrimaryYAxisCssSelector = ".highcharts-yaxis-labels.s-highcharts-primary-yaxis";
const valueXAxisCssSelector = ".highcharts-xaxis-labels";

test("Column chart should render", async t => {
    await checkRenderChart(".s-column-chart", t);
});

test("Bar chart should render", async t => {
    await checkRenderChart(".s-bar-chart", t);
});

test("Line chart should render", async t => {
    await checkRenderChart(".s-line-chart", t);
});

test("Line chart should have custom colors", async t => {
    const lineChart = Selector(".s-line-chart");
    const CUSTOM_COLORS = [
        "rgb(195, 49, 73)",
        "rgb(168, 194, 86)",
        "rgb(243, 217, 177)",
        "rgb(194, 153, 121)",
    ];

    await t.expect(lineChart.exists).ok();
    const legendIcons = lineChart.find(".series-icon");

    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < CUSTOM_COLORS.length; index += 1) {
        await t
            .expect(await legendIcons.nth(index).getStyleProperty("background-color"))
            .eql(CUSTOM_COLORS[index]);
    }
    /* eslint-enable no-await-in-loop */
});

test("Stacked Area chart should render", async t => {
    const stackedAreaChart = Selector(".s-stacked-area-chart");
    await checkRenderChart(stackedAreaChart, t);

    const trackerCssSelector = ".highcharts-series-0 path.highcharts-area";
    const legendNames = stackedAreaChart.find(".series-name");

    await t
        .click(legendNames.nth(1))
        .click(legendNames.nth(2))
        .click(legendNames.nth(3))
        .hover(stackedAreaChart.find(trackerCssSelector))
        .expect(tooltipTitle.nth(0).textContent)
        .eql("Month (Date)")
        .expect(tooltipValue.nth(0).textContent)
        .eql("Jul")
        .expect(tooltipTitle.nth(1).textContent)
        .eql("$ Franchise Fees")
        .expect(tooltipValue.nth(1).textContent)
        .eql("399,077")
        .expect(stackedAreaChart.find(xAxisTitleCssSelector).textContent)
        .eql("Month (Date)")
        .expect(stackedAreaChart.find(valuePrimaryYAxisCssSelector).textContent)
        .eql("0100k200k300k400k500k")
        .expect(stackedAreaChart.find(valueXAxisCssSelector).textContent)
        .eql("JanFebMarAprMayJunJulAugSepOctNovDec")
        .expect(legendNames.nth(0).textContent)
        .eql("$ Franchise Fees");
});

test("Pie chart should render", async t => {
    await checkRenderChart(".s-pie-chart", t);
});

test("Table should render", async t => {
    await checkRenderChart(".s-table", t);
});

test("KPI has correct number", async t => {
    const kpi = Selector(".gdc-kpi", { timeout: 20000 });
    await t
        .expect(kpi.exists)
        .ok()
        .expect(kpi.textContent)
        .eql("$92,556,577");
});

test("Donut chart should render", async t => {
    const donutChart = Selector(".s-donut-chart");
    await checkRenderChart(".s-donut-chart", t);

    const legend = donutChart.find(".viz-legend .series-item");
    const highchartsPoint = donutChart.find(".highcharts-series.highcharts-series-0 .highcharts-point");
    await t
        .hover(highchartsPoint.nth(2))
        .expect(tooltipTitle.textContent)
        .eql("$ Franchise Fees (Initial Franchise Fee)")
        .expect(tooltipValue.textContent)
        .eql("40,000")
        .expect(legend.nth(0).textContent)
        .eql("$ Franchise Fees (Ongoing Royalty)")
        .expect(legend.nth(1).textContent)
        .eql("$ Franchise Fees (Ad Royalty)")
        .expect(legend.nth(2).textContent)
        .eql("$ Franchise Fees (Initial Franchise Fee)");
});

test("Scatter plot should render", async t => {
    const scatterPlot = Selector(".s-scatter-plot");
    await checkRenderChart(scatterPlot, t);

    const trackerCssSelector = ".highcharts-series-0.highcharts-tracker path";

    await t
        .hover(scatterPlot.find(trackerCssSelector).nth(0))
        .expect(tooltipTitle.nth(0).textContent)
        .eql("Location Resort")
        .expect(tooltipValue.nth(0).textContent)
        .eql("Deerfield Beach")
        .expect(tooltipTitle.nth(1).textContent)
        .eql("$ Franchise Fees")
        .expect(tooltipValue.nth(1).textContent)
        .eql("420,529")
        .expect(tooltipTitle.nth(2).textContent)
        .eql("$ Franchised Sales")
        .expect(tooltipValue.nth(2).textContent)
        .eql("4,476,814")
        .expect(scatterPlot.find(xAxisTitleCssSelector).textContent)
        .eql("$ Franchise Fees")
        .expect(scatterPlot.find(yAxisTitleCssSelector).textContent)
        .eql("$ Franchised Sales")
        .expect(scatterPlot.find(valuePrimaryYAxisCssSelector).textContent)
        .eql("5M10M15M020M")
        .expect(scatterPlot.find(valueXAxisCssSelector).textContent)
        .eql("400k500k600k700k800k900k1 000k1 100k1 200k1 300k1 400k");
});

test("Bubble chart should render", async t => {
    const bubbleChart = Selector(".s-bubble-chart");
    await checkRenderChart(bubbleChart, t);

    const trackerCssSelector = ".highcharts-series-8.highcharts-tracker path";
    const legendNames = bubbleChart.find(".series-name");

    await t
        .hover(bubbleChart.find(trackerCssSelector))
        .expect(tooltipTitle.nth(0).textContent)
        .eql("Location Resort")
        .expect(tooltipValue.nth(0).textContent)
        .eql("Montgomery")
        .expect(tooltipTitle.nth(1).textContent)
        .eql("$ Franchise Fees")
        .expect(tooltipValue.nth(1).textContent)
        .eql("1,406,548")
        .expect(tooltipTitle.nth(2).textContent)
        .eql("$ Franchised Sales")
        .expect(tooltipValue.nth(2).textContent)
        .eql("16,077,036")
        .expect(tooltipTitle.nth(3).textContent)
        .eql("Avg Check Size by Server")
        .expect(tooltipValue.nth(3).textContent)
        .eql("$97.88")
        .expect(bubbleChart.find(xAxisTitleCssSelector).textContent)
        .eql("$ Franchise Fees")
        .expect(bubbleChart.find(yAxisTitleCssSelector).textContent)
        .eql("$ Franchised Sales")
        .expect(bubbleChart.find(valuePrimaryYAxisCssSelector).textContent)
        .eql("05M10M15M20M")
        .expect(bubbleChart.find(valueXAxisCssSelector).textContent)
        .eql("400k600k800k1 000k1 200k1 400k")
        .expect(legendNames.nth(0).textContent)
        .eql("Aventura");
});

test("Treemap should render", async t => {
    await checkRenderChart(".s-tree-map", t);
});

test("Headline should render", async t => {
    await checkRenderChart(".s-headline", t);
});

test("Heatmap should render", async t => {
    await checkRenderChart(".s-heat-map", t);
});

test("GeoPushpinChart should render", async t => {
    const geoPushpinChart = Selector(".s-geo-pushpin-chart-category");

    await t.expect(geoPushpinChart.exists).ok();
    await t.expect(geoPushpinChart.find("canvas").exists).ok();
});
