import React, { Component } from 'react';
import { Table } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import {
    projectId,
    monthDateIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty
} from '../utils/fixtures';
import { Loading } from './Loading';
import { Error } from './Error';

export class TableExample extends Component {
    onLoadingChanged(...params) {
    // eslint-disable-next-line no-console
        return console.log('ColumnChartExample onLoadingChanged', ...params);
    }

    onError(...params) {
    // eslint-disable-next-line no-console
        return console.log('ColumnChartExample onError', ...params);
    }

    render() {
        const measures = [
            {
                measure: {
                    localIdentifier: 'franchiseFeesIdentifier',
                    definition: {
                        measureDefinition: {
                            item: {
                                identifier: franchiseFeesIdentifier
                            }
                        }
                    },
                    format: '#,##0'
                }
            },
            {
                measure: {
                    localIdentifier: 'franchiseFeesAdRoyaltyIdentifier',
                    definition: {
                        measureDefinition: {
                            item: {
                                identifier: franchiseFeesAdRoyaltyIdentifier
                            }
                        }
                    },
                    format: '#,##0'
                }
            },
            {
                measure: {
                    localIdentifier: 'franchiseFeesInitialFranchiseFeeIdentifier',
                    definition: {
                        measureDefinition: {
                            item: {
                                identifier: franchiseFeesInitialFranchiseFeeIdentifier
                            }
                        }
                    },
                    format: '#,##0'
                }
            },
            {
                measure: {
                    localIdentifier: 'franchiseFeesIdentifierOngoingRoyalty',
                    definition: {
                        measureDefinition: {
                            item: {
                                identifier: franchiseFeesIdentifierOngoingRoyalty
                            }
                        }
                    },
                    format: '#,##0'
                }
            }
        ];

        const attributes = [
            {
                visualizationAttribute: {
                    displayForm: {
                        identifier: monthDateIdentifier
                    },
                    localIdentifier: 'month'
                }
            }
        ];

        const resultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ['month'],
                    totals: [
                        {
                            measureIdentifier: 'franchiseFeesIdentifier',
                            type: 'avg',
                            attributeIdentifier: 'month'
                        },
                        {
                            measureIdentifier: 'franchiseFeesAdRoyaltyIdentifier',
                            type: 'avg',
                            attributeIdentifier: 'month'
                        },
                        {
                            measureIdentifier: 'franchiseFeesInitialFranchiseFeeIdentifier',
                            type: 'avg',
                            attributeIdentifier: 'month'
                        },
                        {
                            measureIdentifier: 'franchiseFeesIdentifierOngoingRoyalty',
                            type: 'avg',
                            attributeIdentifier: 'month'
                        }
                    ]
                },
                {
                    itemIdentifiers: ['measureGroup']
                }
            ]
        };

        return (
            <div style={{ height: 300 }} className="s-table">
                <Table
                    projectId={projectId}
                    measures={measures}
                    attributes={attributes}
                    resultSpec={resultSpec}
                    totals={[
                        { type: 'avg', outputMeasureIndexes: [0, 1, 2, 3], alias: 'AVG' }
                    ]}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                    LoadingComponent={Loading}
                    ErrorComponent={Error}
                />
            </div>
        );
    }
}

export default TableExample;
