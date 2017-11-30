import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Table } from '../src/components/core/Table';
import { VisualizationTypes } from '../src/constants/visualizationTypes';
import { getResultWithTwoMeasuresAndOneAttribute } from '../src/execution/fixtures/SimpleExecutor.fixtures';
import { getMdResultWithTwoMeasuresAndOneAttribute } from './data/metadataResult';
import { DataSourceMock, MetadataSourceMock, onErrorHandler } from './mocks';
import '../styles/scss/charts.scss';
import { screenshotWrap } from './utils/wrap';

storiesOf('Table', module)
    .add('two measures, one attribute', () => (
        screenshotWrap(
            <div style={{ width: 600, height: 300 }}>
                <Table
                    dataSource={new DataSourceMock(getResultWithTwoMeasuresAndOneAttribute())}
                    metadataSource={
                        new MetadataSourceMock(getMdResultWithTwoMeasuresAndOneAttribute(VisualizationTypes.TABLE))
                    }
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('two measures, one attribute with identifiers', () => (
        screenshotWrap(
            <div style={{ width: 600, height: 300 }}>
                <Table
                    dataSource={new DataSourceMock(getResultWithTwoMeasuresAndOneAttribute(true))}
                    metadataSource={
                        new MetadataSourceMock(getMdResultWithTwoMeasuresAndOneAttribute(VisualizationTypes.TABLE, true))
                    }
                    onError={onErrorHandler}
                />
            </div>
        )
    ))
    .add('external transformation', () => (
        screenshotWrap(
            <div style={{ width: 600, height: 300 }}>
                <Table
                    dataSource={new DataSourceMock(getResultWithTwoMeasuresAndOneAttribute())}
                    metadataSource={
                        new MetadataSourceMock(getMdResultWithTwoMeasuresAndOneAttribute(VisualizationTypes.TABLE, true))
                    }
                    transformation={{
                        measures: [
                            {
                                id: 'm1',
                                title: 'redefined title',
                                format: '---#---'
                            }
                        ]
                    }}
                    onError={onErrorHandler}
                />
            </div>
        )
    ));
