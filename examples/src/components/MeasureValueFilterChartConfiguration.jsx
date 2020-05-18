// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { ColumnChart, Model } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/main.css";

import {
    totalSalesIdentifier,
    totalCostsIdentifier,
    locationStateDisplayFormIdentifier,
    projectId,
} from "../utils/fixtures";

const totalCostsLocalIdentifier = "totalCosts";
const totalSalesLocalIdentifier = "totalSales";

const totalCosts = Model.measure(totalCostsIdentifier)
    .format("#,##0")
    .alias("$ Total Costs")
    .localIdentifier(totalCostsLocalIdentifier);

const totalSales = Model.measure(totalSalesIdentifier)
    .format("#,##0")
    .alias("$ Total Sales");

const localState = Model.attribute(locationStateDisplayFormIdentifier);

const filters = [
    Model.measureValueFilter(totalCostsLocalIdentifier).condition("LESS_THAN", { value: -13000000 }),
];

const config = {
    colors: ["rgb(195, 49, 73)", "rgb(168, 194, 86)"], // array of strings
    secondary_yaxis: {
        visible: true,
        labelsEnabled: true,
        rotation: "auto",
        min: "-75000000",
        max: "75000000",
        measures: [totalCostsLocalIdentifier],
    },
    yaxis: {
        visible: true,
        labelsEnabled: true,
        rotation: "auto",
        min: "-75000000",
        max: "75000000",
        measures: [totalSalesLocalIdentifier],
    },
    legend: {
        enabled: true, // boolean
        position: "left", // 'top' | 'left' | 'right' | 'bottom'
    },
    dataLabels: {
        visible: "true", // 'auto' | true | false
    },
    grid: {
        enabled: true, // boolean
    },
    separators: {
        thousand: ",",
        decimal: ".",
    },
};

export class MeasureValueFilterChartConfiguration extends Component {
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
            <div style={{ height: 300 }} className="s-measure-value-filter-chart-configuration">
                <ColumnChart
                    projectId={projectId}
                    measures={[totalCosts, totalSales]}
                    viewBy={localState}
                    filters={filters}
                    onLoadingChanged={this.onLoadingChanged}
                    config={config}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default MeasureValueFilterChartConfiguration;
