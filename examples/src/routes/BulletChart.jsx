// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import BulletChartExample from "../components/BulletChartExample";

import BulletChartExampleSRC from "!raw-loader!../components/BulletChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const BulletChart = () => (
    <div>
        <h1>Bullet chart</h1>

        <p>Primary, target and comparative measures viewed by two attributes with attribute filter</p>

        <ExampleWithSource for={BulletChartExample} source={BulletChartExampleSRC} />
    </div>
);

export default BulletChart;
