// (C) 2019 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { hasAttribute, hasTertiaryMeasures, isStacked, canSortStackTotalValue } from "../mdObjectHelper";
import { IVisualizationProperties } from "../../interfaces/Visualization";

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
});
