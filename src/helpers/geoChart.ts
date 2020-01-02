// (C) 2019-2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { IGeoDataIndex } from "../interfaces/GeoChart";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../constants/bucketNames";

/**
 * Build geo data index
 * - location, segmentBy, tooltipText, size, color
 *  {
 *      location: 0,
 *      segmentBy: 1,
 *      tooltipText: 2,
 *      size: 0,
 *      color: 1
 *  }
 *
 * - location, size, color
 *  {
 *      location: 0,
 *      size: 0,
 *      color: 1
 *  }
 *
 * - segmentBy, tooltipText, color
 *  {
 *      segmentBy: 0,
 *      tooltipText: 1,
 *      color: 0
 *  }
 * @param buckets
 */
export function getGeoDataIndex(buckets: VisualizationObject.IBucket[]): IGeoDataIndex {
    const availableItems = buckets.reduce(
        (result: { [property: string]: boolean }, bucket: VisualizationObject.IBucket) => ({
            ...result,
            [bucket.localIdentifier]: Boolean(bucket.items.length),
        }),
        {},
    );

    const {
        location = false,
        segmentBy = false,
        tooltipText = false,
        size = false,
        color = false,
    }: { [property: string]: boolean } = availableItems;

    const geoDataIndex: IGeoDataIndex = {};
    if (location) {
        geoDataIndex[LOCATION] = 0;
    }

    if (segmentBy) {
        geoDataIndex[SEGMENT_BY] = location ? 1 : 0;
    }

    if (tooltipText) {
        geoDataIndex[TOOLTIP_TEXT] = location && segmentBy ? 2 : location || segmentBy ? 1 : 0;
    }

    if (size) {
        geoDataIndex[SIZE] = 0;
    }

    if (color) {
        geoDataIndex[COLOR] = size ? 1 : 0;
    }

    return geoDataIndex;
}
