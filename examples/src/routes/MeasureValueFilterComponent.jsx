// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import MeasureValueFilterComponentExample from "../components/MeasureValueFilterComponentExample";
import MeasureValueFilterComponentExampleSRC from "!raw-loader!../components/MeasureValueFilterComponentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterComponentPercentageExample from "../components/MeasureValueFilterComponentPercentageExample";
import MeasureValueFilterComponentPercentageExampleSRC from "!raw-loader!../components/MeasureValueFilterComponentPercentageExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import MeasureValueFilterComponentRatioExample from "../components/MeasureValueFilterComponentRatioExample";
import MeasureValueFilterComponentRatioExampleSRC from "!raw-loader!../components/MeasureValueFilterComponentRatioExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

import MeasureValueFilterDropdownComponentExample from "../components/MeasureValueFilterDropdownComponentExample";
import MeasureValueFilterDropdownComponentExampleSRC from "!raw-loader!../components/MeasureValueFilterDropdownComponentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const MeasureValueFilterComponent = () => (
    <div>
        <h1>Measure Value Filter Component</h1>
        <p>The example below shows general usage of the component for managing the measure value filter.</p>
        <div className="s-measure-value-filter-example-1">
            <ExampleWithSource
                for={MeasureValueFilterComponentExample}
                source={MeasureValueFilterComponentExampleSRC}
            />
        </div>
        <p>
            This example shows the component for setting up a measure value filter with a measure formatted as
            a percentage.
        </p>
        <div className="s-measure-value-filter-example-2">
            <ExampleWithSource
                for={MeasureValueFilterComponentPercentageExample}
                source={MeasureValueFilterComponentPercentageExampleSRC}
            />
        </div>
        <p>
            This example shows the component for setting up a measure value filter with a measure shown as a
            percentage.
        </p>
        <div className="s-measure-value-filter-example-3">
            <ExampleWithSource
                for={MeasureValueFilterComponentRatioExample}
                source={MeasureValueFilterComponentRatioExampleSRC}
            />
        </div>
        <hr className="separator" />
        <h2>Dropdown with custom button</h2>
        <p>Following example shows the dropdown component to be handled on your own using a custom button.</p>
        <div className="s-measure-value-filter-example-4">
            <ExampleWithSource
                for={MeasureValueFilterDropdownComponentExample}
                source={MeasureValueFilterDropdownComponentExampleSRC}
            />
        </div>
    </div>
);

export default MeasureValueFilterComponent;
