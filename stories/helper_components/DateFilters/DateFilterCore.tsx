// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ExtendedDateFilters } from "@gooddata/typings";
import { IntlDecorator } from "../../utils/IntlDecorators";
import { DateFilterCore } from "../../../src/components/filters/DateFilter/DateFilterCore";
import { defaultDateFilterOptions } from "../../../src/components/filters/DateFilter/constants/config";

storiesOf("Helper components/DateFilter/DateFilterCore", module).add("renders", () => {
    interface IExtendedDateFilterState {
        selectedFilterOption: ExtendedDateFilters.DateFilterOption;
        excludeCurrentPeriod: boolean;
    }

    class DateFilterController extends React.Component<{}, IExtendedDateFilterState> {
        constructor(props: {}) {
            super(props);

            this.state = {
                selectedFilterOption: defaultDateFilterOptions.allTime,
                excludeCurrentPeriod: false,
            };
        }

        public render() {
            return (
                <DateFilterCore
                    availableGranularities={[
                        "GDC.time.date",
                        "GDC.time.month",
                        "GDC.time.quarter",
                        "GDC.time.year",
                    ]}
                    filterOptions={defaultDateFilterOptions}
                    selectedFilterOption={this.state.selectedFilterOption}
                    originalSelectedFilterOption={this.state.selectedFilterOption} // just to show the value immediately
                    onSelectedFilterOptionChange={this.setSelectedFilterOption}
                    originalExcludeCurrentPeriod={this.state.excludeCurrentPeriod} // just to show the value immediately
                    excludeCurrentPeriod={this.state.excludeCurrentPeriod}
                    isEditMode={false}
                    isExcludeCurrentPeriodEnabled={true}
                    onExcludeCurrentPeriodChange={this.setExcludeCurrentPeriod}
                    onApplyClick={action("applyClick")}
                    onCancelClick={action("cancelClick")}
                    onDropdownOpenChanged={action("dropdownOpenChanged")}
                />
            );
        }

        private setSelectedFilterOption = (newFilter: ExtendedDateFilters.DateFilterOption) => {
            this.setState({
                selectedFilterOption: newFilter,
            });
        };

        private setExcludeCurrentPeriod = (isExcluded: boolean) => {
            this.setState({
                excludeCurrentPeriod: isExcluded,
            });
        };
    }

    return IntlDecorator(<DateFilterController />);
});
