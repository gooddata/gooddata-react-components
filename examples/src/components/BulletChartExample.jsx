// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { BulletChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    monthDateIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    locationResortIdentifier,
} from "../utils/fixtures";

const primaryMeasure = Model.measure(franchiseFeesAdRoyaltyIdentifier).format("#,##0");
const targetMeasure = Model.measure(franchiseFeesIdentifier).format("#,##0");
const comparativeMeasure = Model.measure(franchiseFeesIdentifierOngoingRoyalty).format("#,##0");
const viewBy = [Model.attribute(locationResortIdentifier), Model.attribute(monthDateIdentifier)];
const filters = [
    Model.positiveAttributeFilter(locationResortIdentifier, ["Irving", "Montgomery"], true),
    Model.positiveAttributeFilter(monthDateIdentifier, ["Jan", "Mar", "May"], true),
];

export class BulletChartExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-bullet-chart">
                <BulletChart
                    projectId={projectId}
                    primaryMeasure={primaryMeasure}
                    targetMeasure={targetMeasure}
                    comparativeMeasure={comparativeMeasure}
                    viewBy={viewBy}
                    filters={filters}
                />
            </div>
        );
    }
}

export default BulletChartExample;
