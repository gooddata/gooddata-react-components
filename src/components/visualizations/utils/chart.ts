// (C) 2019 GoodData Corporation
import {AFM, Execution} from "@gooddata/typings";
import {IChartLimits} from "../../../interfaces/Config";
import get = require("lodash/get");

export function isDerivedMeasure(measureItem: Execution.IMeasureHeaderItem, afm: AFM.IAfm) {
    return afm.measures.some((measure: AFM.IMeasure) => {
        const measureDefinition =
            get(measure, "definition.popMeasure") || get(measure, "definition.previousPeriodMeasure");
        const derivedMeasureIdentifier = measureDefinition ? measure.localIdentifier : null;
        return (
            derivedMeasureIdentifier &&
            derivedMeasureIdentifier === measureItem.measureHeaderItem.localIdentifier
        );
    });
}

function findMeasureIndex(afm: AFM.IAfm, measureIdentifier: string): number {
    return afm.measures.findIndex((measure: AFM.IMeasure) => measure.localIdentifier === measureIdentifier);
}

export function findParentMeasureIndex(afm: AFM.IAfm, measureItemIndex: number): number {
    const measureDefinition = afm.measures[measureItemIndex].definition;

    if (AFM.isPopMeasureDefinition(measureDefinition)) {
        const sourceMeasureIdentifier = measureDefinition.popMeasure.measureIdentifier;
        return findMeasureIndex(afm, sourceMeasureIdentifier);
    }
    if (AFM.isPreviousPeriodMeasureDefinition(measureDefinition)) {
        const sourceMeasureIdentifier = measureDefinition.previousPeriodMeasure.measureIdentifier;
        return findMeasureIndex(afm, sourceMeasureIdentifier);
    }

    return -1;
}

export function isDataOfReasonableSize(chartData: any, limits: IChartLimits, isViewByTwoAttributes = false) {
    let result = true;

    const seriesLimit = get(limits, "series");
    if (seriesLimit !== undefined) {
        result = result && chartData.series.length <= seriesLimit;
    }

    const categoriesLimit = get(limits, "categories");
    if (categoriesLimit !== undefined) {
        if (isViewByTwoAttributes) {
            const categoriesLength = chartData.categories.reduce((result: number, category: any) => {
                return result + category.categories.length;
            }, 0);
            result = result && categoriesLength <= categoriesLimit;
        } else {
            result = result && chartData.categories.length <= categoriesLimit;
        }
    }

    const dataPointsLimit = get(limits, "dataPoints");
    if (dataPointsLimit !== undefined) {
        result = result && chartData.series.every((serie: any) => serie.data.length <= dataPointsLimit);
    }

    return result;
}
