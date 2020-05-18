// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization } from "@gooddata/react-components";

import { projectId, columnVisualizationMeasureValueFilterIdentifier } from "../utils/fixtures";

export class VisualizationMeasureValueFilterByIdentifierExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-visualization-chart">
                <Visualization
                    projectId={projectId}
                    identifier={columnVisualizationMeasureValueFilterIdentifier}
                />
            </div>
        );
    }
}

export default VisualizationMeasureValueFilterByIdentifierExample;
