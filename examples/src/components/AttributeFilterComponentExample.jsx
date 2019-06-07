// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { AttributeFilter, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { employeeNameIdentifier, projectId } from "../utils/fixtures";

export class AttributeFilterComponentExample extends Component {
    onApply(...params) {
        // eslint-disable-next-line no-console
        console.log("AttributeFilterComponentExample onApply", ...params);
    }

    render() {
        return (
            <div>
                <AttributeFilter
                    projectId={projectId}
                    filter={Model.negativeAttributeFilter(employeeNameIdentifier, [])}
                    fullscreenOnMobile={false}
                    onApply={this.onApply}
                />
            </div>
        );
    }
}

export default AttributeFilterComponentExample;
