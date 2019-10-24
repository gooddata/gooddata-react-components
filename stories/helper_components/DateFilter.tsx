// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";
import { DateFilter } from "../../src/components/filters/DateFilter/DateFilter";
import { defaultDateFilterOptions } from "../../src/components/filters/DateFilter/constants/config";

import "../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 800, padding: "1em 1em" };

storiesOf("Helper components/DateFilter", module).add("full-featured", () => {
    return screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
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
                dateFilterMode="active"
                onApply={action("applyClick")}
                onCancel={action("cancelClick")}
                onOpen={action("onOpen")}
                onClose={action("onClose")}
            />
        </div>,
    );
});
