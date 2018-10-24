// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { screenshotWrap } from '@gooddata/test-storybook';

import { BarChart } from '../../src/components/afm/BarChart';
import {
    AFM_ONE_MEASURE_ONE_ATTRIBUTE,
    AFM_ONE_RENAMED_MEASURE,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE,
    AFM_ONE_MEASURE_TWO_ATTRIBUTES,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE_POP,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE_PREVIOUS_PERIOD,
    AFM_ARITHMETIC_MEASURES_ONE_ATTRIBUTE
} from '../data/afmComponentProps';
import { CUSTOM_COLORS } from '../data/colors';
import { onErrorHandler } from '../mocks';
import '../../styles/scss/charts.scss';
import { GERMAN_SEPARATORS } from '../data/numberFormat';
import { ATTRIBUTE_1, MEASURE_1, MEASURE_2, MEASURE_3 } from '../data/componentProps';
import { getDualAxesBuckets, getDualAxesConfigProps } from '../../src/helpers/dualAxes';
import { ATTRIBUTE } from '../../src/constants/bucketNames';
import { VisualizationObject } from '@gooddata/typings';
import { convertBucketsToAFM } from '../../src/helpers/conversion';

const wrapperStyle = { width: 800, height: 400 };

storiesOf('AFM components/BarChart', module)
    .add('two measures, one attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <BarChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, one attribute, PoP', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <BarChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE_POP}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, one attribute, previous period', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <BarChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE_PREVIOUS_PERIOD}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('stacked bar chart', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <BarChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_TWO_ATTRIBUTES}
                    resultSpec={{
                        dimensions: [
                            {
                                itemIdentifiers: ['a1']
                            },
                            {
                                itemIdentifiers: ['a2', 'measureGroup']
                            }
                        ]
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('custom axis label (renaming, alias)', () => (
        screenshotWrap(
            <div style={wrapperStyle}>
                <BarChart
                    projectId="storybook"
                    afm={AFM_ONE_RENAMED_MEASURE}
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
                <BarChart
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
                <BarChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_TWO_ATTRIBUTES}
                    resultSpec={{
                        dimensions: [
                            {
                                itemIdentifiers: ['a1']
                            },
                            {
                                itemIdentifiers: ['a2', 'measureGroup']
                            }
                        ]
                    }}
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
                <BarChart
                    projectId="storybook"
                    afm={AFM_ARITHMETIC_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    )).add('dual axes with three measures and one attribute', () => {
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
                <BarChart
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
                <BarChart
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
