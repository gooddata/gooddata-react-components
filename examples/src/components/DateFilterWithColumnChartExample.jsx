// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { DateFilter, ColumnChart, Model, DateFilterHelpers } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/dateFilter.css";
import {
    totalSalesIdentifier,
    projectId,
    dateDatasetIdentifier,
    monthDateIdentifier,
} from "../utils/fixtures";

const amountMeasure = Model.measure(totalSalesIdentifier)
    .format("#,##0")
    .alias("$ Total Sales");

const monthAttribute = Model.attribute(monthDateIdentifier);

const availableGranularities = ["GDC.time.year"];

const defaultDateFilterOptions = {
    allTime: {
        localIdentifier: "ALL_TIME",
        type: "allTime",
        name: "",
        visible: true,
    },
    absoluteForm: {
        localIdentifier: "ABSOLUTE_FORM",
        type: "absoluteForm",
        from: "2017-01-01",
        to: "2017-12-31",
        name: "",
        visible: true,
    },
    absolutePreset: [
        {
            from: "2015-01-01",
            to: "2015-12-31",
            name: "Year 2015",
            localIdentifier: "year2015",
            visible: true,
            type: "absolutePreset",
        },
        {
            from: "2016-01-01",
            to: "2016-12-31",
            name: "Year 2016",
            localIdentifier: "year2016",
            visible: true,
            type: "absolutePreset",
        },
        {
            from: "2017-01-01",
            to: "2017-12-31",
            name: "Year 2017",
            localIdentifier: "year2017",
            visible: true,
            type: "absolutePreset",
        },
    ],
    relativeForm: {
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        granularity: "GDC.time.year",
        from: -2,
        to: -2,
        name: "",
        visible: true,
        availableGranularities,
    },
    relativePreset: {
        "GDC.time.year": [
            {
                from: -2,
                to: -2,
                granularity: "GDC.time.year",
                localIdentifier: "twoYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "2 years ago",
            },
            {
                from: -3,
                to: -3,
                granularity: "GDC.time.year",
                localIdentifier: "threeYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "3 years ago",
            },
            {
                from: -4,
                to: -4,
                granularity: "GDC.time.year",
                localIdentifier: "fourYearsAgo",
                type: "relativePreset",
                visible: true,
                name: "4 years ago",
            },
        ],
    },
};

export class DateFilterComponentExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilterOption: defaultDateFilterOptions.allTime,
            excludeCurrentPeriod: false,
        };
    }

    onApply = (dateFilterOption, excludeCurrentPeriod) => {
        this.setState({
            selectedFilterOption: dateFilterOption,
            excludeCurrentPeriod,
        });
    };

    render() {
        const dateFilter = DateFilterHelpers.mapOptionToAfm(
            this.state.selectedFilterOption,
            {
                identifier: dateDatasetIdentifier,
            },
            this.state.excludeCurrentPeriod,
        );

        return (
            <div>
                <div style={{ width: 200 }}>
                    <DateFilter
                        excludeCurrentPeriod={this.state.excludeCurrentPeriod}
                        selectedFilterOption={this.state.selectedFilterOption}
                        filterOptions={defaultDateFilterOptions}
                        availableGranularities={availableGranularities}
                        customFilterName="Selected date range"
                        dateFilterMode="active"
                        onApply={this.onApply}
                    />
                </div>
                <div style={{ height: 300 }}>
                    <ColumnChart
                        projectId={projectId}
                        measures={[amountMeasure]}
                        viewBy={monthAttribute}
                        onLoadingChanged={this.onLoadingChanged}
                        filters={dateFilter ? [dateFilter] : []}
                    />
                </div>
            </div>
        );
    }
}

export default DateFilterComponentExample;
