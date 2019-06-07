// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import * as Model from "../../src/helpers/model";

import {
    AttributeFilter,
    IAttributeFilterProps,
} from "../../src/components/filters/AttributeFilter/AttributeFilter";
import "../../styles/scss/attributeFilter.scss";

const attributeFilterWithUri: IAttributeFilterProps = {
    projectId: "storybook",
    filter: Model.negativeAttributeFilter("/gdc/md/storybook/obj/3.df", []),
    onApply: action("apply"),
};

const attributeFilterWithIdentifier: IAttributeFilterProps = {
    projectId: "storybook",
    filter: Model.negativeAttributeFilter("3.df", []),
    fullscreenOnMobile: false,
    onApply: action("apply"),
};

storiesOf("Helper components/AttributeFilter", module).add("with uri", () => (
    <div style={{ minHeight: 500 }}>
        <AttributeFilter {...attributeFilterWithUri} />
        <span style={{ display: "inline-block", width: 208 }} />
        <AttributeFilter {...attributeFilterWithIdentifier} />
    </div>
));
