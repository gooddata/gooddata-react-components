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
    uri: "/gdc/md/storybook/obj/3.df",
    onApply: action("apply"),
};

const attributeFilterWithIdentifier: IAttributeFilterProps = {
    projectId: "storybook",
    identifier: "3.df",
    onApply: action("apply"),
};

const attributeFilterWithUriFilter: IAttributeFilterProps = {
    projectId: "storybook",
    filter: Model.negativeAttributeFilter("/gdc/md/storybook/obj/3.df", []),
    onApply: action("apply"),
};

const attributeFilterWithIdentifierFilter: IAttributeFilterProps = {
    projectId: "storybook",
    filter: Model.positiveAttributeFilter("3.df", []),
    onApply: action("apply"),
};

const attributeFilterWithIdentifierFilterWithSelection: IAttributeFilterProps = {
    projectId: "storybook",
    filter: Model.positiveAttributeFilter("3.df", ["Andorra"], true),
    onApply: action("apply"),
};

storiesOf("Helper components/AttributeFilter", module).add("AttributeFilter definitions", () => (
    <div style={{ minHeight: 500 }}>
        <p>Attribute definition by uri</p>
        <AttributeFilter {...attributeFilterWithUri} />
        <p>Attribute definition by identifier</p>
        <AttributeFilter {...attributeFilterWithIdentifier} />
        <p>Attribute definition by filter with uri, select all</p>
        <AttributeFilter {...attributeFilterWithUriFilter} />
        <p>Attribute definition by filter with identifier, select none</p>
        <AttributeFilter {...attributeFilterWithIdentifierFilter} />
        <p>Attribute definition by filter with identifier, select some items</p>
        <AttributeFilter {...attributeFilterWithIdentifierFilterWithSelection} />
        <p>Attribute filter for mobile</p>
        <AttributeFilter {...attributeFilterWithUri} fullscreenOnMobile={true} />
    </div>
));
