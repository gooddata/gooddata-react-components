// (C) 2007-2018 GoodData Corporation
import React from 'react';
import ExampleWithSource from '../components/utils/ExampleWithSource';

import BarChartDynamicExample from '../components/BarChartDynamicExample';
import BarChartDynamicExampleSRC from '!raw-loader!../components/BarChartDynamicExample'; // eslint-disable-line

import BarChartPaletteExample from '../components/BarChartPaletteExample';
import BarChartPaletteExampleSRC from '!raw-loader!../components/BarChartPaletteExample'; // eslint-disable-line


export const BarChartDynamic = () => (
    <div>
        <h1>Bar Chart with dynamic colors example</h1>

        <hr className="separator" />

        <h2 id="pallete-by-property">Pallete by config property</h2>
        <hr className="separator" />

        <ExampleWithSource for={BarChartDynamicExample} source={BarChartDynamicExampleSRC} />

        <h2 id="pallete-by-style-settings">Pallete by style settings</h2>
        <hr className="separator" />

        <ExampleWithSource for={BarChartPaletteExample} source={BarChartPaletteExampleSRC} />

    </div>
);

export default BarChartDynamic;
