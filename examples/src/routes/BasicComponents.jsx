import React from 'react';
import ExampleWithSource from '../components/utils/ExampleWithSource';

import BarChartExample from '../components/BarChartExample';
import ColumnChartExample from '../components/ColumnChartExample';
import LineChartExample from '../components/LineChartExample';
import PieChartExample from '../components/PieChartExample';
import TableExample from '../components/TableExample';

import BarChartExampleSRC from '!raw-loader!../components/BarChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import ColumnChartExampleSRC from '!raw-loader!../components/ColumnChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import LineChartExampleSRC from '!raw-loader!../components/LineChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PieChartExampleSRC from '!raw-loader!../components/PieChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import TableExampleSRC from '!raw-loader!../components/TableExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const title = 'Basic Components';

export const BasicComponents = () => (<div>
    <h1>{title}</h1>

    <p>These components ingest AFM, execute it and render data as a chart or table.</p>

    <hr className="separator" />

    <h2>Bar chart</h2>
    <ExampleWithSource for={BarChartExample} source={BarChartExampleSRC} />

    <hr className="separator" />

    <h2>Column chart</h2>
    <ExampleWithSource for={ColumnChartExample} source={ColumnChartExampleSRC} />

    <hr className="separator" />

    <h2>Line chart with custom colors</h2>
    <ExampleWithSource for={LineChartExample} source={LineChartExampleSRC} />

    <hr className="separator" />

    <h2>Pie chart</h2>
    <ExampleWithSource for={PieChartExample} source={PieChartExampleSRC} />

    <hr className="separator" />

    <h2>Table</h2>
    <ExampleWithSource for={TableExample} source={TableExampleSRC} />

</div>);

export default BasicComponents;
