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
import * as Model from "../../src/helpers/model";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Helper components/Measure value filter", module)
    .add("Measure value filter", () => {
        const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
            action("apply")(filter);
        };
        const filter = Model.measureValueFilter("myMeasure");

        return <DropdownAfmWrapper onApply={onApply} onCancel={noop} filter={filter} />;
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
    })
    .add("Measure value filter with treat-null-as option enabled", () => {
        const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
            action("apply")(filter);
        };
        const filter = Model.measureValueFilter("myMeasure").condition("GREATER_THAN", { value: 100 });

        return (
            <DropdownAfmWrapper
                onApply={onApply}
                onCancel={noop}
                filter={filter}
                displayTreatNullAsZeroOption={true}
            />
        );
    });
