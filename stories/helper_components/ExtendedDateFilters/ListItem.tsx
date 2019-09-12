// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ListItem } from "../../../src/components/filters/ExtendedDateFilter/ListItem/ListItem";

storiesOf("ExtendedDateFilters/ListItem", module).add("renders", () => {
    return (
        <div style={{ padding: "2em 1em" }}>
            <ListItem>Sample List Item</ListItem>
            <ListItem isSelected={true}>Sample List Item selected</ListItem>
        </div>
    );
});
