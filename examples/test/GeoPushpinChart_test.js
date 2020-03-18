// (C) 2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { loginUsingLoginForm } from "./utils/helpers";
import { DEFAULT_COLOR_PALETTE } from "../src/utils/colors";

fixture("Geo Pushpin Chart Demo")
    .page(config.url)
    .beforeEach(loginUsingLoginForm(`${config.url}/geo-pushpin-chart`));

const CHART_WITH_CLUSTERING = Selector(".s-geo-pushpin-chart-clustering");
const CHART_WITH_COLOR_LEGEND = Selector(".s-geo-pushpin-chart-color");
const CHART_WITH_CATEGORY_LEGEND = Selector(".s-geo-pushpin-chart-category");
const CHART_WITH_CONFIGURATION = Selector(".s-geo-pushpin-chart-configuration");
const CHART_WITH_CONFIGURATION_VIEWPORT = Selector(".s-geo-pushpin-chart-configuration-viewport");

test("should render all charts", async t => {
    await t.expect(CHART_WITH_CLUSTERING.exists).ok();
    await t.expect(CHART_WITH_COLOR_LEGEND.exists).ok();
    await t.expect(CHART_WITH_CATEGORY_LEGEND.exists).ok();
    await t.expect(CHART_WITH_CONFIGURATION.exists).ok();
    await t.expect(CHART_WITH_CONFIGURATION_VIEWPORT.exists).ok();

    await t.expect(CHART_WITH_CLUSTERING.find("canvas").exists).ok();
    await t.expect(CHART_WITH_COLOR_LEGEND.find("canvas").exists).ok();
    await t.expect(CHART_WITH_CATEGORY_LEGEND.find("canvas").exists).ok();
    await t.expect(CHART_WITH_CONFIGURATION.find("canvas").exists).ok();
    await t.expect(CHART_WITH_CONFIGURATION_VIEWPORT.find("canvas").exists).ok();
});

test("should not render the legend with Clustering", async t => {
    await t.expect(CHART_WITH_CLUSTERING.find(".s-geo-legend").exists).notOk();
});

test("should render Size and Color legend", async t => {
    await t.expect(CHART_WITH_COLOR_LEGEND.find(".color-legend").exists).ok();
    await t.expect(CHART_WITH_COLOR_LEGEND.find(".pushpin-size-legend").exists).ok();
    await t
        .expect(CHART_WITH_COLOR_LEGEND.find(".pushpin-size-legend .metric-name").textContent)
        .eql("Population:");
});

test("should render Category legend", async t => {
    const categoryLegend = CHART_WITH_CATEGORY_LEGEND.find(".s-geo-category-legend");

    await t.expect(categoryLegend.exists).ok();

    const legendIcons = categoryLegend.find(".series-icon");
    const defaultColorsNumber = DEFAULT_COLOR_PALETTE.length;
    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < legendIcons.length; index += 1) {
        await t
            .expect(legendIcons.nth(index).getStyleProperty("background-color"))
            .eql(DEFAULT_COLOR_PALETTE[index % defaultColorsNumber]);
    }
    /* eslint-enable no-await-in-loop */

    await t.click(legendIcons.nth(1));
    await t.expect(legendIcons.nth(1).getStyleProperty("background-color")).eql("rgb(204, 204, 204)");
});
