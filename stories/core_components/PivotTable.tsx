// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { screenshotWrap } from '@gooddata/test-storybook';

import { PivotTable } from '../../src';
import { IPivotTableConfig } from '../../src/interfaces/PivotTable';
import { onErrorHandler } from '../mocks';

import { GERMAN_SEPARATORS } from '../data/numberFormat';
import {
    ATTRIBUTE_1,
    ATTRIBUTE_1_WITH_ALIAS,
    ATTRIBUTE_2,
    ATTRIBUTE_3,
    MEASURE_1,
    MEASURE_1_WITH_ALIAS,
    MEASURE_2,
    MEASURE_2_WITH_FORMAT,
    MEASURE_WITH_NULLS,
    TOTAL_M1_A1,
    TOTAL_M2_A1,
    ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
    ARITHMETIC_MEASURE_USING_ARITHMETIC,
    ATTRIBUTE_COUNTRY
} from '../data/componentProps';

function logTotalsChange(data: any) {
    if (data.properties && data.properties.totals) {
        action('totals changed')(data.properties.totals);
    }
}

const wrapperStyle = { width: 1200, height: 300 };

storiesOf('Core components/PivotTable', module)
    .add('two measures, one attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('renamed measure and renamed attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1_WITH_ALIAS]}
                    rows={[ATTRIBUTE_1_WITH_ALIAS]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('only measures', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, 2 row attributes', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, 2 column attributes', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    columns={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, 1 column attribute, 1 row attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    columns={[ATTRIBUTE_1]}
                    rows={[ATTRIBUTE_2]}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('two measures, 1 column attribute, 1 row attribute with sorting', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    columns={[ATTRIBUTE_1]}
                    sortBy={[
                        {
                            attributeSortItem: {
                                direction: 'asc',
                                attributeIdentifier: 'a2'
                            }
                        },
                        {
                            measureSortItem: {
                                direction: 'asc',
                                locators: [
                                    {
                                        attributeLocatorItem: {
                                            attributeIdentifier: 'a1',
                                            element: '/gdc/md/storybook/obj/4/elements?id=2'
                                        }
                                    },
                                    {
                                        measureLocatorItem: {
                                            measureIdentifier: 'm1'
                                        }
                                    }
                                ]
                            }
                        }
                    ]}
                    rows={[ATTRIBUTE_2]}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('table with resizing', () => (
        screenshotWrap(
            <div
                style={{
                    width: 800,
                    height: 400,
                    padding: 10,
                    border: 'solid 1px #000000',
                    resize: 'both',
                    overflow: 'auto'
                }}
                className="s-table"
            >
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_2, ATTRIBUTE_1]}
                    totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                    onError={onErrorHandler}
                    pushData={logTotalsChange}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('custom number separators', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1]}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('custom measure format', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2_WITH_FORMAT]}
                    rows={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('empty value', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_WITH_NULLS]}
                    rows={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('totals - two measures, two row attributes', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('totals - two measures, one column attributes, one row attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    columns={[ATTRIBUTE_2]}
                    rows={[ATTRIBUTE_1]}
                    totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('totals - two measures, one row attribute, maxHeight 100', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1]}
                    totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={{
                        maxHeight: 100
                    }}
                />
            </div>
        )
    ))
    .add('totals - two measures, one row attribute, maxHeight 300', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1]}
                    totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={{
                        maxHeight: 300
                    }}
                />
            </div>
        )
    ))
    .add('arithmetic measures', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[
                        ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
                        ARITHMETIC_MEASURE_USING_ARITHMETIC,
                        MEASURE_1,
                        MEASURE_2
                    ]}
                    rows={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>
        )
    ))
    .add('data grouping - group rows in attribute columns', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1, ATTRIBUTE_COUNTRY, ATTRIBUTE_2]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    groupRows={true}
                />
            </div>
        )
    ))
    .add('data grouping - do not group rows in attribute columns when not sorted by first attribute', () => (
        screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    rows={[ATTRIBUTE_1, ATTRIBUTE_COUNTRY, ATTRIBUTE_2]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    groupRows={true}
                    sortBy={[{
                        measureSortItem: {
                            direction: 'desc',
                            locators: [
                                {
                                    measureLocatorItem: {
                                        measureIdentifier: 'm1'
                                    }
                                }
                            ]
                        }
                    }]}
                />
            </div>
        )
    ))
    .add('BB-1410', () => {
        const config: IPivotTableConfig = {
            menu: {
                aggregations: true,
                subTotals: true
            }
        };

        // const SUBTOTAL_M1_A2: VisualizationObject.IVisualizationTotal = {
        //     measureIdentifier: MEASURE_1.measure.localIdentifier,
        //     type: 'sum',
        //     attributeIdentifier: ATTRIBUTE_2.visualizationAttribute.localIdentifier
        // };

        return screenshotWrap(
            <div style={wrapperStyle} className="s-table">
                <PivotTable
                    projectId="storybook"
                    measures={[MEASURE_1, MEASURE_2]}
                    columns={[ATTRIBUTE_3]}
                    rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    groupRows={true}
                    totals={[
                        {
                            type: 'sum',
                            measureIdentifier: 'm1',
                            attributeIdentifier: 'a1'
                        },
                        {
                            type: 'sum',
                            measureIdentifier: 'm2',
                            attributeIdentifier: 'a1'
                        },

                        {
                            type: 'min',
                            measureIdentifier: 'm1',
                            attributeIdentifier: 'a2'
                        },

                        {
                            type: 'max',
                            measureIdentifier: 'm1',
                            attributeIdentifier: 'a2'
                        },
                        {
                            type: 'max',
                            measureIdentifier: 'm2',
                            attributeIdentifier: 'a2'
                        }
                    ]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={config}
                />
            </div>
        );
    });
