// (C) 2007-2019 GoodData Corporation

import React, { Component } from "react";
import { ColumnChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { totalSalesIdentifier, monthDateIdentifier, projectId } from "../utils/fixtures";

const measures = [Model.measure(totalSalesIdentifier).localIdentifier(totalSalesIdentifier)];
const attribute = Model.attribute(monthDateIdentifier).localIdentifier(monthDateIdentifier);
const sortBy = [Model.measureSortItem(totalSalesIdentifier, "desc")];

export class MeasureSortingExample extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-measure-sorting">
                <ColumnChart projectId={projectId} measures={measures} viewBy={attribute} sortBy={sortBy} />
            </div>
        );
    }
}

export default MeasureSortingExample;
