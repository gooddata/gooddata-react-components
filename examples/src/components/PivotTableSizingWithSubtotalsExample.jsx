// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { Model, PivotTable } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    franchiseFeesInitialFranchiseFeeIdentifier,
    locationNameDisplayFormIdentifier,
    locationStateDisplayFormIdentifier,
    menuCategoryAttributeDFIdentifier,
    monthDateIdentifier,
    projectId,
    quarterDateIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFeesIdentifier")
        .alias("Fees"),
    Model.measure(franchiseFeesAdRoyaltyIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFeesAdRoyaltyIdentifier")
        .alias("Ad Royality"),
    Model.measure(franchiseFeesInitialFranchiseFeeIdentifier)
        .format("#,##0")
        .alias("Initial Fee"),
    Model.measure(franchiseFeesIdentifierOngoingRoyalty)
        .format("#,##0")
        .alias("Ongoing Royalty"),
];

const attributes = [
    Model.attribute(locationStateDisplayFormIdentifier),
    Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName"),
    Model.attribute(menuCategoryAttributeDFIdentifier).localIdentifier("menu"),
];

const totals = [
    {
        measureIdentifier: "franchiseFeesIdentifier",
        type: "sum",
        attributeIdentifier: "locationName",
    },
    {
        measureIdentifier: "franchiseFeesIdentifier",
        type: "avg",
        attributeIdentifier: "locationName",
    },
    {
        measureIdentifier: "franchiseFeesAdRoyaltyIdentifier",
        type: "sum",
        attributeIdentifier: "menu",
    },
    {
        measureIdentifier: "franchiseFeesIdentifier",
        type: "max",
        attributeIdentifier: "menu",
    },
];

const columns = [Model.attribute(quarterDateIdentifier), Model.attribute(monthDateIdentifier)];

export class PivotTableSizingWithSubtotalsExample extends Component {
    render() {
        return (
            <div style={{ width: 900, height: 600 }} className="s-pivot-table-sizing-with-subtotals">
                <PivotTable
                    projectId={projectId}
                    measures={measures}
                    config={{
                        menu: {
                            aggregations: true,
                            aggregationsSubMenu: true,
                        },
                        columnSizing: {
                            defaultWidth: "viewport",
                        },
                    }}
                    rows={attributes}
                    columns={columns}
                    totals={totals}
                    pageSize={20}
                    groupRows
                />
            </div>
        );
    }
}

export default PivotTableSizingWithSubtotalsExample;
