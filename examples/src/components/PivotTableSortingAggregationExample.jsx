// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    quarterDateIdentifier,
    locationStateDisplayFormIdentifier,
    franchiseFeesIdentifier,
} from "../utils/fixtures";

const measures = [Model.measure(franchiseFeesIdentifier).format("#,##0")];

const attributes = [Model.attribute(locationStateDisplayFormIdentifier).localIdentifier("state")];

const columns = [Model.attribute(quarterDateIdentifier)];

const sortBy = [Model.attributeSortItem("state", "desc").aggregation("sum")];

export class PivotTableSortingAggregationExample extends Component {
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

export default PivotTableSortingAggregationExample;
