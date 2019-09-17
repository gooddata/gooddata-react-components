// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { NumericInput } from "../../../src/components/filters/ExtendedDateFilter/NumericInput/NumericInput";

storiesOf("ExtendedDateFilters/NumericInput", module).add("renders", () => {
    class Container extends React.Component {
        public state = {
            value: "" as number | "",
        };

        public setValue = (value: number | string) => this.setState({ value });
        public setValueByEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
            this.setState({ value: e.target.value });

        public render(): React.ReactNode {
            return (
                <React.Fragment>
                    <NumericInput value={this.state.value} onChange={this.setValue} min={-5} max={5} />
                    <input
                        type="number"
                        value={this.state.value}
                        onChange={this.setValueByEvent}
                        min={-5}
                        max={5}
                    />
                </React.Fragment>
            );
        }
    }

    return <Container />;
});
