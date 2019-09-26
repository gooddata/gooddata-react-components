// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import isEqual = require("lodash/isEqual");
import { ExtendedDateFilters } from "@gooddata/typings";
import { canExcludeCurrentPeriod, normalizeSelectedFilterOption } from "../../../helpers/ExtendedDateFilter";

import { ExtendedDateFilter } from "./ExtendedDateFilter";
import { validateFilterOption } from "./validation/DateFilterOptionValidation";

interface IStatePropsIntersection {
    excludeCurrentPeriod: boolean;
    isExcludeCurrentPeriodEnabled: boolean;
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
}

export interface IDateFilterStateProps extends IStatePropsIntersection {
    filterOptions: ExtendedDateFilters.IDateFilterOptionsByType;
    availableGranularities: ExtendedDateFilters.DateFilterGranularity[];
    isEditMode: boolean;
    customFilterName?: string;
    dateFilterMode: ExtendedDateFilters.DashboardDateFilterConfigMode;
}

export interface IDateFilterCallbackProps {
    dateFilterApplied: (
        dateFilterOption: ExtendedDateFilters.DateFilterOption,
        excludeCurrentPeriod: boolean,
    ) => void;
    dateFilterOpened: () => void;
    dateFilterClosed: () => void;
}

interface IExtendedDateFilterControllerProps extends IDateFilterStateProps, IDateFilterCallbackProps {}

// tslint:disable-next-line: no-empty-interface
interface IExtendedDateFilterControllerState extends IStatePropsIntersection {}

export class ExtendedDateFilterControllerComponent extends React.Component<
    IExtendedDateFilterControllerProps,
    IExtendedDateFilterControllerState
> {
    constructor(props: IExtendedDateFilterControllerProps) {
        super(props);

        this.state = {
            excludeCurrentPeriod: props.excludeCurrentPeriod,
            isExcludeCurrentPeriodEnabled: props.isExcludeCurrentPeriodEnabled,
            selectedFilterOption: props.selectedFilterOption,
        };
    }

    public componentDidUpdate(prevProps: IExtendedDateFilterControllerProps): void {
        this.syncStateProp(prevProps, "excludeCurrentPeriod");
        this.syncStateProp(prevProps, "isExcludeCurrentPeriodEnabled");
        this.syncStateProp(prevProps, "selectedFilterOption");
    }

    public render(): React.ReactNode {
        const {
            customFilterName,
            dateFilterMode,
            filterOptions,
            selectedFilterOption: originalSelectedFilterOption,
            excludeCurrentPeriod: originalExcludeCurrentPeriod,
            availableGranularities,
            isEditMode,
        } = this.props;
        const { excludeCurrentPeriod, selectedFilterOption, isExcludeCurrentPeriodEnabled } = this.state;
        return dateFilterMode === "hidden" ? null : (
            <ExtendedDateFilter
                availableGranularities={availableGranularities}
                customFilterName={customFilterName}
                disabled={dateFilterMode === "readonly"}
                excludeCurrentPeriod={excludeCurrentPeriod}
                originalExcludeCurrentPeriod={originalExcludeCurrentPeriod}
                isExcludeCurrentPeriodEnabled={isExcludeCurrentPeriodEnabled}
                isEditMode={isEditMode}
                filterOptions={filterOptions}
                selectedFilterOption={selectedFilterOption}
                originalSelectedFilterOption={originalSelectedFilterOption}
                onApplyClick={this.handleApplyClick}
                onCancelClick={this.onChangesDiscarded}
                onDropdownOpenChanged={this.onDropdownOpenChanged}
                onExcludeCurrentPeriodChange={this.handleExcludeCurrentPeriodChange}
                onSelectedFilterOptionChange={this.handleSelectedFilterOptionChange}
                errors={validateFilterOption(selectedFilterOption)}
            />
        );
    }

    private syncStateProp = (
        prevProps: IExtendedDateFilterControllerProps,
        propName: keyof IStatePropsIntersection,
    ): void => {
        if (!isEqual(prevProps[propName], this.props[propName])) {
            this.copyStatePropFromProps(propName);
        }
    };

    private copyStatePropFromProps = (propName: keyof IStatePropsIntersection): void => {
        this.setState({ [propName]: this.props[propName] } as any);
    };

    private handleApplyClick = () => {
        const normalizedSelectedFilterOption = normalizeSelectedFilterOption(this.state.selectedFilterOption);
        this.props.dateFilterApplied(normalizedSelectedFilterOption, this.state.excludeCurrentPeriod);
    };

    private onChangesDiscarded = () => {
        this.copyStatePropFromProps("excludeCurrentPeriod");
        this.copyStatePropFromProps("isExcludeCurrentPeriodEnabled");
        this.copyStatePropFromProps("selectedFilterOption");
    };

    private onDropdownOpenChanged = (isOpen: boolean) => {
        if (isOpen) {
            this.props.dateFilterOpened();
        } else {
            this.props.dateFilterClosed();
            this.onChangesDiscarded();
        }
    };

    private handleExcludeCurrentPeriodChange = (excludeCurrentPeriod: boolean) => {
        this.setState({ excludeCurrentPeriod });
    };

    private handleSelectedFilterOptionChange = (
        selectedFilterOption: ExtendedDateFilters.DateFilterOption,
    ) => {
        const canExcludeCurrent = canExcludeCurrentPeriod(selectedFilterOption);
        this.setState(state => ({
            selectedFilterOption,
            excludeCurrentPeriod: canExcludeCurrent ? state.excludeCurrentPeriod : false, // explicitly clear exclude when it is disabled
            isExcludeCurrentPeriodEnabled: canExcludeCurrent,
        }));
    };
}
