// (C) 2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { injectIntl } from "react-intl";
import { DynamicSelect } from "../../../src/components/filters/DateFilter/DynamicSelect/DynamicSelect";
import { getRelativeDateFilterItems } from "../../../src/components/filters/DateFilter/DynamicSelect/utils";
import { IntlDecorator } from "../../utils/IntlDecorators";

const DynamicSelectWithIntl = injectIntl(({ intl, ...otherProps }) => (
    <DynamicSelect
        // tslint:disable-next-line:jsx-no-lambda
        getItems={(inputValue: string) => getRelativeDateFilterItems(inputValue, "GDC.time.date", intl)}
        onChange={action("onChange")}
        {...otherProps}
    />
));

const DynamicSelectWrapper = (props: any) => IntlDecorator(<DynamicSelectWithIntl {...props} />);

storiesOf("Helper components/DateFilter/DynamicSelect", module)
    .add("empty", () => {
        return <DynamicSelectWrapper />;
    })
    .add("initial value", () => {
        return <DynamicSelectWrapper value={-1} />;
    })
    .add("initial open", () => {
        return <DynamicSelectWrapper initialIsOpen={true} />;
    })
    .add("initial open with value", () => {
        return <DynamicSelectWrapper value={33} initialIsOpen={true} />;
    });
