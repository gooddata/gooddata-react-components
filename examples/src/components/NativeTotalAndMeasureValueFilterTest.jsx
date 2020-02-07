// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    locationStateDisplayFormIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesAdRoyaltyIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFeesAdRoyaltyIdentifier"),
];

const attributes = [Model.attribute(locationStateDisplayFormIdentifier).localIdentifier("state")];

const filters = [
    Model.measureValueFilter("franchiseFeesAdRoyaltyIdentifier").condition("GREATER_THAN", { value: 500000 }),
];

const totals = [
    {
        measureIdentifier: "franchiseFeesAdRoyaltyIdentifier",
        type: "nat",
        attributeIdentifier: "state",
    },
];

export class NativeTotalAndMeasureValueFilterTest extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-pivot-table-native-total-mvf">
                <PivotTable
                    projectId={projectId}
                    measures={measures}
                    rows={attributes}
                    filters={filters}
                    totals={totals}
                />
            </div>
        );
    }
}

export default NativeTotalAndMeasureValueFilterTest;
