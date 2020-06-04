// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { ColumnChart, Model } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    totalSalesIdentifier,
    quarterDateIdentifier,
    dateDataSetUri,
    locationStateDisplayFormIdentifier,
} from "../utils/fixtures";

const totalSalesLocalIdentifier = "totalSales";

const attribute = [
    Model.attribute(quarterDateIdentifier),
    Model.attribute(locationStateDisplayFormIdentifier),
];

const filters = [
    Model.absoluteDateFilter(dateDataSetUri, "2017-01-01", "2020-12-31"),
    Model.measureValueFilter(totalSalesLocalIdentifier).condition("LESS_THAN", { value: 800000 }),
    Model.positiveAttributeFilter(locationStateDisplayFormIdentifier, ["Texas"], true),
];

const measures = [
    Model.measure(totalSalesIdentifier)
        .localIdentifier("totalSales")
        .alias("$ Total Sales"),
];

export class MeasureValueFilterAndDateFilterAndAttributeFilter extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onError", ...params);
    }

    render() {
        return (
            <div
                style={{ height: 300 }}
                className="s-measure-value-filter-and-date-filter-and-attribute-filter"
            >
                <ColumnChart
                    projectId={projectId}
                    measures={measures}
                    viewBy={attribute}
                    filters={filters}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default MeasureValueFilterAndDateFilterAndAttributeFilter;
