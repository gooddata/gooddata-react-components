import React, { Component } from 'react';
import { Kpi } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';

import { totalSalesIdentifier, projectId } from '../utils/fixtures';
import { Loading } from './utils/Loading';
import { Error } from './utils/Error';

export class KpiExample extends Component {
    render() {
        return (
            <div className="kpi">
                <style jsx>{`
                    .kpi {
                        margin: 10px 0;
                        font-size: 50px;
                        white-space: nowrap;
                        vertical-align: bottom;
                        line-height: 1.2em;
                        font-weight: 700;
                    }
                `}</style>
                <Kpi
                    projectId={projectId}
                    measure={totalSalesIdentifier}
                    LoadingComponent={Loading}
                    ErrorComponent={Error}
                />
            </div>
        );
    }
}

export default KpiExample;
