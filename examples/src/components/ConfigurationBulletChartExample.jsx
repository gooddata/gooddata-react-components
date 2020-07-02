// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization, Model } from "@gooddata/react-components";

import {
    projectId,
    bulletVisualizationIdentifier,
    franchiseFeesLocalIdentifierOngoingRoyalty,
    locationResortIdentifier,
    franchiseFeesLocalIdentifier,
} from "../utils/fixtures";

import { CUSTOM_COLOR_PALETTE } from "../utils/colors";

const filters = [
    Model.measureValueFilter(franchiseFeesLocalIdentifierOngoingRoyalty).condition("GREATER_THAN", {
        value: 400000,
    }),
    Model.positiveAttributeFilter(locationResortIdentifier, ["Montgomery"], true),
];

export class ConfigurationBulletChartExample extends Component {
    render() {
        const config = {
            legend: { position: "bottom" },
            yaxis: {
                visible: true,
                labelsEnabled: true,
                rotation: "auto",
            },
            xaxis: {
                visible: true,
                labelsEnabled: true,
                rotation: "auto",
                min: "100000",
                max: "1500000",
                measures: [franchiseFeesLocalIdentifier],
            },
            grid: {
                enabled: false, // boolean
            },
            colorPalette: CUSTOM_COLOR_PALETTE,
        };

        return (
            <div style={{ height: 300 }} className="s-visualization-bullet">
                <Visualization
                    projectId={projectId}
                    identifier={bulletVisualizationIdentifier}
                    filters={filters}
                    config={config}
                />
            </div>
        );
    }
}

export default ConfigurationBulletChartExample;
