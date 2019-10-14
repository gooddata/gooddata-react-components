// (C) 2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";
import { injectIntl } from "react-intl";
import { DynamicSelect } from "../../../src/components/filters/DateFilter/DynamicSelect/DynamicSelect";
import { getRelativeDateFilterItems } from "../../../src/components/filters/DateFilter/DynamicSelect/utils";
import { IntlDecorator } from "../../utils/IntlDecorators";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 800, height: 400, padding: "1em 1em" };

const DynamicSelectWithIntl = injectIntl(({ intl, ...otherProps }) => (
    <DynamicSelect
        // tslint:disable-next-line:jsx-no-lambda
        getItems={(inputValue: string) => getRelativeDateFilterItems(inputValue, "GDC.time.date", intl)}
        onChange={action("onChange")}
        {...otherProps}
    />
));

const DynamicSelectWrapper = (props: any) => IntlDecorator(<DynamicSelectWithIntl {...props} />);

storiesOf("Internal/DateFilter/DynamicSelect", module)
    .add("empty", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DynamicSelectWrapper />
            </div>,
        ),
    )
    .add("initial value", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DynamicSelectWrapper value={-1} />
            </div>,
        ),
    )
    .add("initial open", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DynamicSelectWrapper initialIsOpen={true} />
            </div>,
        ),
    )
    .add("initial open with value", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <DynamicSelectWrapper value={33} initialIsOpen={true} />
            </div>,
        ),
    );
