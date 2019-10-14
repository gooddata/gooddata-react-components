// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";
import { DateFilter } from "../../../src/components/filters/DateFilter";
import { defaultDateFilterOptions } from "../../../src/components/filters/DateFilter/constants/config";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 800, padding: "1em 1em" };

storiesOf("Internal/DateFilter/DateFilterCore", module).add("full-featured opened", () => {
    class DateFilterController extends React.Component<{}, {}> {
        public render() {
            return (
                <DateFilter
                    excludeCurrentPeriod={false}
                    selectedFilterOption={defaultDateFilterOptions.allTime}
                    filterOptions={defaultDateFilterOptions}
                    availableGranularities={[
                        "GDC.time.date",
                        "GDC.time.month",
                        "GDC.time.quarter",
                        "GDC.time.year",
                    ]}
                    isEditMode={false}
                    customFilterName="My Date Filter"
                    dateFilterMode="active"
                    onApply={action("applyClick")}
                    onCancel={action("cancelClick")}
                    onOpen={action("onOpen")}
                    onClose={action("onClose")}
                />
            );
        }

        public componentDidMount(): void {
            this.forceOpenDropdown();
        }

        private forceOpenDropdown() {
            (document.getElementsByClassName("s-date-filter-button")[0] as any).click();
        }
    }

    return screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <DateFilterController />
        </div>,
    );
});
