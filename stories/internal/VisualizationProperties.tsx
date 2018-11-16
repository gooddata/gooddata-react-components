// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { Visualization } from '../../src/components/visualizations/Visualization';
import * as fixtures from '../test_data/fixtures';
import { wrap } from '../utils/wrap';

import '../../styles/scss/charts.scss';
// import { GERMAN_NUMBER_FORMAT } from '../data/numberFormat';

// TODO: test with min/max setting and GERMAN_NUMBER_FORMAT

storiesOf('Internal/Visualization/ConfigProperties', module)
    .add('dual axes column, show data labels', () => {
        return screenshotWrap(
            wrap(
                <Visualization
                    {...fixtures.barChartWith3MetricsAndViewByAttribute}
                    config={{
                        type: 'column',
                        legend: {
                            position: 'top'
                        },
                        secondary_yaxis: {
                            measures: ['expectedMetric']
                        },
                        dataLabels: {
                            visible: true
                        }
                    }}
                />
            )
        );
    })
    .add('dual axes bar, show data labels', () => {
        return screenshotWrap(
            wrap(
                <Visualization
                    {...fixtures.barChartWith3MetricsAndViewByAttribute}
                    config={{
                        type: 'bar',
                        legend: {
                            position: 'top'
                        },
                        secondary_yaxis: {
                            measures: ['expectedMetric']
                        },
                        dataLabels: {
                            visible: true
                        }
                    }}
                />
            )
        );
    })
    .add('dual axes line, show data labels', () => {
        return screenshotWrap(
            wrap(
                <Visualization
                    {...fixtures.barChartWith3MetricsAndViewByAttribute}
                    config={{
                        type: 'line',
                        legend: {
                            position: 'top'
                        },
                        secondary_yaxis: {
                            max: '4000000',
                            measures: ['expectedMetric']
                        },
                        dataLabels: {
                            visible: true
                        }
                    }}
                />
            )
        );
    });
