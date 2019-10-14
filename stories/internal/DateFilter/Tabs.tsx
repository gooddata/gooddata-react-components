// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { TabsWrapper, Tab } from "../../../src/components/filters/DateFilter/Tabs/Tabs";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/Tabs", module).add("renders", () =>
    screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <TabsWrapper>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab selected={true}>Tab 3 selected</Tab>
            </TabsWrapper>
        </div>,
    ),
);
