// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { Xirr, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId, totalSalesIdentifier } from "../utils/fixtures";

export class XirrExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info("XirrExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info("XirrExample onLoadingChanged", ...params);
    }

    render() {
        return (
            <div style={{ height: 300 }} className="s-xirr">
                <Xirr
                    measure={Model.measure(totalSalesIdentifier).localIdentifier(totalSalesIdentifier)}
                    attribute={Model.attribute("date.date.mmddyyyy").localIdentifier("date")}
                    projectId={projectId}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default XirrExample;
