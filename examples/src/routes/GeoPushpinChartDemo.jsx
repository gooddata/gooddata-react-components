// (C) 2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";
import GeoPushpinChartClusteringExample from "../components/GeoPushpinChartClusteringExample";
import GeoPushpinChartWithColorLegendExample from "../components/GeoPushpinChartWithColorLegendExample";
import GeoPushpinChartWithCategoryLegendExample from "../components/GeoPushpinChartWithCategoryLegendExample";
import GeoPushpinChartConfigurationExample from "../components/GeoPushpinChartConfigurationExample";
import GeoPushpinChartConfigurationLegendExample from "../components/GeoPushpinChartConfigurationLegendExample";
import GeoPushpinChartConfigurationViewportExample from "../components/GeoPushpinChartConfigurationViewportExample";

import GeoPushpinChartClusteringExampleSRC from "!raw-loader!../components/GeoPushpinChartClusteringExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import GeoPushpinChartWithColorLegendExampleSRC from "!raw-loader!../components/GeoPushpinChartWithColorLegendExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import GeoPushpinChartWithCategoryLegendExampleSRC from "!raw-loader!../components/GeoPushpinChartWithCategoryLegendExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import GeoPushpinChartConfigurationExampleSRC from "!raw-loader!../components/GeoPushpinChartConfigurationExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import GeoPushpinChartConfigurationLegendExampleSRC from "!raw-loader!../components/GeoPushpinChartConfigurationLegendExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import GeoPushpinChartConfigurationViewportExampleSRC from "!raw-loader!../components/GeoPushpinChartConfigurationViewportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const GeoPushpinChartDemo = () => (
    <div>
        <h1>Geo Pushpin Chart</h1>

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-clustering">Example of Geo Pushpin Chart with Clustering</h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartClusteringExample />}
            source={GeoPushpinChartClusteringExampleSRC}
        />

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-size-color">Example of Geo Pushpin Chart with Size and Color Legend</h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartWithColorLegendExample />}
            source={GeoPushpinChartWithColorLegendExampleSRC}
        />

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-category">Example of Geo Pushpin Chart with Size and Category Legend</h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartWithCategoryLegendExample />}
            source={GeoPushpinChartWithCategoryLegendExampleSRC}
        />

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-configuration">Example of Geo Pushpin Chart with Geo Configuration</h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartConfigurationExample />}
            source={GeoPushpinChartConfigurationExampleSRC}
        />

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-configuration-legend">
            Example of Geo Pushpin Chart with Configuration - Legend
        </h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartConfigurationLegendExample />}
            source={GeoPushpinChartConfigurationLegendExampleSRC}
        />

        <hr className="separator" />

        <h2 id="geo-pushpin-chart-configuration-viewport">
            Example of Geo Pushpin Chart with Configuration - Viewport
        </h2>
        <ExampleWithSource
            for={() => <GeoPushpinChartConfigurationViewportExample />}
            source={GeoPushpinChartConfigurationViewportExampleSRC}
        />
    </div>
);

export default GeoPushpinChartDemo;
