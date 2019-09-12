// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { TabsWrapper, Tab } from "../../../src/components/filters/ExtendedDateFilter/Tabs/Tabs";

storiesOf("ExtendedDateFilters/Tabs", module).add("renders", () => {
    return (
        <div style={{ padding: "1em 2em" }}>
            <TabsWrapper>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab selected={true}>Tab 3 selected</Tab>
            </TabsWrapper>
        </div>
    );
});
