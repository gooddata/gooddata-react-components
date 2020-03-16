// (C) 2020 GoodData Corporation
import { getLngLatBounds } from "../../geoChart/lngLatBounds";
import { IGeoLngLat } from "../../../interfaces/GeoChart";

describe("lngLatBounds", () => {
    it("should return undefined", () => {
        const lnglats: IGeoLngLat[] = [];
        expect(getLngLatBounds(lnglats)).toEqual(undefined);
    });

    it("should return bounds for one point", () => {
        const lnglats: IGeoLngLat[] = [
            {
                lat: -89.5,
                lng: 44.5,
            },
        ];
        expect(getLngLatBounds(lnglats)).toEqual({
            northEast: {
                lat: -89.5,
                lng: 44.5,
            },
            southWest: {
                lat: -89.5,
                lng: 44.5,
            },
        });
    });

    it("should return bounds for many points", () => {
        const lnglats: IGeoLngLat[] = [
            {
                lat: -89.5,
                lng: 44.5,
            },
            {
                lat: -80.5,
                lng: 39.0,
            },
        ];
        expect(getLngLatBounds(lnglats)).toEqual({
            northEast: {
                lat: -80.5,
                lng: 44.5,
            },
            southWest: {
                lat: -89.5,
                lng: 39,
            },
        });
    });
});
