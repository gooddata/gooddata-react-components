// (C) 2019 GoodData Corporation
import { AFM } from "@gooddata/typings";

function createMeasure(id: number): AFM.IMeasure {
    return {
        definition: {
            measure: {
                item: {
                    uri: `/gdc/md/project/obj/${1278 + id}`,
                },
            },
        },
        localIdentifier: `m${id}`,
    };
}

function createAttribute(id: number): AFM.IAttribute {
    return {
        displayForm: {
            uri: `/gdc/md/project/obj/${1026 + id}`,
        },
        localIdentifier: `a${id}`,
    };
}

const withoutTotals: AFM.IExecution = {
    execution: {
        afm: {
            measures: [createMeasure(1), createMeasure(2)],
            attributes: [createAttribute(1)],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        },
    },
};

const withTotals: AFM.IExecution = {
    execution: {
        afm: {
            measures: [createMeasure(1), createMeasure(2)],
            attributes: [createAttribute(1)],
            nativeTotals: [
                {
                    measureIdentifier: "m2",
                    attributeIdentifiers: [],
                },
            ],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                    totals: [
                        {
                            measureIdentifier: "m1",
                            type: "sum",
                            attributeIdentifier: "a1",
                        },
                        {
                            measureIdentifier: "m2",
                            type: "sum",
                            attributeIdentifier: "a1",
                        },
                        {
                            measureIdentifier: "m1",
                            type: "avg",
                            attributeIdentifier: "a1",
                        },
                        {
                            measureIdentifier: "m2",
                            type: "nat",
                            attributeIdentifier: "a1",
                        },
                    ],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        },
    },
};

const oneMeasureTwoViews: AFM.IExecution = {
    execution: {
        afm: {
            measures: [createMeasure(1)],
            attributes: [createAttribute(1), createAttribute(2)],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["a1", "a2"],
                },
            ],
        },
    },
};

const oneMeasureTwoViewsStacked: AFM.IExecution = {
    execution: {
        afm: {
            measures: [createMeasure(1)],
            attributes: [createAttribute(1), createAttribute(2), createAttribute(3)],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["a3"],
                },
                {
                    itemIdentifiers: ["a1", "a2", "measureGroup"],
                },
            ],
        },
    },
};

const twoMeasuresTwoViews: AFM.IExecution = {
    execution: {
        afm: {
            measures: [createMeasure(1), createMeasure(2)],
            attributes: [createAttribute(1), createAttribute(2)],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["a1", "a2"],
                },
            ],
        },
    },
};

export const executionObjectMock = {
    oneMeasureTwoViews,
    oneMeasureTwoViewsStacked,
    twoMeasuresTwoViews,
    withTotals,
    withoutTotals,
};
