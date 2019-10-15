// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import DateFilterComponentExample from "../components/DateFilterComponentExample";

import DateFilterComponentExampleSRC from "!raw-loader!../components/DateFilterComponentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const DateFilter = () => (
    <div>
        <h1>Date Filter Component</h1>

        <p>These examples show how to use the Date Filter component.</p>

        <hr className="separator" />

        <h2>Full-featured Date Filter</h2>
        <ExampleWithSource for={DateFilterComponentExample} source={DateFilterComponentExampleSRC} />
    </div>
);

export default DateFilter;
