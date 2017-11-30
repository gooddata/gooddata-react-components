import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { ColumnChart } from '../src/components/core/ColumnChart';
import { VisualizationTypes } from '../src/constants/visualizationTypes';
import { CUSTOM_COLORS } from './data/colors';
import { getResultWithTwoMeasuresAndOneAttribute } from '../src/execution/fixtures/SimpleExecutor.fixtures';
import { getMdResultWithTwoMeasuresAndOneAttribute } from './data/metadataResult';
import { DataSourceMock, MetadataSourceMock, onErrorHandler } from './mocks';
import '../styles/scss/charts.scss';
import { screenshotWrap } from './utils/wrap';

storiesOf('ColumnChart', module)
    .add('two measures, one attribute', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <ColumnChart
                    dataSource={new DataSourceMock(getResultWithTwoMeasuresAndOneAttribute())}
                    metadataSource={
                        new MetadataSourceMock(getMdResultWithTwoMeasuresAndOneAttribute(VisualizationTypes.COLUMN))
                    }
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('custom colors', () => (
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <ColumnChart
                    dataSource={new DataSourceMock(getResultWithTwoMeasuresAndOneAttribute())}
                    metadataSource={
                        new MetadataSourceMock(getMdResultWithTwoMeasuresAndOneAttribute(VisualizationTypes.COLUMN))
                    }
                    onError={onErrorHandler}
                    config={{ colors: CUSTOM_COLORS }}
                />
            </div>
        )
    ));
