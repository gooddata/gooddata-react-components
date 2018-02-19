import React, { Component } from 'react';
import { AfmComponents } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';
import Measure from 'react-measure';

import { Loading } from './utils/Loading';
import { Error } from './utils/Error';
import { projectId, totalSalesIdentifier, locationResortIdentifier } from '../utils/fixtures';

export class ResizableExample extends Component {
    render() {
        const afm = {
            measures: [
                {
                    localIdentifier: 'amount',
                    definition: {
                        measure: {
                            item: {
                                identifier: totalSalesIdentifier
                            },
                            aggregation: 'sum'
                        }
                    },
                    alias: '$ Total Sales',
                    format: '#,##0'
                }
            ],
            attributes: [
                {
                    displayForm: {
                        identifier: locationResortIdentifier
                    },
                    localIdentifier: 'location_resort'
                }
            ]
        };

        return (
            <Measure bounds>
                {({ measureRef, contentRect }) => (
                    <div
                        ref={measureRef}
                        style={{ width: 600, height: 300, resize: 'both', overflow: 'auto', border: '1px silver solid', padding: '0 5px 5px 0' }}
                        className="s-responsive-vis"
                    >
                        <AfmComponents.BarChart
                            width={contentRect.bounds.width}
                            height={contentRect.bounds.height}
                            projectId={projectId}
                            afm={afm}
                            LoadingComponent={Loading}
                            ErrorComponent={Error}
                        />
                    </div>
                )}
            </Measure>
        );
    }
}

export default ResizableExample;
