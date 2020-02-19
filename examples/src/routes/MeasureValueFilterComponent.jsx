// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import MeasureValueFilterDropdownExample from "../components/MeasureValueFilterDropdownExample";
import MeasureValueFilterDropdownExampleSRC from "!raw-loader!../components/MeasureValueFilterDropdownExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterDropdownPercentageExample from "../components/MeasureValueFilterDropdownPercentageExample";
import MeasureValueFilterDropdownPercentageExampleSRC from "!raw-loader!../components/MeasureValueFilterDropdownPercentageExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterDropdownRatioExample from "../components/MeasureValueFilterDropdownRatioExample";
import MeasureValueFilterDropdownRatioExampleSRC from "!raw-loader!../components/MeasureValueFilterDropdownRatioExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const MeasureValueFilterComponent = () => (
    <div>
        <h1>Measure Value Filter Component</h1>
        <p>This is a set of components for managing measure value filters.</p>
        <hr className="separator" />
        <h2>Dropdown</h2>
        <p>This example shows the dropdown component for setting up a measure value filter.</p>
        <div className="s-measure-value-filter-example-1">
            <ExampleWithSource
                for={MeasureValueFilterDropdownExample}
                source={MeasureValueFilterDropdownExampleSRC}
            />
        </div>
        <p>
            This example shows the dropdown component for setting up a measure value filter with a measure
            formatted as a percentage.
        </p>
        <div className="s-measure-value-filter-example-2">
            <ExampleWithSource
                for={MeasureValueFilterDropdownPercentageExample}
                source={MeasureValueFilterDropdownPercentageExampleSRC}
            />
        </div>
        <p>
            This example shows the dropdown component for setting up a measure value filter with a measure
            shown as a percentage.
        </p>
        <div className="s-measure-value-filter-example-3">
            <ExampleWithSource
                for={MeasureValueFilterDropdownRatioExample}
                source={MeasureValueFilterDropdownRatioExampleSRC}
            />
        </div>
    </div>
);

export default MeasureValueFilterComponent;
