// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { BarChart } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import { totalSalesIdentifier, locationResortIdentifier, projectId } from '../utils/fixtures';

export class BarChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info('BarChartExample onLoadingChanged', ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info('BarChartExample onLoadingChanged', ...params);
    }

    render() {
        const amount = {
            measure: {
                localIdentifier: 'amount',
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: totalSalesIdentifier
                        }
                    }
                },
                alias: '$ Total Sales',
                format: '#,##0'
            }
        };

        const locationResort = {
            visualizationAttribute: {
                displayForm: {
                    identifier: locationResortIdentifier
                },
                localIdentifier: 'location_resort'
            }
        };

        return (
            <div style={{ height: 300 }} className="s-bar-chart">
                <BarChart
                    projectId={projectId}
                    measures={[amount]}
                    viewBy={locationResort}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default BarChartExample;
