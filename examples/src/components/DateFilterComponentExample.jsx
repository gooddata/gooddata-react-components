// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import moment from "moment";
import { DateFilter } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/dateFilter.css";

const platformDateFormat = "YYYY-MM-DD";

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
        from: moment()
            .subtract(1, "month")
            .startOf("day")
            .format(platformDateFormat),
        to: moment()
            .startOf("day")
            .format(platformDateFormat),
        name: "",
        visible: true,
    },
    absolutePreset: [],
    relativeForm: {
        localIdentifier: "RELATIVE_FORM",
        type: "relativeForm",
        granularity: "GDC.time.month",
        from: undefined,
        to: undefined,
        name: "",
        visible: true,
        availableGranularities: ["GDC.time.date", "GDC.time.month", "GDC.time.quarter", "GDC.time.year"],
    },
    relativePreset: {
        "GDC.time.date": [
            {
                from: -6,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_7_DAYS",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -29,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_30_DAYS",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -89,
                to: 0,
                granularity: "GDC.time.date",
                localIdentifier: "LAST_90_DAYS",
                type: "relativePreset",
                visible: true,
                name: "",
            },
        ],
        "GDC.time.month": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.month",
                localIdentifier: "THIS_MONTH",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -1,
                to: -1,
                granularity: "GDC.time.month",
                localIdentifier: "LAST_MONTH",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -11,
                to: 0,
                granularity: "GDC.time.month",
                localIdentifier: "LAST_12_MONTHS",
                type: "relativePreset",
                visible: true,
                name: "",
            },
        ],
        "GDC.time.quarter": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.quarter",
                localIdentifier: "THIS_QUARTER",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -1,
                to: -1,
                granularity: "GDC.time.quarter",
                localIdentifier: "LAST_QUARTER",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -3,
                to: 0,
                granularity: "GDC.time.quarter",
                localIdentifier: "LAST_4_QUARTERS",
                type: "relativePreset",
                visible: true,
                name: "",
            },
        ],
        "GDC.time.year": [
            {
                from: 0,
                to: 0,
                granularity: "GDC.time.year",
                localIdentifier: "THIS_YEAR",
                type: "relativePreset",
                visible: true,
                name: "",
            },
            {
                from: -1,
                to: -1,
                granularity: "GDC.time.year",
                localIdentifier: "LAST_YEAR",
                type: "relativePreset",
                visible: true,
                name: "",
            },
        ],
    },
};

const availableGranularities = ["GDC.time.month", "GDC.time.year", "GDC.time.quarter", "GDC.time.date"];

export class DateFilterComponentExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilterOption: defaultDateFilterOptions.allTime,
            excludeCurrentPeriod: false,
        };
    }

    onApply = (...params) => {
        // eslint-disable-next-line no-console
        console.log("DateFilterExample onApply", ...params);
    };

    onCancel = (...params) => {
        // eslint-disable-next-line no-console
        console.log("DateFilterExample onCancel", ...params);
    };

    onDropdownOpenChanged = (...params) => {
        // eslint-disable-next-line no-console
        console.log("DateFilterExample onDropdownOpenChanged", ...params);
    };

    setSelectedFilterOption = newFilter => {
        this.setState({
            selectedFilterOption: newFilter,
        });
    };

    setExcludeCurrentPeriod = isExcluded => {
        this.setState({
            excludeCurrentPeriod: isExcluded,
        });
    };

    render() {
        return (
            <div style={{ width: 200 }}>
                <DateFilter
                    availableGranularities={availableGranularities}
                    filterOptions={defaultDateFilterOptions}
                    selectedFilterOption={this.state.selectedFilterOption}
                    originalSelectedFilterOption={this.state.selectedFilterOption} // just to show the value immediately
                    onSelectedFilterOptionChange={this.setSelectedFilterOption}
                    originalExcludeCurrentPeriod={this.state.excludeCurrentPeriod} // just to show the value immediately
                    excludeCurrentPeriod={this.state.excludeCurrentPeriod}
                    isEditMode={false}
                    isExcludeCurrentPeriodEnabled
                    onExcludeCurrentPeriodChange={this.setExcludeCurrentPeriod}
                    onApplyClick={this.onApply}
                    onCancelClick={this.onCancel}
                    onDropdownOpenChanged={this.onDropdownOpenChanged}
                />
            </div>
        );
    }
}

export default DateFilterComponentExample;
