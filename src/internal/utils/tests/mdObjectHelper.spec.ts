// (C) 2019 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    hasAttribute,
    hasTertiaryMeasures,
    isStacked,
    canSortStackTotalValue,
    countItemsInMdObject,
    countItemsOnAxes,
} from "../mdObjectHelper";
import { IVisualizationProperties } from "../../interfaces/Visualization";
import * as BucketNames from "../../../constants/bucketNames";

describe("mdObjectHelper", () => {
    const visualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "a1",
            displayForm: {
                uri: "/gdc/2",
            },
        },
    };
    const measure = {
        measure: {
            localIdentifier: "m1",
            definition: {
                measureDefinition: {
                    item: {
                        uri: "/gdc/3",
                    },
                },
            },
        },
    };

    const visualizationClass = {
        uri: "/gdc/1",
    };
    const emptyMdObject: VisualizationObject.IVisualizationObjectContent = {
        buckets: [],
        visualizationClass,
    };

    describe("hasAttribute", () => {
        it("should correctly detect attribute absence", () => {
            expect(hasAttribute(emptyMdObject)).toEqual(false);
        });

        it("should correctly detect attribute presence", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "attribute",
                        items: [visualizationAttribute],
                    },
                ],
                visualizationClass,
            };
            expect(hasAttribute(mdObject)).toEqual(true);
        });
    });

    describe("hasTertiaryMeasures", () => {
        it("should correctly detect tertiary measures absence", () => {
            expect(hasTertiaryMeasures(emptyMdObject)).toEqual(false);
        });

        it("should correctly detect tertiary measures presence", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "tertiary_measures",
                        items: [measure],
                    },
                ],
                visualizationClass,
            };
            expect(hasTertiaryMeasures(mdObject)).toEqual(true);
        });
    });

    describe("isStacked", () => {
        it("should correctly detect not stacked", () => {
            expect(isStacked(emptyMdObject)).toEqual(false);
        });

        it("should correctly detect stacked", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "segment",
                        items: [visualizationAttribute],
                    },
                ],
                visualizationClass,
            };
            expect(isStacked(mdObject)).toEqual(true);
        });
    });

    describe("simple stacked measures", () => {
        const secondMeasure: VisualizationObject.BucketItem = {
            measure: {
                localIdentifier: "m2",
                definition: {
                    measureDefinition: {
                        item: {
                            uri: "/gdc/4",
                        },
                    },
                },
            },
        };
        it("should return false if have measures on both yAxes", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [measure, secondMeasure],
                    },
                ],
                visualizationClass,
            };
            const supportedControls: IVisualizationProperties = {
                stackMeasures: true,
                secondary_yaxis: {
                    measures: ["m2"],
                },
            };
            expect(canSortStackTotalValue(mdObject, supportedControls)).toBe(false);
        });

        it("should return false if have two view by attribute", () => {
            const secondAttribute: VisualizationObject.BucketItem = {
                visualizationAttribute: {
                    localIdentifier: "a2",
                    displayForm: {
                        uri: "/gdc/3",
                    },
                },
            };

            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [measure, secondMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [visualizationAttribute, secondAttribute],
                    },
                ],
                visualizationClass,
            };
            const supportedControls: IVisualizationProperties = {
                stackMeasures: true,
            };
            expect(canSortStackTotalValue(mdObject, supportedControls)).toBe(false);
        });

        it("should return true if have one view by and many measures", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                buckets: [
                    {
                        localIdentifier: "measures",
                        items: [measure, secondMeasure],
                    },
                    {
                        localIdentifier: "view",
                        items: [visualizationAttribute],
                    },
                ],
                visualizationClass,
            };
            const supportedControls: IVisualizationProperties = {
                stackMeasures: true,
            };
            expect(canSortStackTotalValue(mdObject, supportedControls)).toBe(true);
        });
    });

    describe("countItemsOnAxesInMdObject", () => {
        it("should return number of items in buckets", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                visualizationClass: {
                    uri: "/gdc/md/mockproject/obj/123",
                },
                buckets: [
                    { localIdentifier: BucketNames.VIEW, items: Array(2) as any[] },
                    { localIdentifier: BucketNames.MEASURES, items: Array(3) as any[] },
                    { localIdentifier: BucketNames.SECONDARY_MEASURES, items: Array(4) as any[] },
                ],
            };
            const result = countItemsInMdObject(mdObject);
            expect(result).toEqual({
                viewByItemCount: 2,
                measureItemCount: 3,
                secondaryMeasureItemCount: 4,
            });
        });
    });

    describe("countItemsOnAxes", () => {
        it("should return number of items on axes of column chart", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                visualizationClass: {
                    uri: "/gdc/md/mockproject/obj/123",
                },
                buckets: [
                    { localIdentifier: BucketNames.VIEW, items: Array(2) as any[] },
                    { localIdentifier: BucketNames.MEASURES, items: Array(3) as any[] },
                ],
            };
            const controls: IVisualizationProperties = {
                secondary_yaxis: {
                    measures: Array(1),
                },
            };
            const result = countItemsOnAxes("column", controls, mdObject);
            expect(result).toEqual({
                xaxis: 2,
                yaxis: 2,
                secondary_yaxis: 1,
            });
        });

        it("should return number of items on axes of bar chart", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                visualizationClass: {
                    uri: "/gdc/md/mockproject/obj/123",
                },
                buckets: [
                    { localIdentifier: BucketNames.VIEW, items: Array(2) as any[] },
                    { localIdentifier: BucketNames.MEASURES, items: Array(3) as any[] },
                ],
            };
            const controls: IVisualizationProperties = {
                secondary_xaxis: {
                    measures: Array(2),
                },
            };
            const result = countItemsOnAxes("bar", controls, mdObject);
            expect(result).toEqual({
                yaxis: 2,
                xaxis: 1,
                secondary_xaxis: 2,
            });
        });

        it("should return number of items on axes of combo chart", () => {
            const mdObject: VisualizationObject.IVisualizationObjectContent = {
                visualizationClass: {
                    uri: "/gdc/md/mockproject/obj/123",
                },
                buckets: [
                    { localIdentifier: BucketNames.VIEW, items: Array(2) as any[] },
                    { localIdentifier: BucketNames.MEASURES, items: Array(3) as any[] },
                    { localIdentifier: BucketNames.SECONDARY_MEASURES, items: Array(4) as any[] },
                ],
            };
            const controls: IVisualizationProperties = {
                secondary_yaxis: {
                    measures: Array(4),
                },
            };
            const result = countItemsOnAxes("combo", controls, mdObject);
            expect(result).toEqual({
                xaxis: 2,
                yaxis: 3,
                secondary_yaxis: 4,
            });
        });
    });
});
