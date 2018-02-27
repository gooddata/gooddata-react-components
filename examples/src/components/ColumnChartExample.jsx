
import React, { Component } from 'react';
import { ColumnChart } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import { Loading } from './Loading';
import { Error } from './Error';
import { totalSalesIdentifier, monthDateIdentifier, projectId } from '../utils/fixtures';

export class ColumnChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log('ColumnChartExample onLoadingChanged', ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log('ColumnChartExample onError', ...params);
    }

    render() {
        const totalSales = {
            measure: {
                localIdentifier: 'totalSales',
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: totalSalesIdentifier
                        },
                        aggregation: 'sum'
                    }
                },
                alias: '$ Total Sales',
                format: '#,##0'
            }
        };

        const month = {
            visualizationAttribute: {
                displayForm: {
                    identifier: monthDateIdentifier
                },
                localIdentifier: 'month'
            }
        };

        return (
            <div style={{ height: 300 }} className="s-column-chart">
                <ColumnChart
                    projectId={projectId}
                    measures={[totalSales]}
                    attributes={[month]}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                    LoadingComponent={Loading}
                    ErrorComponent={Error}
                />
            </div>
        );
    }
}

export default ColumnChartExample;
