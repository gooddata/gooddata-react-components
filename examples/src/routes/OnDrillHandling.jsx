// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import BarChartOnDrillExample from "../components/BarChartOnDrillExample";
import HeadlineOnDrillExample from "../components/HeadlineOnDrillExample";
import VisualizationOnDrillExample from "../components/VisualizationOnDrillExample";

import BarChartOnDrillExampleSRC from "!raw-loader!../components/BarChartOnDrillExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import HeadlineOnDrillExampleSRC from "!raw-loader!../components/HeadlineOnDrillExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationOnDrillExampleSRC from "!raw-loader!../components/VisualizationOnDrillExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const OnDrillHandling = () => (
    <div>
        <h1>New drill handling by onDrill</h1>

        <p>Examples how onDrill handler is used on components and what is structure of event</p>

        <hr className="separator" />

        <h2 id="bar-chart">Bar chart</h2>
        <ExampleWithSource for={BarChartOnDrillExample} source={BarChartOnDrillExampleSRC} />

        <hr className="separator" />

        <h2 id="headline">Headline</h2>
        <ExampleWithSource for={HeadlineOnDrillExample} source={HeadlineOnDrillExampleSRC} />

        <hr className="separator" />

        <h2 id="visualization">Visualization</h2>
        <ExampleWithSource for={VisualizationOnDrillExample} source={VisualizationOnDrillExampleSRC} />
    </div>
);

export default OnDrillHandling;
