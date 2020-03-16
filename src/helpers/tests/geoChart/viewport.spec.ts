// (C) 2020 GoodData Corporation
import mapboxgl from "mapbox-gl";
import { getLngLatBounds, getViewportOptions } from "../../geoChart/viewport";
import { IGeoConfig, IGeoConfigViewportArea, IGeoLngLat } from "../../../interfaces/GeoChart";

describe("viewport", () => {
    describe("getViewportOptions", () => {
        const DEFAULT_CONFIG: IGeoConfig = { mapboxToken: "" };

        it("should return center if it exists", () => {
            const center: IGeoLngLat = {
                lat: 1,
                lng: 2,
            };
            const data: IGeoLngLat[] = [];
            const config: IGeoConfig = {
                ...DEFAULT_CONFIG,
                center,
                viewport: {
                    area: "world",
                },
            };
            expect(getViewportOptions(data, config)).toEqual({
                center,
                zoom: 2, // default zoom
            });
        });

        it.each([
            [
                "auto",
                [
                    {
                        lat: 3,
                        lng: 6,
                    },
                    {
                        lat: 1,
                        lng: 5,
                    },
                ],
            ],
            [
                "continent_af",
                [
                    {
                        lat: -36.3318,
                        lng: -20.2255,
                    },
                    {
                        lat: 37.982,
                        lng: 54.4841,
                    },
                ],
            ],
            [
                "continent_as",
                [
                    {
                        lat: -9.8256,
                        lng: 24.3532,
                    },
                    {
                        lat: 79.488044,
                        lng: 180,
                    },
                ],
            ],
            [
                "continent_au",
                [
                    {
                        lat: -47.9436,
                        lng: 109.8601,
                    },
                    {
                        lat: 0,
                        lng: 180,
                    },
                ],
            ],
            [
                "continent_eu",
                [
                    {
                        lat: 33.6033,
                        lng: -26.5876,
                    },
                    {
                        lat: 77.442,
                        lng: 78.3182,
                    },
                ],
            ],
            [
                "continent_na",
                [
                    {
                        lat: 2.2236,
                        lng: -170.4181,
                    },
                    {
                        lat: 72.0157,
                        lng: -52.69208,
                    },
                ],
            ],
            [
                "continent_sa",
                [
                    {
                        lat: -56.8929,
                        lng: -90.242,
                    },
                    {
                        lat: 14.0995,
                        lng: -31.3784,
                    },
                ],
            ],
            [
                "world",
                [
                    {
                        lat: -84,
                        lng: -180,
                    },
                    {
                        lat: 84,
                        lng: 180,
                    },
                ],
            ],
        ])(
            "should return bounds for %s",
            (area: IGeoConfigViewportArea, expectedBounds: mapboxgl.LngLatBoundsLike) => {
                const data: IGeoLngLat[] = [{ lat: 1, lng: 5 }, { lat: 3, lng: 6 }];
                const config: IGeoConfig = {
                    ...DEFAULT_CONFIG,
                    viewport: {
                        area,
                    },
                };
                expect(getViewportOptions(data, config)).toEqual({
                    bounds: expectedBounds,
                });
            },
        );

        it("should return bounds for all data", () => {
            const data: IGeoLngLat[] = [{ lat: 1, lng: 5 }, { lat: 3, lng: 6 }];
            expect(getViewportOptions(data, DEFAULT_CONFIG)).toEqual({
                bounds: [
                    {
                        lat: 3,
                        lng: 6,
                    },
                    {
                        lat: 1,
                        lng: 5,
                    },
                ],
            });
        });

        it("should return default center if there is no data", () => {
            const data: IGeoLngLat[] = [];
            expect(getViewportOptions(data, DEFAULT_CONFIG)).toEqual({
                center: {
                    lat: 34,
                    lng: 5,
                },
                zoom: 2,
            });
        });
    });

    describe("getLngLatBounds", () => {
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
});
