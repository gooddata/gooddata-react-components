// (C) 2007-2020 GoodData Corporation
import React from "react";
import { PivotTable, Model, MeasureValueFilter } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import { projectId, franchisedSalesIdentifier, locationNameDisplayFormIdentifier } from "../utils/fixtures";

const measureTitle = "Franchised Sales in %";

const franchisedSalesMeasure = Model.measure(franchisedSalesIdentifier)
    .localIdentifier("franchisedSales")
    .title(measureTitle)
    .ratio();
const measures = [franchisedSalesMeasure];

const attributes = [Model.attribute(locationNameDisplayFormIdentifier).localIdentifier("locationName")];

const defaultMeasureValueFilter = Model.measureValueFilter("franchisedSales");

export class MeasureValueFilterComponentRatioExample extends React.PureComponent {
    state = {
        filters: [defaultMeasureValueFilter],
    };

    onApply = filter => {
        this.setState({ filters: [filter] });
    };

    render() {
        const { filters } = this.state;
        return (
            <React.Fragment>
                <MeasureValueFilter
                    onApply={this.onApply}
                    filter={filters[0]}
                    buttonTitle={measureTitle}
                    warningMessage="The filter uses actual measure values, not percentage."
                />
                <hr className="separator" />
                <div style={{ height: 300 }} className="s-pivot-table">
                    <PivotTable
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        filters={filters}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default MeasureValueFilterComponentRatioExample;
