// (C) 2007-2019 GoodData Corporation
import { AFM, VisualizationObject } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";
import { FormatTranslator, ISeparators } from "@gooddata/numberjs";
import { MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES } from "../constants/bucketNames";

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

function isMeasureItem(
    item: VisualizationObject.IMeasure | VisualizationObject.IVisualizationAttribute,
): item is VisualizationObject.IMeasure {
    return (item as VisualizationObject.IMeasure).measure !== undefined;
}

export function mergeSeparatorsIntoMeasures(
    separators: ISeparators,
    measures: VisualizationObject.BucketItem[],
): VisualizationObject.BucketItem[] {
    if (!measures || !separators) {
        return measures;
    }

    return measures.map((item: VisualizationObject.IMeasure) => {
        if (!isMeasureItem(item)) {
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
    buckets: VisualizationObject.IBucket[],
): VisualizationObject.IBucket[] {
    if (!buckets || !separators) {
        return buckets;
    }

    const measureTypes = [MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES];
    return buckets.map((bucket: VisualizationObject.IBucket) => {
        if (measureTypes.indexOf(bucket.localIdentifier) === -1) {
            return bucket;
        }
        return {
            ...bucket,
            items: mergeSeparatorsIntoMeasures(separators, bucket.items),
        };
    });
}
