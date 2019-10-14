// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { DateFilterFormWrapper } from "../../../src/components/filters/DateFilter/DateFilterFormWrapper/DateFilterFormWrapper";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/DateFilterFormWrapper", module).add("renders", () =>
    screenshotWrap(
        <div style={wrapperStyle}>
            <DateFilterFormWrapper isMobile={false} className="screenshot-target">
                Content
            </DateFilterFormWrapper>
        </div>,
    ),
);
