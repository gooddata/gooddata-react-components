import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { LineChart } from '../src/components/afm/LineChart';
import {
    AFM_ONE_MEASURE_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE
} from './data/afmComponentProps';
import { CUSTOM_COLORS } from './data/colors';
import { onErrorHandler } from './mocks';
import '../styles/scss/charts.scss';

storiesOf('AFM components - LineChart', module)
    .add('two measures, one attribute', () => (
        <div style={{ width: 800, height: 400 }}>
            <LineChart
                projectId="storybook"
                afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('custom colors', () => (
        <div style={{ width: 800, height: 400 }}>
            <LineChart
                projectId="storybook"
                afm={AFM_ONE_MEASURE_ONE_ATTRIBUTE}
                config={{ colors: CUSTOM_COLORS }}
                onError={onErrorHandler}
            />
        </div>
    ));
