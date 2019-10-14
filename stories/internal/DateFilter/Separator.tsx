// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Separator } from "../../../src/components/filters/DateFilter/Separator/Separator";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/Separator", module).add("renders", () =>
    screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <Separator />
        </div>,
    ),
);
