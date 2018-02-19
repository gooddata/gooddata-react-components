import React from 'react';
import ExampleWithSource from '../utils/ExampleWithSource';

import DatePickerExample from '../components/DatePickerExample';
import DatePickerExampleSRC from '!raw-loader!../components/DatePickerExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first


export const Kpi = () => (<div>
    <h1>Date Picker</h1>

    <p>This is an example of a custom date picker components filtering a visalization.</p>

    <ExampleWithSource for={DatePickerExample} source={DatePickerExampleSRC} />
</div>);

export default Kpi;
