// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import MeasureValueFilterDropdownExample from "../components/MeasureValueFilterDropdownExample";
import MeasureValueFilterDropdownExampleSRC from "!raw-loader!../components/MeasureValueFilterDropdownExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const MeasureValueFilterComponent = () => (
    <div>
        <h1>Measure Value Filter Component</h1>
        <p>Set of components for easy measure value filter management.</p>
        <hr className="separator" />
        <h2>Dropdown</h2>
        <p>Example of dropdown component for measure value filter setup.</p>
        <div className="s-measure-value-filter-example-1">
            <ExampleWithSource
                for={MeasureValueFilterDropdownExample}
                source={MeasureValueFilterDropdownExampleSRC}
            />
        </div>
    </div>
);

export default MeasureValueFilterComponent;
