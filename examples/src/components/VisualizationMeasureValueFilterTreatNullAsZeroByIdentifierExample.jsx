// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization, Model } from "@gooddata/react-components";
import {
    projectId,
    tableVisualizationMeasureValueFilterTreatNullAsZeroIdentifier,
    sumOfNumberLocalIdentifier,
} from "../utils/fixtures";

const filters = [
    Model.measureValueFilter(sumOfNumberLocalIdentifier).condition(
        "LESS_THAN",
        { value: 10 },
        { treatNullValuesAs: 0 },
    ),
];

export class VisualizationMeasureValueFilterTreatNullAsZeroByIdentifierExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-measure-value-filter-treat-null-as-zero-visualization">
                <Visualization
                    projectId={projectId}
                    identifier={tableVisualizationMeasureValueFilterTreatNullAsZeroIdentifier}
                    experimentalVisExecution
                    filters={filters}
                />
            </div>
        );
    }
}

export default VisualizationMeasureValueFilterTreatNullAsZeroByIdentifierExample;
