// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';
import {
    ATTRIBUTE_3,
    ATTRIBUTE_4,
    MEASURE_1,
    ATTRIBUTE_1,
    MEASURE_1_WITH_ALIAS,
    MEASURE_2,
    MEASURE_3
} from '../data/componentProps';
import { VIEW_BY_DIMENSION_INDEX } from '../../src/components/visualizations/chart/constants';

import { BarChart } from '../../src/components/BarChart';
import { HeatMap } from '../../src/components/HeatMap';
import { Treemap } from '../../src/components/Treemap';
import { AreaChart } from '../../src/components/AreaChart';
import { ComboChart } from '../../src/components/ComboChart';
import ChartTransformation from '../../src/components/visualizations/chart/ChartTransformation';
import { wrap } from '../utils/wrap';
import { onErrorHandler } from '../mocks';
import * as fixtures from '../test_data/fixtures';
import identity = require('lodash/identity');

import '../../styles/scss/charts.scss';
import '../../styles/scss/table.scss';

storiesOf('NewHighCharts', module)
.add('Performance test', () => {
    const measurings: any[] = [];
    const startTime = performance.now();

    const measure = (name: string) => {
        const measuring = { chart: name, time: performance.now() - startTime };
        measurings.push(measuring);
        // tslint:disable-next-line:no-console
        console.log(measuring);
    };

    // Name measurings to bypass the lambda error
    // We do not re-render the charts to measure first render, therefore it shouldn't be a perf issue
    const mHeat = () => measure('HeatMap');
    const mBubble = () => measure('BubbleChart');
    const mColumnChart = () => measure('ColumnChart');
    const mBarChart = () => measure('BarChart');
    const mTreeMap = () => measure('TreeMap');
    const mAreaChart = () => measure('AreaChart');
    const mComboChart = () => measure('ComboChart');

    const dataSet1 = {
        ...fixtures.bubbleChartWith3MetricsAndAttribute
    };
    const dataLarge = () => { throw new Error('Data too large'); };

    const dataSet2 = fixtures.barChartWith6PopMeasuresAndViewByAttribute;

    return screenshotWrap(
        <div>
            <p>HeatMap</p>
            {
                wrap(
                    <HeatMap
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_3}
                        afterRender={mHeat}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Bubble chart</p>
            {
                wrap(
                    <ChartTransformation
                        drillableItems={[]}
                        config={{
                            type: 'bubble',
                            legend: {
                                enabled: true,
                                position: 'right'
                            },
                            legendLayout: 'horizontal',
                            colors: fixtures.customPalette,
                            mdObject: fixtures.bubbleChartWith3MetricsAndAttributeMd.mdObject
                        }}
                        {...dataSet1}
                        onDataTooLarge={dataLarge}
                        onNegativeValues={null}
                        afterRender={mBubble}
                    />
                )
            }
            <p>Column chart</p>
            {
                wrap(
                    <ChartTransformation
                        drillableItems={[
                            {
                                uri: dataSet2.executionResult
                                    .headerItems[VIEW_BY_DIMENSION_INDEX][0][0].attributeHeaderItem.uri
                            }
                        ]}
                        config={{
                            type: 'column',
                            legend: {
                                enabled: true,
                                position: 'top'
                            },
                            legendLayout: 'vertical',
                            colors: fixtures.customPalette
                        }}
                        {...dataSet2}
                        onDataTooLarge={identity}
                        afterRender={mColumnChart}
                    />
                )
            }
            <p>Bar chart</p>
            {
                wrap(
                    <BarChart
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        viewBy={ATTRIBUTE_3}
                        stackBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mBarChart}
                    />
                )
            }
            <p>Tree map</p>
            {
                wrap(
                    <Treemap
                        projectId="storybook"
                        measures={[MEASURE_1_WITH_ALIAS, MEASURE_2]}
                        segmentBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mTreeMap}
                    />,
                    1000,
                    '100%'
                )
            }
            <p>Area chart</p>
            {
                wrap(
                    <AreaChart
                        projectId="storybook"
                        measures={[MEASURE_1_WITH_ALIAS, MEASURE_2, MEASURE_3]}
                        viewBy={[ATTRIBUTE_1, ATTRIBUTE_4]}
                        stackBy={[ATTRIBUTE_3]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mAreaChart}
                    />
                )
            }
            <p>ComboChart</p>
            {
                wrap(
                    <ComboChart
                        projectId="storybook"
                        columnMeasures={[MEASURE_1]}
                        lineMeasures={[MEASURE_2]}
                        viewBy={ATTRIBUTE_4}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                        afterRender={mComboChart}
                    />
                )
            }
        </div>
    );
});
