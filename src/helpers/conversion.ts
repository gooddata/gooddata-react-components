// (C) 2007-2019 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";
import { FormatTranslator, ISeparators } from "@gooddata/numberjs";
import cloneDeep = require("lodash/cloneDeep");
import { MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES } from "../constants/bucketNames";
import { IDefaultFormats } from "../components/afm/DataSourceProvider";

export const DEFAULT_FORMAT = "#,##0.00";

export function convertBucketsToMdObject(
    buckets: VisualizationObject.IBucket[],
    filters?: VisualizationObject.VisualizationObjectFilter[],
    uri?: string,
): VisualizationObject.IVisualizationObjectContent {
    const visClassUri = uri ? uri : "/does/not/matter";

    const visualizationObject = {
        visualizationClass: {
            uri: visClassUri,
        },

        buckets,
        filters,
    };

    return visualizationObject;
}

export function convertBucketsToAFM(
    buckets: VisualizationObject.IBucket[],
    filters?: VisualizationObject.VisualizationObjectFilter[],
): AFM.IAfm {
    const { afm } = DataLayer.toAfmResultSpec(convertBucketsToMdObject(buckets, filters));
    if (filters) {
        afm.filters = filters as AFM.FilterItem[];
    }

    return afm;
}

export function mergeSeparatorsIntoAfm(separators: ISeparators, afm: AFM.IAfm): AFM.IAfm {
    if (!afm || !separators) {
        return afm;
    }

    const measures = afm.measures.map((measure: AFM.IMeasure) => {
        measure.format = FormatTranslator.translate2custom(measure.format || DEFAULT_FORMAT, separators);
        return measure;
    });

    return {
        ...afm,
        measures,
    };
}

export function mergeSeparatorsIntoMeasures(
    separators: ISeparators,
    measures: VisualizationObject.BucketItem[],
): VisualizationObject.BucketItem[] {
    if (!measures || !separators) {
        return measures;
    }

    return measures.map((item: VisualizationObject.IMeasure) => {
        if (!VisualizationObject.isMeasure(item)) {
            return item;
        }
        const format = FormatTranslator.translate2custom(item.measure.format || DEFAULT_FORMAT, separators);
        return {
            ...item,
            measure: {
                ...item.measure,
                format,
            },
        };
    });
}

export function mergeSeparatorsIntoBuckets(
    separators: ISeparators,
    bucketsWithFormats: VisualizationObject.IBucket[],
): VisualizationObject.IBucket[] {
    if (!bucketsWithFormats || !separators) {
        return bucketsWithFormats;
    }

    const buckets = cloneDeep(bucketsWithFormats);

    const measureTypes = [MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES];
    buckets.forEach((bucket: VisualizationObject.IBucket) => {
        if (measureTypes.indexOf(bucket.localIdentifier) !== -1) {
            bucket.items = mergeSeparatorsIntoMeasures(separators, bucket.items);
        }
    });

    return buckets;
}

/*
Format of measures were modified if separators are exists (required by exporter).
Resetting format to default to make sure number fotmatter works correctly.
*/
export function resetMeasuresToDefaultSeparators(
    defaultFormats: IDefaultFormats,
    executionWithFormats: Execution.IExecutionResponses,
): Execution.IExecutionResponses {
    if (!executionWithFormats || !defaultFormats) {
        return executionWithFormats;
    }

    const execution = cloneDeep(executionWithFormats);

    const {
        executionResponse: { dimensions },
    } = execution;

    dimensions.forEach((dimension: Execution.IResultDimension) => {
        dimension.headers.forEach((header: Execution.IHeader) => {
            if (Execution.isMeasureGroupHeader(header)) {
                header.measureGroupHeader.items.forEach((item: Execution.IMeasureHeaderItem) => {
                    const { measureHeaderItem } = item;
                    measureHeaderItem.format =
                        defaultFormats[measureHeaderItem.localIdentifier] || DEFAULT_FORMAT;
                });
            }
        });
    });

    return execution;
}
