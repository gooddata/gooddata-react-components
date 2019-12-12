// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";
import { IntlDecorator } from "../../utils/IntlDecorators";
import {
    DateRangePicker,
    IDateRange,
} from "../../../src/components/filters/DateFilter/DateRangePicker/DateRangePicker";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 200, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/DateRangePicker", module)
    .add("renders", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {IntlDecorator(
                    <DateRangePicker
                        range={{ from: new Date("2019-10-14"), to: new Date("2019-10-14") }}
                        onRangeChange={action("onRangeChange")}
                        isMobile={false}
                    />,
                )}
            </div>,
        ),
    )
    .add("renders with Spanish locale", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {IntlDecorator(
                    <DateRangePicker
                        range={{ from: new Date("2019-10-14"), to: new Date("2019-10-14") }}
                        onRangeChange={action("onRangeChange")}
                        isMobile={false}
                    />,
                )}
            </div>,
        ),
    )
    .add("renders with custom start of week", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {IntlDecorator(
                    <DateRangePicker
                        range={{ from: new Date("2019-10-14"), to: new Date("2019-10-14") }}
                        onRangeChange={action("onRangeChange")}
                        dayPickerProps={{
                            firstDayOfWeek: 3,
                        }}
                        isMobile={false}
                    />,
                )}
            </div>,
        ),
    )
    .add("renders with container", () => {
        const initialState = {
            range: { from: new Date("2019-10-14"), to: new Date("2019-10-14") },
        };

        class Example extends React.Component<{}, typeof initialState> {
            public state = initialState;

            public render(): React.ReactNode {
                return IntlDecorator(
                    <DateRangePicker
                        range={this.state.range}
                        onRangeChange={this.onRangeChange}
                        isMobile={false}
                    />,
                );
            }

            private onRangeChange = (range: IDateRange) => {
                this.setState({ range });
            };
        }

        return screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <Example />
            </div>,
        );
    });
