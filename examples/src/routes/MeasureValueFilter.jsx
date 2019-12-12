// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";
import MeasureValueFilterExample from "../components/MeasureValueFilterExample";
import MeasureValueFilterShownInPercentageExample from "../components/MeasureValueFilterShownInPercentageExample";
import MeasureValueFilterStackedToHundredPercentExample from "../components/MeasureValueFilterStackedToHundredPercentExample";
import MeasureValueFilterFormattedInPercentageExample from "../components/MeasureValueFilterFormattedInPercentageExample";

import MeasureValueFilterExampleSRC from "!raw-loader!../components/MeasureValueFilterExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterShownInPercentageExampleSRC from "!raw-loader!../components/MeasureValueFilterShownInPercentageExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterStackedToHundredPercentExampleSRC from "!raw-loader!../components/MeasureValueFilterStackedToHundredPercentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterFormattedInPercentageExampleSRC from "!raw-loader!../components/MeasureValueFilterFormattedInPercentageExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const MeasureValueFilter = () => (
    <div>
        <h1>Filter by Measure Value</h1>
        <p>
            Here is how you can filter the entire insight by the value of a measure. The granularity is
            defined by the attributes in the insight.
        </p>
        <hr className="separator" />
        <h2>Comparison and range filters</h2>
        <p>Example of filtering of visualization by either one or two measure values.</p>
        <div className="s-measure-value-filter-example-1">
            <ExampleWithSource for={MeasureValueFilterExample} source={MeasureValueFilterExampleSRC} />
        </div>
        <h2>Filter by measure value shown in %</h2>
        <p>
            When visualization is filtered by a measure that is shown in %, the filter value is in{" "}
            <b>the original measure scale</b> and not in the percentage scale that is displayed in the
            visualization.
        </p>
        <div className="s-measure-value-filter-example-2">
            <ExampleWithSource
                for={MeasureValueFilterShownInPercentageExample}
                source={MeasureValueFilterShownInPercentageExampleSRC}
            />
        </div>
        <h2>Filter by measure value stacked to 100%</h2>
        <p>
            When visualization is filtered by a measure that is stacked to 100%, the filter value is in{" "}
            <b>the original measure scale</b> and not in the percentage scale that is displayed in the
            visualization.
        </p>
        <div className="s-measure-value-filter-example-3">
            <ExampleWithSource
                for={MeasureValueFilterStackedToHundredPercentExample}
                source={MeasureValueFilterStackedToHundredPercentExampleSRC}
            />
        </div>
        <h2>Filter by measure value formatted in %</h2>
        <p>
            When the visualization is filtered by a measure that is formatted in %, the filter value is in{" "}
            <b>the form of a ratio</b> (for instance 0.5 which is 50%) and not in the percentage scale. This
            applies to measures that have percentage format set by measure <em>format</em> property,
            calculated measures with percentage format set in metadata catalog, and arithmetic measures with{" "}
            <em>change</em> operator.
        </p>
        <div className="s-measure-value-filter-example-4">
            <ExampleWithSource
                for={MeasureValueFilterFormattedInPercentageExample}
                source={MeasureValueFilterFormattedInPercentageExampleSRC}
            />
        </div>
    </div>
);

export default MeasureValueFilter;
