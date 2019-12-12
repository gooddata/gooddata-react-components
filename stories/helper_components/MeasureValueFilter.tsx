// (C) 2007-2019 GoodData Corporation
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
            return (
                <React.Fragment>
                    <DropdownAfmWrapper
                        measureIdentifier="localIdentifier"
                        onApply={this.onApply}
                        onCancel={noop}
                    />
                </React.Fragment>
            );
        }

        private onApply = (filter: AFM.IMeasureValueFilter) => {
            action("apply")(filter);
        };
    }

    return <MeasureValueFilterWithButton />;
});
