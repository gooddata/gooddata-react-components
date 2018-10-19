// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { Visualization, GdcWrapper } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import { projectId, columnVisualizationIdentifier } from '../utils/fixtures';

export class BarChartPaletteExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-visualization-chart">
                <GdcWrapper projectId={projectId}>
                    <Visualization
                        projectId={projectId}
                        identifier={columnVisualizationIdentifier}
                    />
                </GdcWrapper>
            </div>
        );
    }
}

export default BarChartPaletteExample;
