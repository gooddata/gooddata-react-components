// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import noop = require("lodash/noop");
import { AFM } from "@gooddata/typings";

import { DropdownAfmWrapper } from "../../src/components/filters/MeasureValueFilter/DropdownAfmWrapper";
import "../../styles/scss/main.scss";

storiesOf("Helper components/Measure value filter", module).add("Measure value filter", () => {
    class MeasureValueFilterWithButton extends React.Component {
        public render() {
            const filter = {
                measureValueFilter: {
                    measure: {
                        localIdentifier: "localIdentifier",
                    },
                },
            };
            return (
                <React.Fragment>
                    <DropdownAfmWrapper onApply={this.onApply} onCancel={noop} filter={filter} />
                </React.Fragment>
            );
        }

        private onApply = (filter: AFM.IMeasureValueFilter) => {
            action("apply")(filter);
        };
    }

    return <MeasureValueFilterWithButton />;
});
