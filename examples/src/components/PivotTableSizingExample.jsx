// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { Model, PivotTable } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    employeeNameIdentifier,
    franchisedSalesIdentifier,
    locationNameDisplayFormIdentifier,
    projectId,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchisedSalesIdentifier)
        .format("#,##0")
        .alias("Sales"),
];

const attributes = [Model.attribute(employeeNameIdentifier)];

const columns = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("location")];

export class PivotTableSizingExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-pivot-table-sizing">
                <PivotTable
                    projectId={projectId}
                    measures={measures}
                    rows={attributes}
                    columns={columns}
                    config={{
                        columnSizing: {
                            defaultWidth: "viewport",
                        },
                    }}
                    pageSize={20}
                />
            </div>
        );
    }
}

export default PivotTableSizingExample;
