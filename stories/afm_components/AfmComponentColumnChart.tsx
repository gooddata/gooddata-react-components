// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { ColumnChart } from '../../src/components/afm/ColumnChart';
import {
    AFM_ARITHMETIC_MEASURES_ONE_ATTRIBUTE,
    AFM_ONE_MEASURE_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_RENAMED_ATTRIBUTE
} from '../data/afmComponentProps';
import { CUSTOM_COLORS } from '../data/colors';
import { onErrorHandler } from '../mocks';
import '../../styles/scss/charts.scss';
import { GERMAN_SEPARATORS } from '../data/numberFormat';
import { ATTRIBUTE } from '../../src/constants/bucketNames';
import { VisualizationObject } from '@gooddata/typings';
import { MEASURE_1, MEASURE_2, ATTRIBUTE_1, MEASURE_3 } from '../data/componentProps';
import { convertBucketsToAFM } from '../../src/helpers/conversion';
import { getDualAxesBuckets, getDualAxesConfigProps } from '../../src/helpers/dualAxes';

const wrapperStyle = { width: 800, height: 400 };

storiesOf('AFM components/ColumnChart', module)
    .add('two measures, one attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ColumnChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, one renamed attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ColumnChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_RENAMED_ATTRIBUTE}
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
                <ColumnChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_ONE_ATTRIBUTE}
                    config={{ colors: CUSTOM_COLORS }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('with German number format', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <ColumnChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_ONE_ATTRIBUTE}
                    config={{ colors: CUSTOM_COLORS, ...GERMAN_SEPARATORS }}
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
                <ColumnChart
                    projectId="storybook"
                    afm={AFM_ARITHMETIC_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('dual axes with three measures and one attribute', () => {
        const props: any = {
            measures:           [MEASURE_3],
            secondaryMeasures:  [MEASURE_1, MEASURE_2]
        };

        const buckets: VisualizationObject.IBucket[] = [
            ...getDualAxesBuckets(props),
            {
                localIdentifier: ATTRIBUTE,
                items: [ATTRIBUTE_1]
            }
        ];

        return screenshotWrap(
            <div style={wrapperStyle}>
                <ColumnChart
                    config={getDualAxesConfigProps(buckets)}
                    projectId="storybook"
                    afm={convertBucketsToAFM(buckets)}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        );
    })
    .add('only right axes with two measures and one attribute', () => {
        const props: any = {
            measures:           [],
            secondaryMeasures:  [MEASURE_1, MEASURE_2]
        };

        const buckets: VisualizationObject.IBucket[] = [
            ...getDualAxesBuckets(props),
            {
                localIdentifier: ATTRIBUTE,
                items: [ATTRIBUTE_1]
            }
        ];

        return screenshotWrap(
            <div style={wrapperStyle}>
                <ColumnChart
                    config={getDualAxesConfigProps(buckets)}
                    projectId="storybook"
                    afm={convertBucketsToAFM(buckets)}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        );
    });
