// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { ListHeading } from "../../../src/components/filters/DateFilter/ListHeading/ListHeading";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 40, padding: "1em 1em" };

storiesOf("Internal/DateFilter/ListHeading", module).add("renders", () =>
    screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <ListHeading>Sample heading</ListHeading>
        </div>,
    ),
);
