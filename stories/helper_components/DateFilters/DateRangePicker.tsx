// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { IntlDecorator } from "../../utils/IntlDecorators";
import {
    DateRangePicker,
    IDateRange,
} from "../../../src/components/filters/DateFilter/DateRangePicker/DateRangePicker";

storiesOf("Helper components/DateFilter/DateRangePicker", module)
    .add("renders", () =>
        IntlDecorator(
            <DateRangePicker
                range={{ from: new Date(), to: new Date() }}
                onRangeChange={action("onRangeChange")}
                isMobile={false}
            />,
        ),
    )
    .add("renders with Spanish locale", () =>
        IntlDecorator(
            <DateRangePicker
                range={{ from: new Date(), to: new Date() }}
                onRangeChange={action("onRangeChange")}
                isMobile={false}
            />,
        ),
    )
    .add("renders with custom start of week", () =>
        IntlDecorator(
            <DateRangePicker
                range={{ from: new Date(), to: new Date() }}
                onRangeChange={action("onRangeChange")}
                dayPickerProps={{
                    firstDayOfWeek: 3,
                }}
                isMobile={false}
            />,
        ),
    )
    .add("renders with container", () => {
        const initialState = {
            range: { from: new Date(), to: new Date() },
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

        return <Example />;
    });
