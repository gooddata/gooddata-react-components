// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import noop = require("lodash/noop");
import { VisualizationInput } from "@gooddata/typings";

import { DropdownAfmWrapper } from "../../src/components/filters/MeasureValueFilter/DropdownAfmWrapper";
import "../../styles/scss/main.scss";
import { screenshotWrap } from "@gooddata/test-storybook";
import { DropdownBody } from "../../src/components/filters/MeasureValueFilter/DropdownBody";
import { IMeasureValueFilterValue } from "../../src/interfaces/MeasureValueFilter";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

export interface IDropdownProps {
    filter?: VisualizationInput.IMeasureValueFilter;
    usePercentage?: boolean;
    warningMessage?: string;
}

const MeasureValueFilterWithButton = (props: IDropdownProps) => {
    const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
        action("apply")(filter);
    };

    return (
        <DropdownAfmWrapper
            onApply={onApply}
            onCancel={noop}
            filter={props.filter}
            usePercentage={props.usePercentage}
            warningMessage={props.warningMessage}
        />
    );
};

storiesOf("Helper components/Measure value filter", module)
    .add("Measure value filter", () => {
        return <MeasureValueFilterWithButton />;
    })
    .add("Measure value filter for measure formatted in percent", () => {
        const value: IMeasureValueFilterValue = {
            from: 2,
            to: 5,
        };

        return screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DropdownBody
                    operator="BETWEEN"
                    value={value}
                    usePercentage={true}
                    onApply={noop}
                    disableAutofocus={true}
                />
            </div>,
        );
    })
    .add("Measure value filter dropdown with warning message", () => {
        const value: IMeasureValueFilterValue = {
            value: 40000,
        };

        return screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DropdownBody
                    operator="GREATER_THAN"
                    value={value}
                    warningMessage="The filter uses actual measure values, not percentage."
                    onApply={noop}
                />
            </div>,
        );
    });
