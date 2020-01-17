// (C) 2020 GoodData Corporation
import { VisualizationObject, AFM } from "@gooddata/typings";
import {
    getMeasureValueFilterCondition,
    IMeasureValueFilterValue,
} from "../../interfaces/MeasureValueFilter";

export class MeasureValueFilterBuilder implements VisualizationObject.IMeasureValueFilter {
    public measureValueFilter: VisualizationObject.IMeasureValueFilter["measureValueFilter"];

    constructor(measureLocalIdentifier: string) {
        this.measureValueFilter = {
            measure: {
                localIdentifier: measureLocalIdentifier,
            },
        };
    }

    public condition = (operator: string, value: IMeasureValueFilterValue) => {
        const newCondition = getMeasureValueFilterCondition(operator, value);
        if (newCondition === null) {
            delete this.measureValueFilter.condition;
        } else {
            this.measureValueFilter.condition = newCondition;
        }

        return this;
    };

    public getAfmMeasureValueFilter = (): AFM.IMeasureValueFilter => {
        return { measureValueFilter: this.measureValueFilter };
    };
}

export const measureValueFilter = (measureLocalIdentifier: string) =>
    new MeasureValueFilterBuilder(measureLocalIdentifier);
