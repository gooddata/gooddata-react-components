// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { ExtendedDateFilter } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import "@gooddata/react-components/styles/css/extendedDateFilter.css";

const noop = () => {};

const filterOptions = {
    allTime: {
        localIdentifier: "ALL_TIME",
        name: "",
        type: "allTime",
        visible: true,
    },
    absolutePreset: [
        {
            from: "2019-01-01",
            localIdentifier: "YEAR_2019",
            name: "The year 2019",
            to: "2019-12-31",
            type: "absolutePreset",
            visible: true,
        },
    ],
    relativeForm: {
        availableGranularities: ["GDC.time.date"],
        granularity: "GDC.time.date",
        localIdentifier: "RELATIVE_FORM",
        name: "",
        type: "relativeForm",
        visible: true,
    },
    relativePreset: {
        "GDC.time.month": [
            {
                from: 0,
                granularity: "GDC.time.month",
                localIdentifier: "THIS_MONTH",
                to: 0,
                name: "",
                type: "relativePreset",
                visible: true,
            },
        ],
    },
};

const selectedFilterOption = {
    localIdentifier: "ALL_TIME",
    type: "allTime",
    name: "",
    visible: true,
};

export class ExtendedDateFilterComponentExample extends Component {
    onApply = (...params) => {
        // eslint-disable-next-line no-console
        console.log("ExtendedDateFilterExample onApply", ...params);
    };

    render() {
        return (
            <div>
                <ExtendedDateFilter
                    filterOptions={filterOptions}
                    selectedFilterOption={selectedFilterOption}
                    onSelectedFilterOptionChange={noop}
                    originalSelectedFilterOption={selectedFilterOption}
                    excludeCurrentPeriod={false}
                    originalExcludeCurrentPeriod={false}
                    isExcludeCurrentPeriodEnabled={false}
                    onExcludeCurrentPeriodChange={noop}
                    availableGranularities={[]}
                    isEditMode={false}
                    onApplyClick={this.onApply}
                    onCancelClick={noop}
                    onDropdownOpenChanged={noop}
                />
            </div>
        );
    }
}

export default ExtendedDateFilterComponentExample;
