// (C) 2007-2019 GoodData Corporation
import { AFM, VisualizationObject } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";

export function convertBucketsToMdObject(
    buckets: VisualizationObject.IBucket[],
    filters?: VisualizationObject.VisualizationObjectExtendedFilter[],
    uri?: string,
): VisualizationObject.IVisualizationObjectContent {
    const visClassUri = uri ? uri : "/does/not/matter";

    return {
        visualizationClass: {
            uri: visClassUri,
        },

        buckets,
        filters,
    };
}

export function convertBucketsToAFM(
    buckets: VisualizationObject.IBucket[],
    filters?: VisualizationObject.VisualizationObjectExtendedFilter[],
): AFM.IAfm {
    const { afm } = DataLayer.toAfmResultSpec(convertBucketsToMdObject(buckets, filters));
    return afm;
}
