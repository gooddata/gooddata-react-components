// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { ListItem } from "../../../src/components/filters/DateFilter/ListItem/ListItem";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, minHeight: 40, padding: "1em 1em" };

storiesOf("Internal/DateFilter/ListItem", module).add("renders", () =>
    screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <ListItem>Sample List Item</ListItem>
            <ListItem isSelected={true}>Sample List Item selected</ListItem>
        </div>,
    ),
);
