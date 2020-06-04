// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { ColumnChart, Model } from "@gooddata/react-components";
import "@gooddata/react-components/styles/css/main.css";

import { totalCostsIdentifier, locationStateDisplayFormIdentifier, projectId } from "../utils/fixtures";

const totalCostsLocalIdentifier = "totalCosts";

const totalCosts = Model.measure(totalCostsIdentifier)
    .format("#,##0")
    .alias("$ Total Costs")
    .localIdentifier(totalCostsLocalIdentifier);

const localState = Model.attribute(locationStateDisplayFormIdentifier);

const filters = [
    Model.measureValueFilter(totalCostsLocalIdentifier).condition("LESS_THAN", { value: -13000000 }),
    Model.positiveAttributeFilter(locationStateDisplayFormIdentifier, ["Texas"], true),
];

export class MeasureValueFilterAndAttributeFilter extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 300 }} className="s-measure-value-filter-and-attribute-filter">
                <ColumnChart
                    projectId={projectId}
                    measures={[totalCosts]}
                    viewBy={[localState]}
                    filters={filters}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default MeasureValueFilterAndAttributeFilter;
