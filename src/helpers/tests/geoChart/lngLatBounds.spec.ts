// (C) 2020 GoodData Corporation
import { getLngLatBounds } from "../../geoChart/lngLatBounds";
import { IGeoLngLatLike } from "../../../interfaces/GeoChart";

describe("lngLatBounds", () => {
    it("should return undefined", () => {
        const lnglats: IGeoLngLatLike[] = [];
        expect(getLngLatBounds(lnglats)).toEqual(undefined);
    });

    it("should return bounds for one point", () => {
        const lnglats: IGeoLngLatLike[] = [[44.5, -89.5]];
        expect(getLngLatBounds(lnglats)).toEqual({
            northEast: [44.5, -89.5],
            southWest: [44.5, -89.5],
        });
    });

    it("should return bounds for many points", () => {
        const lnglats: IGeoLngLatLike[] = [[44.5, -89.5], [39.0, -80.5]];
        expect(getLngLatBounds(lnglats)).toEqual({
            northEast: [44.5, -80.5],
            southWest: [39, -89.5],
        });
    });
});
