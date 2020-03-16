// (C) 2020 GoodData Corporation
import { IGeoLngLatBounds, IGeoLngLat } from "../../interfaces/GeoChart";

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
export function getLngLatBounds(lnglats: IGeoLngLat[]): IGeoLngLatBounds {
    if (!lnglats || !lnglats.length) {
        return;
    }

    return lnglats.reduce(extendLngLatBounds, undefined);
}

// @method extendLngLatBounds: IGeoLngLatBounds
// Extend the bounds to contain the given point
function extendLngLatBounds(bounds: IGeoLngLatBounds, lnglat: IGeoLngLat): IGeoLngLatBounds {
    if (!bounds) {
        return {
            northEast: lnglat,
            southWest: lnglat,
        };
    }

    const { northEast, southWest } = bounds;
    return {
        northEast: {
            lat: Math.max(lnglat.lat, northEast.lat),
            lng: Math.max(lnglat.lng, northEast.lng),
        },
        southWest: {
            lat: Math.min(lnglat.lat, southWest.lat),
            lng: Math.min(lnglat.lng, southWest.lng),
        },
    };
}
