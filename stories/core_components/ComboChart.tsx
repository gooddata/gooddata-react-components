// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { ComboChart } from '../../src';
import { onErrorHandler } from '../mocks';
import {
    ATTRIBUTE_1,
    MEASURE_1,
    MEASURE_2,
    ATTRIBUTE_1_SORT_ITEM,
    MEASURE_2_SORT_ITEM,
    ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
    ARITHMETIC_MEASURE_USING_ARITHMETIC,
    ATTRIBUTE_1_WITH_ALIAS
} from '../data/componentProps';
import { GERMAN_SEPARATORS } from '../data/numberFormat';
import { CUSTOM_COLOR_PALETTE_CONFIG } from '../data/configProps';

const wrapperStyle = { width: 800, height: 400 };

storiesOf('Core components/ComboChart', module)
    .add('one column measure, one line measures, one attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('one column measure, one renamed line measures, one attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1_WITH_ALIAS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('only bar', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    viewBy={ATTRIBUTE_1_WITH_ALIAS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('custom colors', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={CUSTOM_COLOR_PALETTE_CONFIG}
                />
            </div>
        )
    ))
    .add('sorted by attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    sortBy={[ATTRIBUTE_1_SORT_ITEM]}
                />
            </div>
        )
    ))
    .add('sorted by measure', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    sortBy={[MEASURE_2_SORT_ITEM]}
                />
            </div>
        )
    ))
    .add('with German number format', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1]}
                    lineMeasures={[MEASURE_2]}
                    viewBy={ATTRIBUTE_1}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('arithmetic measures', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ComboChart
                    projectId="storybook"
                    columnMeasures={[MEASURE_1, MEASURE_2]}
                    lineMeasures={[ARITHMETIC_MEASURE_SIMPLE_OPERANDS, ARITHMETIC_MEASURE_USING_ARITHMETIC]}
                    viewBy={ATTRIBUTE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ));
