// (C) 2020 GoodData Corporation
import * as BucketNames from "../../../../constants/bucketNames";
import { IBucket } from "../../../interfaces/Visualization";
import {
    getAllAttributeItems,
    limitNumberOfMeasuresInBuckets,
    IMeasureBucketItemsLimit,
    transformMeasureBuckets,
} from "../../../utils/bucketHelper";

const measureBucketItemsLimit: IMeasureBucketItemsLimit[] = [
    {
        localIdentifier: BucketNames.MEASURES,
        itemsLimit: 1,
    },
    {
        localIdentifier: BucketNames.SECONDARY_MEASURES,
        itemsLimit: 1,
    },
    {
        localIdentifier: BucketNames.TERTIARY_MEASURES,
        itemsLimit: 1,
    },
];

export const transformBuckets = (buckets: IBucket[]): IBucket[] => {
    const bucketsWithLimitedMeasures = limitNumberOfMeasuresInBuckets(buckets, 3, true);

    const measureBuckets = transformMeasureBuckets(measureBucketItemsLimit, bucketsWithLimitedMeasures);

    const viewByBucket = {
        localIdentifier: BucketNames.VIEW,
        items: getAllAttributeItems(buckets).slice(0, 2),
    };

    return [...measureBuckets, viewByBucket];
};
