// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { GoodDataProvider, AfmComponents } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import { Loading } from './utils/Loading';
import { Error } from './utils/Error';
import {
    projectId,
    franchiseFeesAdRoyaltyIdentifier
} from '../utils/fixtures';

export class CorsExample extends Component {
    render() {
        const afm = {
            measures: [
                {
                    localIdentifier: 'franchiseFeesAdRoyaltyIdentifier',
                    definition: {
                        measure: {
                            item: {
                                identifier: franchiseFeesAdRoyaltyIdentifier
                            }
                        }
                    },
                    format: '#,##0'
                }
            ]
        };

        const domain = ''; // Custom domain name e.g. https://secure.gooddata.com

        return (
            <GoodDataProvider domain={domain}>
                <div style={{ height: 300 }} className="s-pie-chart">
                    <AfmComponents.PieChart
                        projectId={projectId}
                        afm={afm}
                        LoadingComponent={Loading}
                        ErrorComponent={Error}
                    />
                </div>
            </GoodDataProvider>
        );
    }
}

export default CorsExample;
