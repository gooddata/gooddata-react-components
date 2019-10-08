// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import moment = require("moment");
import noop = require("lodash/noop");
import { IDateFilterProps, DateFilter } from "../DateFilter";
import { IntlWrapper } from "../../../core/base/IntlWrapper";
import { ExtendedDateFilters } from "@gooddata/typings";

const platformDateFormat = "YYYY-MM-DD";

export const defaultDateFilterOptions: ExtendedDateFilters.IDateFilterOptionsByType = {
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

const availableGranularities: ExtendedDateFilters.DateFilterGranularity[] = [
    "GDC.time.month",
    "GDC.time.year",
    "GDC.time.quarter",
    "GDC.time.date",
];

const defaultProps: IDateFilterProps = {
    excludeCurrentPeriod: false,
    isExcludeCurrentPeriodEnabled: true,
    selectedFilterOption: defaultDateFilterOptions.allTime,
    filterOptions: defaultDateFilterOptions,
    availableGranularities,
    isEditMode: false,
    customFilterName: "Filter name",
    dateFilterMode: "active",
    onApply: noop,
    onCancel: noop,
    onOpen: noop,
    onClose: noop,
};

const dateFilterButton = ".s-date-filter-button";
const applyButton = "button.s-date-filter-apply";

export const createDateFilter = (customProps: Partial<IDateFilterProps> = {}) => {
    const props: IDateFilterProps = { ...defaultProps, ...customProps };

    return mount(
        <IntlWrapper locale="en-US">
            <DateFilter {...props} />
        </IntlWrapper>,
    );
};

export type WrapperType = ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

export const clickDateFilterButton = (wrapper: WrapperType) => {
    wrapper.find(dateFilterButton).simulate("click");
};

export const clickApplyButton = (wrapper: WrapperType) => {
    wrapper.find(applyButton).simulate("click");
};

// static filters

export const getLocalIdentifierFromItem = (item: string) => {
    return item.toUpperCase().replace(new RegExp("-", "g"), "_");
};

export const getRelativePresetByLocalIdentifier = (localIdentifier: string, relativePreset: any[]) => {
    return relativePreset.find(x => {
        return x.localIdentifier === localIdentifier.toUpperCase();
    });
};

export const getStaticFilterSelectorClass = (filter: string) => {
    return `.gd-filter-list-item.s-relative-preset-${filter}`;
};

export const clickStaticFilter = (wrapper: WrapperType, filter: string) => {
    const filterSelector = getStaticFilterSelectorClass(filter);
    wrapper.find(filterSelector).simulate("click");
};
