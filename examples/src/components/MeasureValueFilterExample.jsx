// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import { projectId, franchiseFeesIdentifier, locationNameDisplayFormIdentifier } from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFees"),
];

const attributes = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName")];

const greaterThanFilter = {
    measureValueFilter: {
        measure: {
            localIdentifier: "franchiseFees",
        },
        condition: {
            comparison: {
                operator: "GREATER_THAN",
                value: 700000,
            },
        },
    },
};

const betweenFilter = {
    measureValueFilter: {
        measure: {
            localIdentifier: "franchiseFees",
        },
        condition: {
            range: {
                operator: "BETWEEN",
                from: 500000,
                to: 800000,
            },
        },
    },
};

const filterPresets = [
    {
        label: "No measure filter",
        key: "noFilter",
        filters: [],
    },
    {
        label: "Measure greater than 700,000",
        key: "greaterThanFilter",
        filters: [greaterThanFilter],
    },
    {
        label: "Measure between 500,000 and 800,000",
        key: "betweenFilter",
        filters: [betweenFilter],
    },
];

export class FilterByValueExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFilter: "noFilter",
        };
    }

    onFilterPresetChange = filterPresetKey => () => {
        this.setState({
            activeFilter: filterPresetKey,
        });
    };

    render() {
        const { activeFilter } = this.state;

        const { filters } = filterPresets.find(filterPreset => filterPreset.key === activeFilter);
        const filtersProp = filters.length > 0 ? { filters } : {};

        return (
            <div>
                <style jsx>
                    {`
                        .presets {
                            margin: -10px -10px 10px -10px;
                            display: flex;
                            flex-wrap: wrap;
                        }
                        .preset-option {
                            margin: 5px 10px;
                        }
                        .presets-label {
                            margin: 5px 10px;
                            padding: 6px 0;
                        }
                    `}
                </style>
                <div className="presets">
                    <span className="presets-label">Applied filter</span>
                    {filterPresets.map(presetItem => {
                        const { key, label } = presetItem;
                        return (
                            <button
                                key={key}
                                className={`preset-option gd-button gd-button-secondary s-filter-preset-${key} ${
                                    key === activeFilter ? " is-active" : ""
                                }`}
                                onClick={this.onFilterPresetChange(key)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-pivot-table-measure-value-filter">
                    <PivotTable
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        {...filtersProp}
                    />
                </div>
            </div>
        );
    }
}

export default FilterByValueExample;
