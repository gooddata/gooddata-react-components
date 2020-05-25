// (C) 2007-2020 GoodData Corporation
import React from "react";
import { PivotTable, Model, MeasureValueFilter } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";
import {
    projectId,
    sumOfNumberLocalIdentifier,
    sumOfNumberIdentifier,
    nameAttributeIdentifier,
    nameAttributeLocalIdentifier,
} from "../utils/fixtures";

const measureTitle = "Sum of Number";

const defaultMeasureValueFilter = Model.measureValueFilter(sumOfNumberLocalIdentifier);

const measures = [
    Model.measure(sumOfNumberIdentifier)
        .aggregation("sum")
        .alias("Sum of Number")
        .localIdentifier(sumOfNumberLocalIdentifier),
];

const attributes = [Model.attribute(nameAttributeIdentifier).localIdentifier(nameAttributeLocalIdentifier)];

export class MeasureValueFilterTreatNullAsZeroComponentExample extends React.PureComponent {
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
                    displayTreatNullAsZeroOption
                    treatNullAsZeroDefaultValue
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

export default MeasureValueFilterTreatNullAsZeroComponentExample;
