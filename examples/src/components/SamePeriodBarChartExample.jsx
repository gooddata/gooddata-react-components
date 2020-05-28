// (C) 2007-2020 GoodData Corporation

import React, { Component } from "react";
import { BarChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    totalSalesIdentifier,
    quarterDateIdentifier,
    yearDateDataSetAttributeIdentifier,
    projectId,
} from "../utils/fixtures";

const measures = [
    Model.popMeasure("totalSales", yearDateDataSetAttributeIdentifier).alias("$ Total Sales - SP year ago"),
    Model.measure(totalSalesIdentifier)
        .localIdentifier("totalSales")
        .alias("$ Total Sales"),
];
const attribute = Model.attribute(quarterDateIdentifier);

export class SamePeriodBarChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodBarChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodBarChartExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 300 }} className="s-bar-chart">
                <BarChart
                    projectId={projectId}
                    measures={measures}
                    viewBy={attribute}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default SamePeriodBarChartExample;
