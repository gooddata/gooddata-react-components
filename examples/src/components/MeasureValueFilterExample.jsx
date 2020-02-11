// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import { projectId, locationNameDisplayFormIdentifier, franchisedSalesIdentifier } from "../utils/fixtures";

const measures = [
    Model.measure(franchisedSalesIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseSales")
        .title("Franchise Sales"),
];

const attributes = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName")];
const greaterThanFilter = Model.measureValueFilter("franchiseSales").condition("GREATER_THAN", {
    value: 7000000,
});
const betweenFilter = Model.measureValueFilter("franchiseSales").condition("BETWEEN", {
    from: 5000000,
    to: 8000000,
});

export class FilterByValueExample extends Component {
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
                    {this.renderPresetButton("All franchise sales", [], filters.length === 0)}
                    {this.renderPresetButton(
                        "Franchise sales greater than 7,000,000",
                        [greaterThanFilter],
                        filters[0] === greaterThanFilter,
                    )}
                    {this.renderPresetButton(
                        "Franchise sales between 5,000,000 and 8,000,000",
                        [betweenFilter],
                        filters[0] === betweenFilter,
                    )}
                </div>
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-pivot-table">
                    <PivotTable
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        filters={filters}
                    />
                </div>
            </div>
        );
    }
}

export default FilterByValueExample;
