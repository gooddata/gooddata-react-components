import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Table } from '../src/components/afm/Table';
import {
    AFM_TWO_MEASURES_ONE_ATTRIBUTE
} from './data/afmComponentProps';
import { onErrorHandler } from './mocks';
import '../styles/scss/charts.scss';

function logTotalsChange(data: any) {
    if (data.properties && data.properties.totals) {
        action('totals changed')(data.properties.totals);
    }
}

storiesOf('AFM components - Table', module)
    .add('two measures, one attribute', () => (
        <div style={{ width: 600, height: 300 }}>
            <Table
                projectId="storybook"
                afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                onError={onErrorHandler}
            />
        </div>
    ))
    .add('with table totals', () => (
        <div style={{ width: 600, height: 300 }}>
            <Table
                projectId="storybook"
                afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                onError={onErrorHandler}
                totals={[
                    { type: 'sum', outputMeasureIndexes: [], alias: 'My SUM' },
                    { type: 'avg', outputMeasureIndexes: [], alias: 'My AVG' },
                ]}
            />
        </div>
    ))
    .add('with table totals editable', () => (
        <div style={{ width: 600, height: 300 }}>
            <Table
                projectId="storybook"
                afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                onError={onErrorHandler}
                totalsEditAllowed={true}
                totals={[
                    { type: 'sum', outputMeasureIndexes: [], alias: 'My SUM' },
                ]}
                pushData={logTotalsChange}
            />
        </div>
    ));
