// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import { ExtendedDateFilters } from "@gooddata/typings";
import { canExcludeCurrentPeriod } from "./utils/PeriodExlusion";

import { DateFilterCore } from "./DateFilterCore";
import { validateFilterOption } from "./validation/OptionValidation";

const normalizeSelectedFilterOption = (
    selectedFilterOption: ExtendedDateFilters.DateFilterOption,
): ExtendedDateFilters.DateFilterOption => {
    if (selectedFilterOption.type === "relativeForm" && selectedFilterOption.from > selectedFilterOption.to) {
        return {
            ...selectedFilterOption,
            from: selectedFilterOption.to,
            to: selectedFilterOption.from,
        };
    }
    return selectedFilterOption;
};

interface IStatePropsIntersection {
    excludeCurrentPeriod: boolean;
    isExcludeCurrentPeriodEnabled: boolean;
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
}

export interface IDateFilterStateProps extends IStatePropsIntersection {
    filterOptions: ExtendedDateFilters.IDateFilterOptionsByType;
    availableGranularities: ExtendedDateFilters.DateFilterGranularity[];
    isEditMode?: boolean;
    customFilterName?: string;
    dateFilterMode: ExtendedDateFilters.DashboardDateFilterConfigMode;
}

export interface IDateFilterCallbackProps {
    onApply: (dateFilterOption: ExtendedDateFilters.DateFilterOption, excludeCurrentPeriod: boolean) => void;
    onCancel?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
}

export interface IDateFilterProps extends IDateFilterStateProps, IDateFilterCallbackProps {}

// tslint:disable-next-line: no-empty-interface
interface IDateFilterState extends IStatePropsIntersection {
    initExcludeCurrentPeriod: boolean;
    initSelectedFilterOption: ExtendedDateFilters.DateFilterOption;
}

export class DateFilter extends React.PureComponent<IDateFilterProps, IDateFilterState> {
    public static propTypes = {
        excludeCurrentPeriod: PropTypes.bool.isRequired,
        isExcludeCurrentPeriodEnabled: PropTypes.bool.isRequired,
        selectedFilterOption: PropTypes.object.isRequired,
        filterOptions: PropTypes.object.isRequired,
        availableGranularities: PropTypes.arrayOf(PropTypes.string).isRequired,
        isEditMode: PropTypes.bool,
        customFilterName: PropTypes.string,
        dateFilterMode: PropTypes.oneOf(["readonly", "hidden", "active"]).isRequired,
        onApply: PropTypes.func.isRequired,
        onCancel: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
    };

    public static defaultProps: Partial<IDateFilterProps> = {
        isEditMode: false,
        onCancel: noop,
        onOpen: noop,
        onClose: noop,
    };

    public static getDerivedStateFromProps(
        nextProps: IDateFilterProps,
        prevState: IDateFilterState,
    ): IDateFilterState {
        if (
            !prevState ||
            !isEqual(nextProps.selectedFilterOption, prevState.initSelectedFilterOption) ||
            nextProps.excludeCurrentPeriod !== prevState.initExcludeCurrentPeriod
        ) {
            const canExcludeCurrent = canExcludeCurrentPeriod(nextProps.selectedFilterOption);
            return {
                initSelectedFilterOption: nextProps.selectedFilterOption,
                selectedFilterOption: nextProps.selectedFilterOption,
                initExcludeCurrentPeriod: nextProps.excludeCurrentPeriod,
                excludeCurrentPeriod: canExcludeCurrent ? nextProps.excludeCurrentPeriod : false,
                isExcludeCurrentPeriodEnabled: canExcludeCurrent,
            };
        }

        return null;
    }

    private static getStateFromSelectedOption = (
        selectedFilterOption: ExtendedDateFilters.DateFilterOption,
        excludeCurrentPeriod: boolean,
    ) => {
        const canExcludeCurrent = canExcludeCurrentPeriod(selectedFilterOption);
        return {
            selectedFilterOption,
            excludeCurrentPeriod: canExcludeCurrent ? excludeCurrentPeriod : false,
            isExcludeCurrentPeriodEnabled: canExcludeCurrent,
        };
    };

    constructor(props: IDateFilterProps) {
        super(props);
        this.state = DateFilter.getDerivedStateFromProps(props, null);
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
            <DateFilterCore
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
                onCancelClick={this.onCancelClicked}
                onDropdownOpenChanged={this.onDropdownOpenChanged}
                onExcludeCurrentPeriodChange={this.handleExcludeCurrentPeriodChange}
                onSelectedFilterOptionChange={this.handleSelectedFilterOptionChange}
                errors={validateFilterOption(selectedFilterOption)}
            />
        );
    }

    private handleApplyClick = () => {
        const normalizedSelectedFilterOption = normalizeSelectedFilterOption(this.state.selectedFilterOption);
        this.props.onApply(normalizedSelectedFilterOption, this.state.excludeCurrentPeriod);
    };

    private onChangesDiscarded = () => {
        this.setState(() => DateFilter.getDerivedStateFromProps(this.props, null));
    };

    private onCancelClicked = () => {
        this.props.onCancel();
        this.onChangesDiscarded();
    };

    private onDropdownOpenChanged = (isOpen: boolean) => {
        if (isOpen) {
            this.props.onOpen();
        } else {
            this.props.onClose();
            this.onChangesDiscarded();
        }
    };

    private handleExcludeCurrentPeriodChange = (excludeCurrentPeriod: boolean) => {
        this.setState({ excludeCurrentPeriod });
    };

    private handleSelectedFilterOptionChange = (
        selectedFilterOption: ExtendedDateFilters.DateFilterOption,
    ) => {
        this.setState(state =>
            DateFilter.getStateFromSelectedOption(selectedFilterOption, state.excludeCurrentPeriod),
        );
    };
}

export const testAPI = {
    normalizeSelectedFilterOption,
};
