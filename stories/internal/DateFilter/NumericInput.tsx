// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { NumericInput } from "../../../src/components/filters/DateFilter/NumericInput/NumericInput";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/NumericInput", module).add("renders", () => {
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

    return screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <Container />
        </div>,
    );
});
