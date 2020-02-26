// (C) 2007-2020 GoodData Corporation
import React from "react";
import "@gooddata/react-components/styles/css/main.css";
import { BulletChart, HeaderPredicateFactory, Model } from "@gooddata/react-components";

import {
    projectId,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    locationResortIdentifier,
} from "../utils/fixtures";
import { ExampleWithOnDrill } from "./utils/ExampleWithOnDrill";

const primaryMeasure = Model.measure(franchiseFeesAdRoyaltyIdentifier)
    .format("#,##0")
    .localIdentifier("m1");
const targetMeasure = Model.measure(franchiseFeesIdentifier)
    .format("#,##0")
    .localIdentifier("m2");
const comparativeMeasure = Model.measure(franchiseFeesIdentifierOngoingRoyalty)
    .format("#,##0")
    .localIdentifier("m3");
const viewBy = [Model.attribute(locationResortIdentifier).localIdentifier("a1")];
const drillableItems = [
    HeaderPredicateFactory.identifierMatch(franchiseFeesAdRoyaltyIdentifier),
    HeaderPredicateFactory.identifierMatch(franchiseFeesIdentifierOngoingRoyalty),
    HeaderPredicateFactory.identifierMatch(franchiseFeesIdentifier),
];

export class BulletChartDrillExample extends ExampleWithOnDrill {
    render() {
        return (
            <div className="s-bullet-chart-on-drill">
                <div style={{ height: 300 }} className="s-bullet-chart">
                    <BulletChart
                        projectId={projectId}
                        primaryMeasure={primaryMeasure}
                        targetMeasure={targetMeasure}
                        comparativeMeasure={comparativeMeasure}
                        viewBy={viewBy}
                        drillableItems={drillableItems}
                        onFiredDrillEvent={this.onDrill}
                    />
                </div>
                {this.renderDrillEvent()}
            </div>
        );
    }
}

export default BulletChartDrillExample;
