import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { AreaChart } from '../../src/components/afm/AreaChart';
import {
    AFM_ONE_MEASURE_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_RENAMED_ATTRIBUTE,
    AFM_ONE_MEASURE_TWO_ATTRIBUTES
} from '../data/afmComponentProps';
import { CUSTOM_COLORS } from '../data/colors';
import { onErrorHandler } from '../mocks';
import '../../styles/scss/charts.scss';

storiesOf('AFM components/Area chart', module)
    .add('two measures, one attribute (stacking by default)', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <AreaChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('two measures, one attribute (without stacking)', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <AreaChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                    config={{ stacking: false }}
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('stacked by attribute', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <AreaChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_TWO_ATTRIBUTES}
                    onError={onErrorHandler}
                    resultSpec={{
                        dimensions: [
                            {
                                itemIdentifiers: ['a1']
                            },
                            {
                                itemIdentifiers: ['a2', 'measureGroup']
                            }
                        ]
                    }}
                />
            </div>
        )
    ))
    .add('two measures, one renamed attribute', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <AreaChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_RENAMED_ATTRIBUTE}
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('custom colors', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <AreaChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_ONE_ATTRIBUTE}
                    config={{ colors: CUSTOM_COLORS }}
                    onError={onErrorHandler}
                />
            </div>
        )
    ));
