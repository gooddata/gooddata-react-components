// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { DateFilterFormWrapper } from "../../../src/components/filters/DateFilter/DateFilterFormWrapper/DateFilterFormWrapper";

storiesOf("Helper components/DateFilter/DateFilterFormWrapper", module).add("renders", () => {
    return <DateFilterFormWrapper isMobile={false}>Content</DateFilterFormWrapper>;
});
