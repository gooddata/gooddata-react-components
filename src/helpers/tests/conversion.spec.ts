// (C) 2019 GoodData Corporation
import { AFM, VisualizationInput, VisualizationObject } from "@gooddata/typings";
import {
    convertBucketsToAFM,
    mergeSeparatorsIntoAfm,
    mergeSeparatorsIntoBuckets,
    mergeSeparatorsIntoMeasures,
} from "../conversion";
import { MEASURES } from "../../constants/bucketNames";

const PositiveTextFilter: VisualizationInput.IFilter = {
    positiveAttributeFilter: {
        displayForm: { identifier: "foo" },
        in: ["val1", "val2"],
        textFilter: true,
    },
};

const NegativeTextFilter: VisualizationInput.IFilter = {
    negativeAttributeFilter: {
        displayForm: { identifier: "foo" },
        notIn: ["val1", "val2"],
        textFilter: true,
    },
};

/**
 * Tests here solidify the contract of text filters:
 *
 * - text filter indicator is optional property added on top of existing visualization object structures accepted
 *   by convertBucketsToAFM
 * - if present, the textFilter property MUST be returned in the resulting AFM structures
 * - the textFilter property MAY occur in positive or negative attribute filters included in global filters or
 *   in simple measure definition
 */
describe("convertBucketsToAFM", () => {
    it("should retain textFilter indicator for positive filter in global filters", () => {
        expect(convertBucketsToAFM([], [PositiveTextFilter])).toEqual({ filters: [PositiveTextFilter] });
    });

    it("should retain textFilter indicator for negative filter in global filters", () => {
        expect(convertBucketsToAFM([], [NegativeTextFilter])).toEqual({ filters: [NegativeTextFilter] });
    });

    it("should retain textFilter indicator for positive filter in simple measure filters", () => {
        const simpleMeasure: VisualizationInput.IMeasure = {
            measure: {
                localIdentifier: "m1",
                definition: {
                    measureDefinition: {
                        item: { identifier: "m1Id" },
                        aggregation: "sum",
                        filters: [PositiveTextFilter],
                    },
                },
            },
        };

        expect(convertBucketsToAFM([{ localIdentifier: "bucket", items: [simpleMeasure] }])).toEqual({
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: { identifier: "m1Id" },
                            aggregation: "sum",
                            filters: [PositiveTextFilter],
                        },
                    },
                },
            ],
        });
    });

    it("should retain textFilter indicator for negative filter in simple measure filters", () => {
        const simpleMeasure: VisualizationInput.IMeasure = {
            measure: {
                localIdentifier: "m1",
                definition: {
                    measureDefinition: {
                        item: { identifier: "m1Id" },
                        aggregation: "sum",
                        filters: [NegativeTextFilter],
                    },
                },
            },
        };

        expect(convertBucketsToAFM([{ localIdentifier: "bucket", items: [simpleMeasure] }])).toEqual({
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: { identifier: "m1Id" },
                            aggregation: "sum",
                            filters: [NegativeTextFilter],
                        },
                    },
                },
            ],
        });
    });
});

describe("mergeSeparatorsIntoAfm", () => {
    const afm: AFM.IAfm = {
        measures: [
            {
                localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                definition: {
                    measure: {
                        item: {
                            identifier: "identifier",
                        },
                    },
                },
                format: "#,##0.00",
            },
        ],
    };

    it("should return null if there is no afm", () => {
        expect(mergeSeparatorsIntoAfm(null, null)).toEqual(null);
    });

    it("should return the same afm if there is no separators", () => {
        expect(mergeSeparatorsIntoAfm(null, afm)).toEqual(afm);
    });

    it("should return the afm with updated format", () => {
        expect(mergeSeparatorsIntoAfm({ decimal: ",", thousand: "'" }, afm)).toEqual({
            measures: [
                {
                    localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                    definition: {
                        measure: {
                            item: {
                                identifier: "identifier",
                            },
                        },
                    },
                    format: "#'##0,00",
                },
            ],
        });
    });
});

describe("mergeSeparatorsIntoMeasures", () => {
    const measures: VisualizationObject.IMeasure[] = [
        {
            measure: {
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: "identifier",
                        },
                    },
                },
                localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                format: "#,##0.00",
            },
        },
    ];

    it("should return null if there is no measures", () => {
        expect(mergeSeparatorsIntoMeasures(null, null)).toEqual(null);
    });

    it("should return the same measures if there is no separators", () => {
        expect(mergeSeparatorsIntoMeasures(null, measures)).toEqual(measures);
    });

    it("should return the measures with updated format", () => {
        expect(mergeSeparatorsIntoMeasures({ decimal: ",", thousand: "'" }, measures)).toEqual([
            {
                measure: {
                    definition: {
                        measureDefinition: {
                            item: {
                                identifier: "identifier",
                            },
                        },
                    },
                    localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                    format: "#'##0,00",
                },
            },
        ]);
    });
});

describe("mergeSeparatorsIntoBuckets", () => {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: [
                {
                    measure: {
                        definition: {
                            measureDefinition: {
                                item: {
                                    identifier: "identifier",
                                },
                            },
                        },
                        localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                        format: "#,##0.00",
                    },
                },
            ],
        },
    ];

    it("should return null if there is no buckets", () => {
        expect(mergeSeparatorsIntoBuckets(null, null)).toEqual(null);
    });

    it("should return the same buckets if there is no separators", () => {
        expect(mergeSeparatorsIntoBuckets(null, buckets)).toEqual(buckets);
    });

    it("should return the buckets with updated format", () => {
        expect(mergeSeparatorsIntoBuckets({ decimal: ",", thousand: "'" }, buckets)).toEqual([
            {
                localIdentifier: MEASURES,
                items: [
                    {
                        measure: {
                            definition: {
                                measureDefinition: {
                                    item: {
                                        identifier: "identifier",
                                    },
                                },
                            },
                            localIdentifier: "franchiseFeesAdRoyaltyIdentifier",
                            format: "#'##0,00",
                        },
                    },
                ],
            },
        ]);
    });
});
