import React from 'react';
import ExampleWithSource from '../components/utils/ExampleWithSource';

import DynamicMeasuresExample from '../components/DynamicMeasuresExample';
import DynamicMeasuresExampleSRC from '!raw-loader!../components/DynamicMeasuresExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first


export const DynamicMeasures = () => (<div>
    <h1>Dynamic Measures</h1>

    <p>
        This example showcases visualizations with dynamic measure setup. We get similar measures labeled
        with a tag franchise_fees, then make a selectable list that updates AFM of multiple visualizations.
    </p>

    <ExampleWithSource for={DynamicMeasuresExample} source={DynamicMeasuresExampleSRC} />
</div>);

export default DynamicMeasures;
