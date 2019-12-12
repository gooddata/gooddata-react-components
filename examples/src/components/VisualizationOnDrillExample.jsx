// (C) 2007-2019 GoodData Corporation
import React from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization } from "@gooddata/react-components";

import { projectId, columnVisualizationUri, totalSalesIdentifier } from "../utils/fixtures";
import { ExampleWithOnDrill } from "./utils/ExampleWithOnDrill";

export class VisualizationColumnChartByIdentifierExample extends ExampleWithOnDrill {
    render() {
        return (
            <div className="s-visualization-on-drill">
                <div style={{ height: 300 }} className="s-visualization-chart">
                    <Visualization
                        projectId={projectId}
                        uri={columnVisualizationUri}
                        onDrill={this.onDrill}
                        drillableItems={[
                            {
                                identifier: totalSalesIdentifier,
                            },
                        ]}
                    />
                </div>
                {this.renderDrillEvent()}
            </div>
        );
    }
}

export default VisualizationColumnChartByIdentifierExample;
