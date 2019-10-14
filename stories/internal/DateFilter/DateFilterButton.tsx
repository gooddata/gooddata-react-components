// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { DateFilterButton } from "../../../src/components/filters/DateFilter/DateFilterButton/DateFilterButton";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/DateFilterButton", module)
    .add("default state", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DateFilterButton title="Date range" isMobile={false}>
                    Last 7 days
                </DateFilterButton>
            </div>,
        ),
    )
    .add("opened state", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DateFilterButton title="Date range" isOpen={true} isMobile={false}>
                    Last 7 days
                </DateFilterButton>
            </div>,
        ),
    );
