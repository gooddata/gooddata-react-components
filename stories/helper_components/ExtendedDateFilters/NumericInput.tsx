// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { NumericInput } from "../../../src/components/filters/ExtendedDateFilter/NumericInput/NumericInput";

storiesOf("ExtendedDateFilters/NumericInput", module).add("renders", () => {
    class Container extends React.Component {
        public state = {
            value: "" as number | "",
        };

        public render(): React.ReactNode {
            return (
                <React.Fragment>
                    <NumericInput
                        value={this.state.value}
                        onChange={value => this.setState({ value })}
                        min={-5}
                        max={5}
                    />
                    <input
                        type="number"
                        value={this.state.value}
                        onChange={e => this.setState({ value: e.target.value })}
                        min={-5}
                        max={5}
                    />
                </React.Fragment>
            );
        }
    }

    return <Container />;
});
