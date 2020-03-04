// (C) 2020 GoodData Corporation
import { IGeoLngLatBounds, IGeoLngLatLike } from "../../interfaces/GeoChart";

/*
 * @method getLngLatBounds: IGeoLngLatBounds
 * Represents a rectangular geographical area on a map.
 *
 * @example
 *
 * ```js
 * const corner1 = [40.712, -74.227],
 * const corner2 = [40.774, -74.125],
 * const bounds = getLngLatBounds([corner1, corner2]);
 *
 * bounds && map.fitBounds([bounds.northEast, bounds.southWest], { padding: 60 });
 * ```
 */
export function getLngLatBounds(lnglats: IGeoLngLatLike[]): IGeoLngLatBounds {
    if (!lnglats || !lnglats.length) {
        return;
    }

    return lnglats.reduce(extendLngLatBounds, undefined);
}

// @method extendLngLatBounds: IGeoLngLatBounds
// Extend the bounds to contain the given point
function extendLngLatBounds(bounds: IGeoLngLatBounds, lnglat: IGeoLngLatLike): IGeoLngLatBounds {
    if (!bounds) {
        return {
            northEast: lnglat,
            southWest: lnglat,
        };
    }

    const { northEast, southWest } = bounds;
    return {
        northEast: [Math.max(lnglat[0], northEast[0]), Math.max(lnglat[1], northEast[1])],
        southWest: [Math.min(lnglat[0], southWest[0]), Math.min(lnglat[1], southWest[1])],
    };
}
