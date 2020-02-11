// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { BarChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import {
    projectId,
    numberOfChecksIdentifier,
    totalSalesIdentifier,
    locationNameDisplayFormIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(totalSalesIdentifier)
        .localIdentifier("totalSales")
        .title("Total Sales")
        .format("#,##0"),
    Model.measure(numberOfChecksIdentifier)
        .localIdentifier("numOfChecks")
        .title("Number of Checks")
        .format("#,##0"),
];

const attributes = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName")];

const greaterThanFilter = Model.measureValueFilter("totalSales").condition("GREATER_THAN", {
    value: 7000000,
});

export class MeasureValueFilterExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: [],
        };
    }

    renderPresetButton(label, appliedFilters, isActive) {
        return (
            <button
                className={`gd-button gd-button-secondary ${isActive ? "is-active" : ""} s-filter-button`}
                onClick={() =>
                    this.setState({
                        filters: appliedFilters,
                    })
                }
            >
                {label}
            </button>
        );
    }

    render() {
        const { filters } = this.state;
        return (
            <div>
                <div>
                    {this.renderPresetButton("All total sales", [], filters.length === 0)}
                    {this.renderPresetButton(
                        "Total sales greater than 7,000,000 (stacked to 100%)",
                        [greaterThanFilter],
                        filters.length > 0,
                    )}
                </div>
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-stacked-bar">
                    <BarChart
                        projectId={projectId}
                        measures={measures}
                        viewBy={attributes}
                        config={{
                            stackMeasuresToPercent: true,
                            dataLabels: {
                                visible: true,
                            },
                        }}
                        filters={filters}
                    />
                </div>
            </div>
        );
    }
}

export default MeasureValueFilterExample;
