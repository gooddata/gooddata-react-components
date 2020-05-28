// (C) 2007-2020 GoodData Corporation

import React, { Component } from "react";
import { ComboChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    totalSalesIdentifier,
    quarterDateIdentifier,
    yearDateDataSetAttributeIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    projectId,
} from "../utils/fixtures";

const columnMeasures = [
    Model.popMeasure("totalSales", yearDateDataSetAttributeIdentifier).alias("$ Total Sales - SP year ago"),
    Model.measure(totalSalesIdentifier)
        .localIdentifier("totalSales")
        .alias("$ Total Sales"),
];

const lineMeasures = [
    Model.measure(franchiseFeesAdRoyaltyIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFeesAdRoyaltyIdentifier"),
];

const attribute = Model.attribute(quarterDateIdentifier);

export class SamePeriodComboChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodComboChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodComboChartExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 300 }} className="s-combo-chart">
                <ComboChart
                    projectId={projectId}
                    primaryMeasures={columnMeasures}
                    secondaryMeasures={lineMeasures}
                    viewBy={attribute}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default SamePeriodComboChartExample;
