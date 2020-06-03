// (C) 2007-2020 GoodData Corporation

import React, { Component } from "react";
import { BulletChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    totalSalesIdentifier,
    yearDateDataSetAttributeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    locationResortIdentifier,
    projectId,
} from "../utils/fixtures";

const primaryMeasure = Model.measure(totalSalesIdentifier)
    .localIdentifier("totalSales")
    .alias("$ Total Sales");

const targetMeasure = Model.popMeasure("totalSales", yearDateDataSetAttributeIdentifier).alias(
    "$ Total Sales - SP year ago",
);

const comparativeMeasure = Model.measure(franchiseFeesIdentifierOngoingRoyalty).format("#,##0");
const locationResort = Model.attribute(locationResortIdentifier);

export class SamePeriodBulletChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodBulletChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("SamePeriodBulletChartExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 300 }} className="s-bullet-chart">
                <BulletChart
                    projectId={projectId}
                    primaryMeasure={primaryMeasure}
                    targetMeasure={targetMeasure}
                    comparativeMeasure={comparativeMeasure}
                    viewBy={locationResort}
                />
            </div>
        );
    }
}

export default SamePeriodBulletChartExample;
