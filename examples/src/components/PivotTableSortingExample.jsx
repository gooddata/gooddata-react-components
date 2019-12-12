// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    quarterDateIdentifier,
    monthDateIdentifier,
    locationStateDisplayFormIdentifier,
    locationNameDisplayFormIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    menuCategoryAttributeDFIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesIdentifier).format("#,##0"),
    Model.measure(franchiseFeesAdRoyaltyIdentifier).format("#,##0"),
    Model.measure(franchiseFeesInitialFranchiseFeeIdentifier).format("#,##0"),
    Model.measure(franchiseFeesIdentifierOngoingRoyalty).format("#,##0"),
];

const attributes = [
    Model.attribute(locationStateDisplayFormIdentifier),
    Model.attribute(locationNameDisplayFormIdentifier),
    Model.attribute(menuCategoryAttributeDFIdentifier).localIdentifier("menu"),
];

const columns = [Model.attribute(quarterDateIdentifier), Model.attribute(monthDateIdentifier)];

const sortBy = [Model.attributeSortItem("menu", "asc")];

export class PivotTableSortingExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-pivot-table-sorting">
                <PivotTable
                    projectId={projectId}
                    measures={measures}
                    rows={attributes}
                    columns={columns}
                    pageSize={20}
                    sortBy={sortBy}
                />
            </div>
        );
    }
}

export default PivotTableSortingExample;
