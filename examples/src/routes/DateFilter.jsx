// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import DateFilterComponentExample from "../components/DateFilterComponentExample";
import DateFilterWithColumnChartExample from "../components/DateFilterWithColumnChartExample";

import DateFilterComponentExampleSRC from "!raw-loader!../components/DateFilterComponentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import DateFilterWithColumnChartExampleSRC from "!raw-loader!../components/DateFilterWithColumnChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const DateFilter = () => (
    <div>
        <h1>Date Filter Component</h1>

        <p>These examples show how to use the Date Filter component.</p>

        <hr className="separator" />

        <h2>Date Filter</h2>
        <p>This example shows a full-featured date filter component.</p>
        <ExampleWithSource for={DateFilterComponentExample} source={DateFilterComponentExampleSRC} />

        <h2>Filtering a report</h2>
        <p>
            This example shows how to add date filter component into a report. Presets and floating range form
            is restricted to years.
        </p>
        <ExampleWithSource
            for={DateFilterWithColumnChartExample}
            source={DateFilterWithColumnChartExampleSRC}
        />
    </div>
);

export default DateFilter;
