// (C) 2007-2020 GoodData Corporation

import React, { Component } from "react";
import { Headline, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { totalSalesIdentifier, yearDateDataSetAttributeIdentifier, projectId } from "../utils/fixtures";

const primaryMeasure = Model.measure(totalSalesIdentifier)
    .localIdentifier("totalSales")
    .alias("$ Total Sales");

const secondaryMeasure = Model.popMeasure("totalSales", yearDateDataSetAttributeIdentifier).alias(
    "$ Total Sales - SP year ago",
);

export class SamePeriodHeadLineExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodHeadLineExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodHeadLineExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 125 }} className="s-headline">
                <Headline
                    projectId={projectId}
                    primaryMeasure={primaryMeasure}
                    secondaryMeasure={secondaryMeasure}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default SamePeriodHeadLineExample;
