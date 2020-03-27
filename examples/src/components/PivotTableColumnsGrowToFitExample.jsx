// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { Model, PivotTable } from "@gooddata/react-components";

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

export class PivotTableColumnsGrowToFitExample extends Component {
    render() {
        return (
            <div
                style={{ height: 300, resize: "both", overflow: "auto" }}
                className="s-pivot-table-columns-grow-to-fit"
            >
                <PivotTable
                    projectId={projectId}
                    measures={measures}
                    rows={attributes}
                    columns={columns}
                    config={{
                        growToFit: true,
                    }}
                    pageSize={20}
                />
            </div>
        );
    }
}

export default PivotTableColumnsGrowToFitExample;
