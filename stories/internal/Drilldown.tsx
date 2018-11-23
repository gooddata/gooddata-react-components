// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import noop = require('lodash/noop');
import { storiesOf } from '@storybook/react';
import { action, decorateAction } from '@storybook/addon-actions';
import { screenshotWrap } from '@gooddata/test-storybook';
import {
    EXECUTION_REQUEST_AM, EXECUTION_RESPONSE_AM, EXECUTION_RESULT_AM,
    TABLE_HEADERS_AM
} from '../../src/components/visualizations/table/fixtures/arithmericMeasures';

import { Visualization } from '../../src/components/visualizations/Visualization';
import * as predicateFactory from '../../src/factory/PredicateFactory';
import { wrap } from '../utils/wrap';
import * as fixtures from '../test_data/fixtures';
import {
    VIEW_BY_DIMENSION_INDEX,
    STACK_BY_DIMENSION_INDEX
} from '../../src/components/visualizations/chart/constants';

import '../../styles/scss/charts.scss';
import '../../styles/scss/table.scss';
import {
    EXECUTION_REQUEST_POP,
    EXECUTION_RESPONSE_POP,
    EXECUTION_RESULT_POP,
    TABLE_HEADERS_POP
} from '../../src/components/visualizations/table/fixtures/periodOverPeriod';

const onFiredDrillEvent = (
    { executionContext, drillContext }: { executionContext: any, drillContext: any }
) => {
    console.log('onFiredDrillEvent', { executionContext, drillContext }); // tslint:disable-line:no-console
    return false;
};

const eventAction = decorateAction([
    (...args: any[]) => {
        return [args[0][0].detail];
    }
]);

const defaultColumnChartProps = {
    config: {
        type: 'column'
    },
    onDataTooLarge: noop
};

document.addEventListener('drill', eventAction('drill'));

storiesOf('Internal/Drilldown', module)
    .add('Column chart with 6 pop measures and view by attribute', () => {
        const dataSet = fixtures.barChartWith6PopMeasuresAndViewByAttribute;
        return screenshotWrap(
            wrap(
                <Visualization
                    drillableItems={[{
                        uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                    }]}
                    config={{
                        type: 'column',
                        legend: {
                            enabled: true,
                            position: 'top'
                        },
                        legendLayout: 'vertical',
                        colorPalette: fixtures.customPalette
                    }}
                    {...dataSet}
                    onDataTooLarge={noop}
                />
            )
        );
    })
    .add('Column chart with 6 previous period measures', () => {
        const dataSet = fixtures.barChartWith6PreviousPeriodMeasures;
        return screenshotWrap(
            wrap(
                <Visualization
                    drillableItems={[{
                        uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                    }]}
                    config={{
                        type: 'column',
                        legend: {
                            enabled: true,
                            position: 'top'
                        },
                        legendLayout: 'vertical',
                        colorPalette: fixtures.customPalette
                    }}
                    {...dataSet}
                    onDataTooLarge={noop}
                />
            )
        );
    })
    .add('Line chart drillable by measure', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    config={{
                        type: 'line',
                        legend: {
                            enabled: false
                        }
                    }}
                    onDataTooLarge={noop}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Line chart with onFiredDrillEvent', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;

        return screenshotWrap(
            <div>
                <p>Line chart with standard onFiredDrillEvent callback</p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'line',
                                legend: {
                                    enabled: false
                                }
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>
                    Line chart with onFiredDrillEvent where drillEvent
                    is logged into console and default event is prevented
                </p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={onFiredDrillEvent}
                            config={{
                                type: 'line',
                                legend: {
                                    enabled: false
                                }
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
            </div>
        );
    })
    .add('Bar chart with view by attribute drillable by measure', () => {
        const dataSet = fixtures.barChartWithViewByAttribute;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Bar chart with view by attribute drillable by attribute', () => {
        const dataSet = fixtures.barChartWithViewByAttribute;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Bar chart with view by attribute drillable by attribute value', () => {
        const dataSet = fixtures.barChartWithViewByAttribute;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionResult
                                .headerItems[VIEW_BY_DIMENSION_INDEX][0][0].attributeHeaderItem.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Stacked bar chart drillable by measure', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Stacked bar chart drillable by stack by attribute', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest
                                .afm.attributes[0].displayForm.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Stacked bar chart drillable by view by attribute value', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionResult
                                .headerItems[VIEW_BY_DIMENSION_INDEX][0][0].attributeHeaderItem.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Stacked bar chart drillable by stack by attribute value', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    {...defaultColumnChartProps}
                    drillableItems={[
                        {
                            uri: dataSet.executionResult
                                .headerItems[STACK_BY_DIMENSION_INDEX][0][0].attributeHeaderItem.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Area chart drillable by measure', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            wrap(
                <Visualization
                    config={{
                        type: 'area',
                        legend: {
                            enabled: false
                        }
                    }}
                    onDataTooLarge={noop}
                    drillableItems={[
                        {
                            uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                        }
                    ]}
                    {...dataSet}
                />,
                500,
                '100%'
            )
        );
    })
    .add('Area chart with onFiredDrillEvent', () => {
        const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
        return screenshotWrap(
            <div>
                <p>Area chart with standard onFiredDrillEvent callback</p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'area',
                                legend: {
                                    enabled: false
                                }
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>
                    Area chart with onFiredDrillEvent where drillEvent
                    is logged into console and default event is prevented
                </p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={onFiredDrillEvent}
                            config={{
                                type: 'area',
                                legend: {
                                    enabled: false
                                }
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
            </div>
        );
    })
    .add('Table (legacy drillable items)', () => (
        screenshotWrap(
            wrap(
                <Visualization
                    config={{ type: 'table' }}
                    executionRequest={
                        {
                            afm: EXECUTION_REQUEST_POP.execution.afm,
                            resultSpec: EXECUTION_REQUEST_POP.execution.resultSpec
                        }
                    }
                    executionResponse={EXECUTION_RESPONSE_POP}
                    executionResult={EXECUTION_RESULT_POP}
                    onDataTooLarge={noop}
                    onNegativeValues={noop}
                    onLegendReady={noop}
                    width={600}
                    height={400}
                    drillableItems={[
                        {
                            uri: TABLE_HEADERS_POP[0].uri,
                            identifier: TABLE_HEADERS_POP[0].localIdentifier
                        }, {
                            uri: TABLE_HEADERS_POP[1].uri,
                            identifier: TABLE_HEADERS_POP[1].localIdentifier
                        }, {
                            uri: TABLE_HEADERS_POP[2].uri,
                            identifier: TABLE_HEADERS_POP[2].localIdentifier
                        }
                    ]}
                />
            )
        )
    ))
    .add('Table with AM (drillable predicates + legacy drillable items)', () => (
        screenshotWrap(
            wrap(
                <Visualization
                    config={{ type: 'table' }}
                    executionRequest={
                        {
                            afm: EXECUTION_REQUEST_AM.execution.afm,
                            resultSpec: EXECUTION_REQUEST_AM.execution.resultSpec
                        }
                    }
                    executionResponse={EXECUTION_RESPONSE_AM}
                    executionResult={EXECUTION_RESULT_AM}
                    onDataTooLarge={noop}
                    onNegativeValues={noop}
                    onLegendReady={noop}
                    width={600}
                    height={400}
                    drillableItems={[
                        { uri: TABLE_HEADERS_AM[0].uri },
                        predicateFactory.isItemUri(TABLE_HEADERS_AM[1].uri),
                        predicateFactory.isItemIdentifier(TABLE_HEADERS_AM[2].identifier),
                        predicateFactory.isUriInArithmeticMeasureTree(TABLE_HEADERS_AM[0].uri),
                        predicateFactory.isIdentifierInArithmeticMeasureTree(TABLE_HEADERS_AM[1].identifier)
                    ]}
                />
            )
        )
    ))
    .add('Scatter plot with onFiredDrillEvent', () => {
        const dataSet = fixtures.scatterPlotWith2MetricsAndAttribute;
        return screenshotWrap(
            <div>
                <p>Scatter plot with standard onFiredDrillEvent callback</p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'scatter',
                                mdObject: dataSet.mdObject
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>Scatter plot with drilling on attribute</p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'scatter',
                                mdObject: dataSet.mdObject
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>Scatter plot with drilling on attribute element "Educationly"</p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'scatter',
                                mdObject: dataSet.mdObject
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionResult.headerItems[0][0][1].attributeHeaderItem.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>
                    Scatter plot with onFiredDrillEvent where drillEvent
                    is logged into console and default event is prevented
                </p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={onFiredDrillEvent}
                            config={{
                                type: 'scatter',
                                mdObject: dataSet.mdObject
                            }}
                            onDataTooLarge={noop}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                            {...dataSet}
                        />,
                        500,
                        '100%'
                    )
                }
            </div>
        );
    })
    .add('Bubble chart with onFiredDrillEvent', () => {
        const dataSet = {
            ...fixtures.bubbleChartWith3MetricsAndAttribute
        };
        return screenshotWrap(
            <div>
                <p>
                    Bubble chart with drilling on measure
                </p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={action('onFiredDrillEvent')}
                            config={{
                                type: 'bubble',
                                mdObject: fixtures.bubbleChartWith3MetricsAndAttributeMd.mdObject
                            }}
                            onDataTooLarge={noop}
                            onNegativeValues={noop}
                            {...dataSet}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                                }
                            ]}
                        />,
                        500,
                        '100%'
                    )
                }
                <p>
                    Bubble chart with drilling on attribute and logging to console
                </p>
                {
                    wrap(
                        <Visualization
                            onFiredDrillEvent={onFiredDrillEvent}
                            config={{
                                type: 'bubble',
                                mdObject: fixtures.bubbleChartWith3MetricsAndAttributeMd.mdObject
                            }}
                            onDataTooLarge={noop}
                            onNegativeValues={noop}
                            {...dataSet}
                            drillableItems={[
                                {
                                    uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                                }
                            ]}
                        />,
                        500,
                        '100%'
                    )
                }
            </div>
        );
    })
    .add('Treemap with onFiredDrillEvent', () => {
    const dataSetWithManyMeasure = {
        ...fixtures.treemapWithTwoMetricsAndStackByAttribute
    };
    const dataSet = {
        ...fixtures.treemapWithMetricViewByAndStackByAttribute
    };
    return screenshotWrap(
        <div>
            <p>
                Treemap with drilling on one measure from two
                </p>
            {
                wrap(
                    <Visualization
                        onFiredDrillEvent={action('onFiredDrillEvent')}
                        config={{
                            type: 'treemap',
                            mdObject: dataSetWithManyMeasure.mdObject
                        }}
                        onDataTooLarge={noop}
                        onNegativeValues={noop}
                        {...dataSetWithManyMeasure}
                        drillableItems={[
                            {
                                uri: dataSetWithManyMeasure.executionRequest.afm.measures[0].definition.measure.item.uri
                            }
                        ]}
                    />,
                    500,
                    '100%'
                )
            }
            <p>
                Treemap with drilling on view by attribute and logging to console
                </p>
            {
                wrap(
                    <Visualization
                        onFiredDrillEvent={onFiredDrillEvent}
                        config={{
                            type: 'treemap',
                            mdObject: dataSet.mdObject
                        }}
                        onDataTooLarge={noop}
                        onNegativeValues={noop}
                        {...dataSet}
                        drillableItems={[
                            {
                                uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                            }
                        ]}
                    />,
                    500,
                    '100%'
                )
            }
            <p>
                Treemap with drilling on segment by attribute element and logging to console
                </p>
            {
                wrap(
                    <Visualization
                        onFiredDrillEvent={onFiredDrillEvent}
                        config={{
                            type: 'treemap',
                            mdObject: dataSet.mdObject
                        }}
                        onDataTooLarge={noop}
                        onNegativeValues={noop}
                        {...dataSet}
                        drillableItems={[
                            {
                                uri: dataSet.executionResult
                                    .headerItems[STACK_BY_DIMENSION_INDEX][1][0].attributeHeaderItem.uri
                            }
                        ]}
                    />,
                    500,
                    '100%'
                )
            }
        </div>
    );
    })
    .add('Heatmap with onFiredDrillEvent', () => {
        const dataSet = fixtures.heatmapMetricRowColumn;
        return screenshotWrap(
            <div><p>Heatmap drillable by measure</p>
            {
                wrap(
                    <Visualization
                        config={{
                            type: 'heatmap'
                        }}
                        onDataTooLarge={noop}
                        drillableItems={[
                            {
                                uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                            }
                        ]}
                        {...dataSet}
                    />,
                    500,
                    '100%'
                )
            }
            <p>Heatmap drillable by attribute</p>
            {
                wrap(
                    <Visualization
                        config={{
                            type: 'heatmap'
                        }}
                        onDataTooLarge={noop}
                        drillableItems={[
                            {
                                uri: dataSet.executionRequest.afm.attributes[0].displayForm.uri
                            }
                        ]}
                        {...dataSet}
                    />,
                    500,
                    '100%'
                )
            }
            <p>Heatmap drillable by attribute element</p>
            {
                wrap(
                    <Visualization
                        config={{
                            type: 'heatmap'
                        }}
                        onDataTooLarge={noop}
                        drillableItems={[
                            {
                                uri: dataSet.executionResult
                                        .headerItems[STACK_BY_DIMENSION_INDEX][0][0].attributeHeaderItem.uri
                            }
                        ]}
                        {...dataSet}
                    />,
                    500,
                    '100%'
                )
            }
            <p>Heatmap with standard onFiredDrillEvent callback</p>
            {
                wrap(
                    <Visualization
                        onFiredDrillEvent={action('onFiredDrillEvent')}
                        config={{
                            type: 'heatmap'
                        }}
                        onDataTooLarge={noop}
                        drillableItems={[
                            {
                                uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                            }
                        ]}
                        {...dataSet}
                    />,
                    500,
                    '100%'
                )
            }
            <p>
                Heatmap with onFiredDrillEvent where drillEvent
                is logged into console and default event is prevented
            </p>
            {
                wrap(
                    <Visualization
                        onFiredDrillEvent={onFiredDrillEvent}
                        config={{
                            type: 'heatmap'
                        }}
                        onDataTooLarge={noop}
                        drillableItems={[
                            {
                                uri: dataSet.executionRequest.afm.measures[0].definition.measure.item.uri
                            }
                        ]}
                        {...dataSet}
                    />,
                    500,
                    '100%'
                )
            }</div>
        );
    });
