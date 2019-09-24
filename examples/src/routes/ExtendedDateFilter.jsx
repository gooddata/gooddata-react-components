// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import ExtendedDateFilterComponentExample from "../components/ExtendedDateFilterComponentExample";

import ExtendedDateFilterComponentExampleSRC from "!raw-loader!../components/ExtendedDateFilterComponentExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const ExtendedDateFilter = () => (
    <div>
        <h1>Date Filter Components</h1>

        <p>These examples show how to use the Date Filter components.</p>

        <hr className="separator" />

        <h2>Date Filter Component</h2>
        <ExampleWithSource
            for={ExtendedDateFilterComponentExample}
            source={ExtendedDateFilterComponentExampleSRC}
        />
    </div>
);

export default ExtendedDateFilter;
