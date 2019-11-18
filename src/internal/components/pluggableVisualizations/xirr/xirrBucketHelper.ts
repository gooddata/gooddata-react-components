// (C) 2019 GoodData Corporation
import { IReferencePoint, IBucket } from "../../../interfaces/Visualization";
import * as BucketNames from "../../../../constants/bucketNames";
import { getMeasures, getDateItems, findBucket } from "../../../utils/bucketHelper";

export const getXirrBuckets = ({ buckets }: Readonly<IReferencePoint>): IBucket[] => {
    const currentMeasureBucket = findBucket(buckets, BucketNames.MEASURES);
    const currentAttributeBucket = findBucket(buckets, BucketNames.ATTRIBUTE);

    const measureItem = getMeasures(buckets)[0];
    const dateAttributeItem = getDateItems(buckets)[0];

    return [
        {
            ...currentMeasureBucket,
            localIdentifier: BucketNames.MEASURES,
            items: measureItem ? [measureItem] : [],
        },
        {
            ...currentAttributeBucket,
            localIdentifier: BucketNames.ATTRIBUTE,
            items: dateAttributeItem ? [dateAttributeItem] : [],
        },
    ];
};
