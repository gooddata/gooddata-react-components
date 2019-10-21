// (C) 2019 GoodData Corporation
import * as React from "react";
import isEmpty = require("lodash/isEmpty");
import cx from "classnames";
import { FormattedMessage } from "react-intl";
import { ExtendedDateFilters } from "@gooddata/typings";

import { ListItem } from "../ListItem/ListItem";
import { IExtendedDateFilterErrors } from "../../../../interfaces/ExtendedDateFilters";
import { ExcludeCurrentPeriodToggle } from "../ExcludeCurrentPeriodToggle/ExcludeCurrentPeriodToggle";
import { VisibleScrollbar } from "../VisibleScrollbar/VisibleScrollbar";
import { getDateFilterOptionGranularity } from "../utils/OptionUtils";
import { AllTimeFilterItem } from "./AllTimeFilterItem";
import { DateFilterFormWrapper } from "../DateFilterFormWrapper/DateFilterFormWrapper";
import { AbsoluteDateFilterForm } from "../AbsoluteDateFilterForm/AbsoluteDateFilterForm";
import { ListItemTooltip } from "../ListItemTooltip/ListItemTooltip";
import { RelativeDateFilterForm } from "../RelativeDateFilterForm/RelativeDateFilterForm";
import { RelativePresetFilterItems } from "./RelativePresetFilterItems";
import { EditModeMessage } from "./EditModeMessage";
import { DateFilterHeader } from "./DateFilterHeader";
import { DateFilterBodyButton } from "./DateFilterBodyButton";
import { AbsolutePresetFilterItems } from "./AbsolutePresetFilterItems";

export interface IDateFilterBodyProps {
    filterOptions: ExtendedDateFilters.IDateFilterOptionsByType;
    selectedFilterOption: ExtendedDateFilters.DateFilterOption;
    onSelectedFilterOptionChange: (option: ExtendedDateFilters.DateFilterOption) => void;

    excludeCurrentPeriod: boolean;
    isExcludeCurrentPeriodEnabled: boolean;
    onExcludeCurrentPeriodChange: (isExcluded: boolean) => void;

    availableGranularities: ExtendedDateFilters.DateFilterGranularity[];

    isEditMode: boolean;
    isMobile: boolean;

    onApplyClick: () => void;
    onCancelClick: () => void;
    closeDropdown: () => void;

    errors?: IExtendedDateFilterErrors;
    dateFilterButton: JSX.Element;
}

export interface IDateFilterBodyState {
    route: "absoluteForm" | "relativeForm" | null;
}

export const isFilterOptionSelected = (
    filterOption: ExtendedDateFilters.IDateFilterOption,
    selectedOption: ExtendedDateFilters.IDateFilterOption,
) => filterOption.localIdentifier === selectedOption.localIdentifier;

const ITEM_CLASS_MOBILE = "gd-date-filter-item-mobile";

export class DateFilterBody extends React.Component<IDateFilterBodyProps, IDateFilterBodyState> {
    public state: IDateFilterBodyState = {
        route: null,
    };

    public changeRoute = (route: IDateFilterBodyState["route"] = null) => {
        this.setState({ route });
    };

    public componentDidMount() {
        // Dropdown component does not expose isOpened prop but it mounts
        // this component every time it is opened and un-mounts when closed
        if (this.props.isMobile) {
            if (this.props.selectedFilterOption.type === "absoluteForm") {
                this.changeRoute("absoluteForm");
            } else if (this.props.selectedFilterOption.type === "relativeForm") {
                this.changeRoute("relativeForm");
            }
        }
    }

    public render(): React.ReactNode {
        const {
            isExcludeCurrentPeriodEnabled,
            isMobile,
            isEditMode,
            onApplyClick,
            onCancelClick,
            closeDropdown,
            selectedFilterOption,
            dateFilterButton,
            errors,
        } = this.props;
        const { route } = this.state;
        return (
            <div
                className={cx(
                    "gd-extended-date-filter-body",
                    "s-extended-date-filters-body",
                    isMobile && "gd-extended-date-filter-body-mobile",
                )}
            >
                {route === null && isMobile && (
                    <div
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => {
                            onCancelClick();
                            closeDropdown();
                        }}
                    >
                        {dateFilterButton}
                    </div>
                )}
                <div
                    className={cx("gd-extended-date-filter-body-wrapper", {
                        "gd-extended-date-filter-body-wrapper-wide":
                            selectedFilterOption.type === "relativeForm",
                    })}
                >
                    {isEditMode && !isMobile && <EditModeMessage />}
                    {isMobile ? (
                        this.renderMobileContent()
                    ) : (
                        <VisibleScrollbar className="gd-extended-date-filter-body-scrollable">
                            {this.renderDefaultContent()}
                        </VisibleScrollbar>
                    )}
                </div>
                {!isMobile || isExcludeCurrentPeriodEnabled ? this.renderExcludeCurrent() : null}
                <div className={cx("gd-extended-date-filter-actions")}>
                    <div className="gd-extended-date-filter-actions-buttons">
                        <DateFilterBodyButton
                            messageId="cancel"
                            className="gd-button-secondary s-date-filter-cancel"
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => {
                                onCancelClick();
                                closeDropdown();
                            }}
                        />
                        <DateFilterBodyButton
                            messageId="apply"
                            className="gd-button-action s-date-filter-apply"
                            disabled={!isEmpty(errors)}
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => {
                                onApplyClick();
                                closeDropdown();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderAllTime = () => {
        const { filterOptions, isMobile, selectedFilterOption, onSelectedFilterOptionChange } = this.props;
        return filterOptions.allTime ? (
            <AllTimeFilterItem
                filterOption={filterOptions.allTime}
                selectedFilterOption={selectedFilterOption}
                onSelectedFilterOptionChange={onSelectedFilterOptionChange}
                className={isMobile && ITEM_CLASS_MOBILE}
            />
        ) : null;
    };

    private renderAbsoluteForm = () => {
        const {
            filterOptions,
            selectedFilterOption,
            onSelectedFilterOptionChange,
            isMobile,
            errors,
        } = this.props;

        if (!filterOptions.absoluteForm) {
            return null;
        }

        const { route } = this.state;
        const isSelected =
            filterOptions.absoluteForm.localIdentifier === selectedFilterOption.localIdentifier;
        const isOnRoute = route === "absoluteForm";
        return (
            <>
                {(!isMobile || !isOnRoute) && (
                    <ListItem
                        isSelected={isSelected}
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => {
                            this.changeRoute("absoluteForm");
                            if (selectedFilterOption.type !== "absoluteForm") {
                                onSelectedFilterOptionChange(filterOptions.absoluteForm);
                            }
                        }}
                        className={cx(
                            "s-absolute-form",
                            "s-do-not-close-dropdown-on-click",
                            isMobile && ITEM_CLASS_MOBILE,
                        )}
                    >
                        <FormattedMessage id="filters.staticPeriod" />
                    </ListItem>
                )}
                {isSelected && (!isMobile || isOnRoute) && (
                    <DateFilterFormWrapper isMobile={isMobile}>
                        <AbsoluteDateFilterForm
                            errors={(errors && errors.absoluteForm) || undefined}
                            onSelectedFilterOptionChange={onSelectedFilterOptionChange}
                            selectedFilterOption={
                                selectedFilterOption as ExtendedDateFilters.IAbsoluteDateFilterForm
                            }
                            isMobile={isMobile}
                        />
                    </DateFilterFormWrapper>
                )}
            </>
        );
    };

    private renderRelativeForm = () => {
        const {
            filterOptions,
            selectedFilterOption,
            onSelectedFilterOptionChange,
            availableGranularities,
            isMobile,
        } = this.props;

        if (!filterOptions.relativeForm) {
            return null;
        }

        const { route } = this.state;
        const isSelected =
            filterOptions.relativeForm.localIdentifier === selectedFilterOption.localIdentifier;
        const isOnRoute = route === "relativeForm";

        return (
            <>
                {(!isMobile || !isOnRoute) && (
                    <ListItem
                        isSelected={isSelected}
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => {
                            this.changeRoute("relativeForm");
                            if (selectedFilterOption.type !== "relativeForm") {
                                onSelectedFilterOptionChange(filterOptions.relativeForm);
                            }
                        }}
                        className={cx(
                            "s-relative-form",
                            "s-do-not-close-dropdown-on-click",
                            isMobile && ITEM_CLASS_MOBILE,
                        )}
                    >
                        <FormattedMessage id="filters.floatingRange" />
                        {!isMobile && (
                            <ListItemTooltip>
                                <FormattedMessage id="filters.floatingRange.tooltip" />
                            </ListItemTooltip>
                        )}
                    </ListItem>
                )}

                {isSelected && (!isMobile || isOnRoute) && (
                    <DateFilterFormWrapper isMobile={isMobile}>
                        <RelativeDateFilterForm
                            // tslint:disable-next-line:jsx-no-lambda
                            onSelectedFilterOptionChange={option => {
                                onSelectedFilterOptionChange(option);
                            }}
                            selectedFilterOption={
                                selectedFilterOption as ExtendedDateFilters.IRelativeDateFilterForm
                            }
                            availableGranularities={availableGranularities}
                            isMobile={isMobile}
                        />
                    </DateFilterFormWrapper>
                )}
            </>
        );
    };

    private renderAbsolutePreset = () => {
        const { filterOptions, selectedFilterOption, onSelectedFilterOptionChange, isMobile } = this.props;
        return filterOptions.absolutePreset && filterOptions.absolutePreset.length > 0 ? (
            <AbsolutePresetFilterItems
                filterOptions={filterOptions.absolutePreset}
                selectedFilterOption={selectedFilterOption}
                onSelectedFilterOptionChange={onSelectedFilterOptionChange}
                className={isMobile && ITEM_CLASS_MOBILE}
            />
        ) : null;
    };

    private renderRelativePreset = () => {
        const { filterOptions, selectedFilterOption, onSelectedFilterOptionChange, isMobile } = this.props;
        return filterOptions.relativePreset ? (
            <RelativePresetFilterItems
                filterOption={filterOptions.relativePreset}
                selectedFilterOption={selectedFilterOption}
                onSelectedFilterOptionChange={onSelectedFilterOptionChange}
                className={isMobile && ITEM_CLASS_MOBILE}
            />
        ) : null;
    };

    private renderExcludeCurrent = () => {
        const {
            selectedFilterOption,
            onExcludeCurrentPeriodChange,
            excludeCurrentPeriod,
            isExcludeCurrentPeriodEnabled,
        } = this.props;
        return (
            <ExcludeCurrentPeriodToggle
                value={excludeCurrentPeriod}
                onChange={onExcludeCurrentPeriodChange}
                disabled={!isExcludeCurrentPeriodEnabled}
                granularity={getDateFilterOptionGranularity(selectedFilterOption)}
            />
        );
    };

    private renderMobileContent() {
        const { route } = this.state;
        if (route === "absoluteForm") {
            return (
                <>
                    <DateFilterHeader changeRoute={this.changeRoute}>
                        <FormattedMessage id="filters.staticPeriod" />
                    </DateFilterHeader>
                    {this.renderAbsoluteForm()}
                </>
            );
        }
        if (route === "relativeForm") {
            return (
                <>
                    <DateFilterHeader changeRoute={this.changeRoute}>
                        <FormattedMessage id="filters.floatingRange" />
                    </DateFilterHeader>
                    {this.renderRelativeForm()}
                </>
            );
        }
        return this.renderDefaultContent();
    }

    private renderDefaultContent() {
        return (
            <>
                {this.renderAllTime()}
                {this.renderAbsoluteForm()}
                {this.renderRelativeForm()}
                {this.renderAbsolutePreset()}
                {this.renderRelativePreset()}
            </>
        );
    }
}
