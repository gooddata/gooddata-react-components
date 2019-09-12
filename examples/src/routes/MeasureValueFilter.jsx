// (C) 2007-2019 GoodData Corporation
import React from "react";

import MeasureValueFilterExample from "../components/MeasureValueFilterExample";
import ExampleWithSource from "../components/utils/ExampleWithSource";

import MeasureValueFilterExampleSRC from "!raw-loader!../components/MeasureValueFilterExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const MeasureValueFilter = () => (
    <div>
        <h1>Filter by Value</h1>
        <p>
            Here is how you can filter the entire insight by the value of a measure. The granularity is
            defined by the attributes in the insight.
        </p>
        <hr className="separator" />
        <ExampleWithSource for={MeasureValueFilterExample} source={MeasureValueFilterExampleSRC} />
    </div>
);

export default MeasureValueFilter;
