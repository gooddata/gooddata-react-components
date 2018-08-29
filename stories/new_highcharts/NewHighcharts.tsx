// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';
import {
    ATTRIBUTE_4,
    ATTRIBUTE_5,
    ATTRIBUTE_8,
    ATTRIBUTE_9,
    ATTRIBUTE_10,
    ATTRIBUTE_11,
    ATTRIBUTE_12,
    ATTRIBUTE_13,
    ATTRIBUTE_14,
    ATTRIBUTE_15,
    ATTRIBUTE_16,
    ATTRIBUTE_17,
    ATTRIBUTE_18,
    ATTRIBUTE_19,
    ATTRIBUTE_20,
    MEASURE_1,
    ATTRIBUTE_1,
    MEASURE_1_WITH_ALIAS,
    MEASURE_2,
    MEASURE_3
} from '../data/componentProps';
import { VIEW_BY_DIMENSION_INDEX } from '../../src/components/visualizations/chart/constants';

import { Visualization } from '../../src/components/visualizations/Visualization';
import { BarChart } from '../../src/components/BarChart';
import { Heatmap } from '../../src/components/Heatmap';
import { Treemap } from '../../src/components/Treemap';
import { AreaChart } from '../../src/components/AreaChart';
import { ComboChart } from '../../src/components/ComboChart';
import { BubbleChart } from '../../src/components/BubbleChart';
import { ColumnChart } from '../../src/components/ColumnChart';
import { DualChart } from '../../src/components/DualChart';
import { DonutChart } from '../../src/components/DonutChart';
import { PieChart } from '../../src/components/PieChart';
import { FunnelChart } from '../../src/index';
import { ScatterPlot } from '../../src/components/ScatterPlot';
import { LineChart } from '../../src/components/LineChart';
import ChartTransformation from '../../src/components/visualizations/chart/ChartTransformation';
import { wrap } from '../utils/wrap';
import { onErrorHandler } from '../mocks';
import * as fixtures from '../test_data/fixtures';
import identity = require('lodash/identity');

import '../../styles/scss/charts.scss';
import '../../styles/scss/table.scss';

function getChart({
    type = 'column',
    legendEnabled = true,
    legendPosition = 'top',
    legendResponsive = false,
    dataSet = fixtures.barChartWithoutAttributes,
    colors,
    width,
    height,
    minHeight,
    minWidth,
    chartHeight,
    chartWidth,
    key,
    afterRender
}: any) {
    return wrap((
        <ChartTransformation
            config={{
                type,
                legend: {
                    enabled: legendEnabled,
                    position: legendPosition,
                    responsive: legendResponsive
                },
                colors
            }}
            height={chartHeight}
            width={chartWidth}
            {...dataSet}
            onDataTooLarge={identity}
            afterRender={afterRender}
        />
    ), height, width, minHeight, minWidth, key);
}

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
    const mHeat = () => measure('Heatmap');
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
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
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
                        viewBy={ATTRIBUTE_5}
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
                        stackBy={[ATTRIBUTE_5]}
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
}).add('Bloated dashboard test', () => { // last minute add, forgive me the copy&paste
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
    const mHeat = () => measure('Heatmap');
    const mHeat2 = () => measure('Heatmap2');
    const mBubble = () => measure('BubbleChart');
    const mColumnChart = () => measure('ColumnChart');
    const mBarChart = () => measure('BarChart');
    const mTreeMap = () => measure('TreeMap');
    const mTreeMap2 = () => measure('TreeMap2');
    const mAreaChart = () => measure('AreaChart');
    const mComboChart = () => measure('ComboChart');
    const mLineChart = () => measure('LineChart');
    const mColumnChart2 = () => measure('ColumnChart2');
    const mDualChart = () => measure('DualChart');
    const mDonutChart = () => measure('DonutChart');
    const mPieChart = () => measure('PieChart');
    const mScatterPlot = () => measure('ScatterPlot');
    const mBubble2 = () => measure('BubbleChart2');
    const mFunnelChart = () => measure('FunnelChart');
    const mLineChart2 = () => measure('LineChart2');
    const mResizeChart = () => measure('ResizeChart');
    const mColumnChart3 = () => measure('ColumnChart3');
    const mAreaChartDisabledStack = () => measure('AreaChartDisabledStack');

    const dataSet1 = {
        ...fixtures.bubbleChartWith3MetricsAndAttribute
    };
    const dataLarge = () => { throw new Error('Data too large'); };

    const dataSet2 = fixtures.barChartWith6PopMeasuresAndViewByAttribute;

    return screenshotWrap(
        <div>
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
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
                        viewBy={ATTRIBUTE_5}
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
                        stackBy={[ATTRIBUTE_5]}
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
            <p>Line chart</p>
            {
                wrap(
                    <LineChart
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mLineChart}
                    />
                )
            }
            <p>ColumnChart</p>
            {
                wrap(
                    <ColumnChart
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        viewBy={ATTRIBUTE_5}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mColumnChart2}
                    />
                )
            }
            <p>DualChart</p>
            {
                wrap(
                    <DualChart
                        projectId="storybook"
                        leftAxisMeasure={MEASURE_1}
                        rightAxisMeasure={MEASURE_2}
                        trendBy={ATTRIBUTE_1}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mDualChart}
                    />
                )
            }
            <p>DonutChart</p>
            {
                wrap(
                    <DonutChart
                        projectId="storybook"
                        measures={[MEASURE_2]}
                        viewBy={ATTRIBUTE_1}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mDonutChart}
                    />
                )
            }
            <p>PieChart</p>
            {
                wrap(
                    <PieChart
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mPieChart}
                    />
                )
            }
            <p>ScatterPlot</p>
            {
                wrap(
                    <ScatterPlot
                        projectId="storybook"
                        xAxisMeasure={MEASURE_1}
                        yAxisMeasure={MEASURE_2}
                        attribute={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mScatterPlot}
                    />
                )
            }
            <p>BubbleChart</p>
            {
                wrap(
                    <BubbleChart
                        projectId="storybook"
                        xAxisMeasure={MEASURE_1}
                        yAxisMeasure={MEASURE_2}
                        size={MEASURE_3}
                        viewBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mBubble2}
                    />
                )
            }
            <p>FunnelChart</p>
            {
                wrap(
                    <FunnelChart
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        viewBy={ATTRIBUTE_1}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                        afterRender={mFunnelChart}
                    />
                )
            }
            <p>Line chart</p>
            {
                wrap(
                    <LineChart
                        projectId="storybook"
                        measures={[MEASURE_2]}
                        trendBy={ATTRIBUTE_5}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mLineChart2}
                    />
                )
            }
            <p>ColumnChart</p>
            {
                wrap(
                    <ColumnChart
                        projectId="storybook"
                        measures={[MEASURE_2]}
                        viewBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mColumnChart3}
                    />
                )
            }
            <p>Resize window to 867px or less</p>
            {
                screenshotWrap(
                    getChart({
                        legendPosition: 'right',
                        legendResponsive: true,
                        dataSet: fixtures.barChartWith60MetricsAndViewByAttribute,
                        width: '100%',
                        height: '100%',
                        minHeight: 300,
                        chartHeight: 300,
                        afterRender: mResizeChart
                    })
                )
            }
            <p>Area chart with disabled stacking</p>
            {
                screenshotWrap(
                    wrap(
                        <Visualization
                            {...fixtures.areaChartWith3MetricsAndViewByAttribute}
                            config={{
                                type: 'area',
                                stacking: false,
                                legend: {
                                    position: 'top'
                                }
                            }}
                            afterRender={mAreaChartDisabledStack}
                        />
                    )
                )
            }
            <p>Heatmap 2</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        trendBy={ATTRIBUTE_5}
                        segmentBy={ATTRIBUTE_4}
                        afterRender={mHeat2}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Tree map 2</p>
            {
                wrap(
                    <Treemap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        segmentBy={ATTRIBUTE_4}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        afterRender={mTreeMap2}
                    />,
                    1000,
                    '100%'
                )
            }
        </div>
    );
}).add('Limit test', () => {
    return screenshotWrap(
        <div>
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_8}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_9}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_10}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_11}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_12}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_13}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_14}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_15}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_16}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_17}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_18}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_19}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_20}
                    />,
                    3500,
                    '100%'
                )
            }

            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_8}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_9}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_10}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_11}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_12}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_13}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_14}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_15}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_16}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_17}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_18}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_19}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_2]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_20}
                    />,
                    3500,
                    '100%'
                )
            }

            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_8}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_9}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_10}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_11}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_12}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_13}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_14}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_15}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_16}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_17}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_18}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_19}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_20}
                    />,
                    3500,
                    '100%'
                )
            }

            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_5}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_8}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_9}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_10}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_11}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_12}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_13}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_14}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_15}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_16}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_17}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_18}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_19}
                    />,
                    3500,
                    '100%'
                )
            }
            <p>Heatmap</p>
            {
                wrap(
                    <Heatmap
                        projectId="storybook"
                        measures={[MEASURE_3, MEASURE_1_WITH_ALIAS]}
                        trendBy={ATTRIBUTE_4}
                        segmentBy={ATTRIBUTE_20}
                    />,
                    3500,
                    '100%'
                )
            }
        </div>
    );
});
