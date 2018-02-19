import React from 'react';

import ExampleWithSource from '../components/utils/ExampleWithSource';

import VisualizationColumnChartExample from '../components/VisualizationColumnChartExample';
import VisualizationTableExample from '../components/VisualizationTableExample';
import CustomVisualizationExample from '../components/CustomVisualizationExample';
import ResizableExample from '../components/ResizableExample';

import VisualizationColumnChartExampleSRC from '!raw-loader!../components/VisualizationColumnChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationTableExampleSRC from '!raw-loader!../components/VisualizationTableExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import CustomVisualizationExampleSRC from '!raw-loader!../components/CustomVisualizationExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import ResizableExampleSRC from '!raw-loader!../components/ResizableExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const Visualization = () => (<div>
    <h1>Visualization</h1>

    <p>These are examples of generic Visualization component use cases.</p>

    <h2>Visualization Column Chart</h2>
    <ExampleWithSource for={VisualizationColumnChartExample} source={VisualizationColumnChartExampleSRC} />

    <h2>Table</h2>
    <ExampleWithSource for={VisualizationTableExample} source={VisualizationTableExampleSRC} />

    <h2>Resizable chart</h2>
    <ExampleWithSource for={ResizableExample} source={ResizableExampleSRC} />

    <h2>Custom Visualization</h2>
    <p>Using <a href="https://github.com/recharts/recharts">Recharts library</a></p>
    <ExampleWithSource for={CustomVisualizationExample} source={CustomVisualizationExampleSRC} />

</div>);

export default Visualization;
