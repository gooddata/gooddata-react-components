// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization } from "@gooddata/react-components";

import { projectId, bulletVisualizationIdentifier } from "../utils/fixtures";

export class VisualizationBulletByIdentifierExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-visualization-bullet">
                <Visualization projectId={projectId} identifier={bulletVisualizationIdentifier} />
            </div>
        );
    }
}

export default VisualizationBulletByIdentifierExample;
