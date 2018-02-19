import React from 'react';
import ExampleWithSource from '../components/utils/ExampleWithSource';

import ResizableExample from '../components/ResizableExample';
import ResizableExampleSRC from '!raw-loader!../components/ResizableExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const ResizableChart = () => (<div>
    <h1>Resizable Chart</h1>

    <ExampleWithSource for={ResizableExample} source={ResizableExampleSRC} />
</div>);

export default ResizableChart;
