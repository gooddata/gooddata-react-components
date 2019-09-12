// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Separator } from "../../../src/components/filters/ExtendedDateFilter/Separator/Separator";

storiesOf("ExtendedDateFilters/Separator", module).add("renders", () => {
    return (
        <div style={{ padding: "2em 1em" }}>
            <Separator />
        </div>
    );
});
