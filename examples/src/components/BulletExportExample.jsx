// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { Model, Visualization } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    bulletVisualizationIdentifier,
    franchiseFeesLocalIdentifierOngoingRoyalty,
    locationResortIdentifier,
    franchiseFeesLocalIdentifier,
} from "../utils/fixtures";

import { CUSTOM_COLOR_PALETTE } from "../utils/colors";

import ExampleWithExport from "./utils/ExampleWithExport";

const filters = [
    Model.measureValueFilter(franchiseFeesLocalIdentifierOngoingRoyalty).condition("GREATER_THAN", {
        value: 400000,
    }),
    Model.positiveAttributeFilter(locationResortIdentifier, ["Montgomery"], true),
];

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

export class BulletExportExample extends Component {
    render() {
        return (
            <ExampleWithExport>
                {onExportReady => (
                    <div style={{ height: 300 }} className="s-bullet-chart">
                        <Visualization
                            projectId={projectId}
                            identifier={bulletVisualizationIdentifier}
                            config={config}
                            onExportReady={onExportReady}
                            filters={filters}
                        />
                    </div>
                )}
            </ExampleWithExport>
        );
    }
}

export default BulletExportExample;
