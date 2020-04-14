// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import noop = require("lodash/noop");
import { VisualizationInput } from "@gooddata/typings";
import { screenshotWrap } from "@gooddata/test-storybook";

import * as Model from "../../src/helpers/model";
import { IMeasureValueFilterValue } from "../../src/interfaces/MeasureValueFilter";
import { MeasureValueFilterDropdown, MeasureValueFilter } from "../../src/";
import { DropdownBody } from "../../src/components/filters/MeasureValueFilter/DropdownBody";

import "../../styles/scss/main.scss";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Helper components/Measure value filter", module)
    .add("Measure value filter dropdown", () => {
        const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
            action("apply")(filter);
        };
        const filter = Model.measureValueFilter("myMeasure");

        return <MeasureValueFilterDropdown onApply={onApply} onCancel={noop} filter={filter} />;
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
    .add("Measure value filter dropdown with treat-null-as option enabled", () => {
        const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
            action("apply")(filter);
        };
        const filter = Model.measureValueFilter("myMeasure").condition("GREATER_THAN", { value: 100 });

        return (
            <MeasureValueFilterDropdown
                onApply={onApply}
                onCancel={noop}
                filter={filter}
                displayTreatNullAsZeroOption={true}
            />
        );
    })
    .add("Measure value filter", () => {
        const onApply = (filter: VisualizationInput.IMeasureValueFilter) => {
            action("apply")(filter);
        };
        const onCancel = () => {
            action("cancel")();
        };
        const filter = Model.measureValueFilter("myMeasure").condition("GREATER_THAN", { value: 100 });

        return (
            <div style={{ height: 500 }}>
                <MeasureValueFilter
                    buttonTitle={"My measure"}
                    onApply={onApply}
                    onCancel={onCancel}
                    filter={filter}
                />
            </div>
        );
    });
