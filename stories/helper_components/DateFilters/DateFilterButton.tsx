// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { DateFilterButton } from "../../../src/components/filters/DateFilter/DateFilterButton/DateFilterButton";
import "../../../styles/css/dateFilter.css";

storiesOf("Helper components/DateFilter/DateFilterButton", module)
    .add("default state", () => {
        return (
            <DateFilterButton title="Date range" isMobile={false}>
                Last 7 days
            </DateFilterButton>
        );
    })
    .add("opened state", () => {
        return (
            <DateFilterButton title="Date range" isOpen={true} isMobile={false}>
                Last 7 days
            </DateFilterButton>
        );
    });
