// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ListHeading } from "../../../src/components/filters/DateFilter/ListHeading/ListHeading";

storiesOf("Helper components/DateFilter/ListHeading", module).add("renders", () => {
    return (
        <div style={{ padding: "2em 1em" }}>
            <ListHeading>Sample heading</ListHeading>
        </div>
    );
});
