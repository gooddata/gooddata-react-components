// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { PivotTable, Model } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/main.css";

import {
    nameAttributeIdentifier,
    nameAttributeLocalIdentifier,
    projectId,
    sumOfNumberIdentifier,
    sumOfNumberLocalIdentifier,
} from "../utils/fixtures";

const filters = [
    Model.measureValueFilter(sumOfNumberLocalIdentifier).condition(
        "LESS_THAN",
        { value: 10 },
        { treatNullValuesAs: 0 },
    ),
];

const measure = [
    Model.measure(sumOfNumberIdentifier)
        .aggregation("sum")
        .alias("Sum of Number")
        .localIdentifier(sumOfNumberLocalIdentifier),
];

const attribute = [Model.attribute(nameAttributeIdentifier).localIdentifier(nameAttributeLocalIdentifier)];

export class MeasureValueFilterTreatNullAsZero extends Component {
    render() {
        return (
            <div style={{ height: 300 }} className="s-measure-value-filter-treat-null-as-zero-table">
                <PivotTable projectId={projectId} measures={measure} rows={attribute} filters={filters} />
            </div>
        );
    }
}

export default MeasureValueFilterTreatNullAsZero;
