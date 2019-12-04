// (C) 2007-2019 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import XirrExample from "../components/XirrExample";

import XirrExampleSRC from "!raw-loader!../components/XirrExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const Xirr = () => (
    <div>
        <h1>XIRR</h1>

        <p>This will most likely show a dash as the data is not suitable for XIRR calculation</p>

        <ExampleWithSource for={XirrExample} source={XirrExampleSRC} />
    </div>
);

export default Xirr;
