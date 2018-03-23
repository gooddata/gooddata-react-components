import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { Headline } from '../src';
import { MEASURE_1_WITH_ALIAS, MEASURE_2 } from './data/componentProps';

storiesOf('Headline', module)
    .add('one measure', () => (
        screenshotWrap(
            <div style={{ width: 600, height: 300 }}>
                <Headline
                    projectId="storybook"
                    measure={MEASURE_1_WITH_ALIAS}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures', () => (
        screenshotWrap(
            <div style={{ width: 600, height: 300 }}>
                <Headline
                    projectId="storybook"
                    measure={MEASURE_1_WITH_ALIAS}
                    secondaryMeasure={MEASURE_2}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ));
