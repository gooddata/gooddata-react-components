// (C) 2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    isDataOfReasonableSize,
    isChartConfig,
    isGeoConfig,
    isClusteringAllowed,
    isLocationMissing,
    calculateAverage,
    getFormatFromExecutionResponse,
    isPointsConfigChanged,
    isColorAssignmentItemChanged,
} from "../../geoChart/common";
import { IChartConfig, IColorAssignment } from "../../../interfaces/Config";
import { IGeoConfig, IGeoData, IGeoPointsConfig } from "../../../interfaces/GeoChart";
import { COLOR_ITEM, LOCATION_ITEM, SEGMENT_BY_ITEM, SIZE_ITEM, TOOLTIP_TEXT_ITEM } from "./fixtures";
import { getExecutionResponse, getExecutionResult } from "../../../../stories/data/geoChart";

describe("common", () => {
    describe("isDataOfReasonableSize", () => {
        it.each([[51, true], [30, false]])(
            "should return isDataOfReasonableSize is %s",
            (limit: number, expectedResult: boolean) => {
                const geoData: IGeoData = { location: { index: 0, name: "location", data: [] } };
                const executionResult = getExecutionResult(true);
                expect(isDataOfReasonableSize(executionResult, geoData, limit)).toEqual(expectedResult);
            },
        );
    });

    describe("isLocationMissing", () => {
        it("should return false if location is in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [
                LOCATION_ITEM,
                SEGMENT_BY_ITEM,
                TOOLTIP_TEXT_ITEM,
                SIZE_ITEM,
                COLOR_ITEM,
            ];
            expect(isLocationMissing(buckets)).toBe(false);
        });

        it("should return true if location is not in buckets", () => {
            const buckets: VisualizationObject.IBucket[] = [SIZE_ITEM];
            expect(isLocationMissing(buckets)).toBe(true);
        });
    });

    describe("calculateAverage", () => {
        it("should return expected value", () => {
            const values: number[] = [1, 2, 3, 4, 5, 6];
            expect(calculateAverage(values)).toEqual(3.5);
        });
    });

    describe("getFormatFromExecutionResponse", () => {
        it("should return format of Size Measure ", () => {
            const executionResponse = getExecutionResponse(true, false, false, true, false);
            expect(getFormatFromExecutionResponse(executionResponse, 0)).toEqual("#,##0");
        });
    });

    describe("isClusteringAllowed", () => {
        it.each([
            [
                false,
                "size measure is in bucket",
                {
                    location: { index: 0, name: "location" },
                    size: { index: 0, name: "size" },
                },
                true,
            ],
            [
                false,
                "color measure is in bucket",
                {
                    location: { index: 0, name: "location" },
                    color: { index: 1, name: "color" },
                },
                true,
            ],
            [
                false,
                "segment attribute is in bucket",
                {
                    location: { index: 0, name: "location" },
                    segment: { index: 1, name: "segment" },
                },
                true,
            ],
            [
                true,
                "tooltipText attribute is in bucket",
                {
                    location: { index: 0, name: "location" },
                    tooltipText: { index: 1, name: "tooltipText" },
                },
                true,
            ],
            [
                true,
                "only location attribute is in bucket",
                {
                    location: { index: 0, name: "location" },
                },
                true,
            ],
            [
                false,
                "configuration groupNearbyPoints is false",
                {
                    location: { index: 0, name: "location" },
                },
                false,
            ],
        ])(
            "should return %s when %s",
            (expectedValue: boolean, _description: string, geoData: IGeoData, groupNearbyPoints: boolean) => {
                expect(isClusteringAllowed(geoData, groupNearbyPoints)).toEqual(expectedValue);
            },
        );
    });

    describe("isChartConfig", () => {
        it.each([[false, { mapboxToken: "abc" }], [true, {}]])(
            "should return isChartConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isChartConfig(config)).toEqual(expectedValue);
            },
        );
    });

    describe("isGeoConfig", () => {
        it.each([[false, {}], [true, { mapboxToken: "abc" }]])(
            "should return isGeoConfig %s",
            (expectedValue: boolean, config: IChartConfig | IGeoConfig) => {
                expect(isGeoConfig(config)).toEqual(expectedValue);
            },
        );
    });

    describe("isPointsConfigChanged", () => {
        const pointsConfig: IGeoPointsConfig = {
            groupNearbyPoints: true,
            minSize: "normal",
            maxSize: "normal",
        };
        it("should return false without changes", () => {
            expect(isPointsConfigChanged(pointsConfig, pointsConfig)).toBe(false);
        });

        it.each([["groupNearbyPoints", false], ["minSize", "0.5x"], ["maxSize", "1.25x"]])(
            "should return true when %s is changed",
            (configKey: string, configValue: string | boolean) => {
                expect(
                    isPointsConfigChanged(pointsConfig, {
                        [configKey]: configValue,
                    }),
                ).toBe(true);
            },
        );
    });

    describe("isColorAssignmentItemChanged", () => {
        const colorAssignment: IColorAssignment[] = [
            {
                color: { type: "guid", value: "1" },
                headerItem: {
                    attributeHeaderItem: {
                        name: "General Goods",
                        uri: "/gdc/md/storybook/obj/23/elements?id=1",
                    },
                },
            },
        ];

        it("should return false without changes", () => {
            expect(isColorAssignmentItemChanged(colorAssignment, colorAssignment)).toBe(false);
        });

        it("should return true with colorAssignment is different", () => {
            const prevColorAssignment: IColorAssignment[] = [
                ...colorAssignment,
                {
                    color: { type: "guid", value: "2" },
                    headerItem: {
                        attributeHeaderItem: {
                            name: "General Goods",
                            uri: "/gdc/md/storybook/obj/23/elements?id=2",
                        },
                    },
                },
            ];
            expect(isColorAssignmentItemChanged(prevColorAssignment, colorAssignment)).toBe(true);
        });
    });
});
