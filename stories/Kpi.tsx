import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Kpi } from '../src/components/simple/Kpi';
import { screenshotWrap } from './utils/wrap';

storiesOf('KPI', module)
    .add('KPI', () => (
        screenshotWrap(
            <Kpi
                measure={'/gdc/md/storybook/obj/1'}
                projectId={'storybook'}
            />
        )
    ));
