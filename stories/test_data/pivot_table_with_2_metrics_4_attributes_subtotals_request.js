// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/9211",
                                },
                            },
                        },
                        alias: "m1",
                    },
                    {
                        localIdentifier: "m2",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/9203",
                                },
                            },
                        },
                        alias: "m2",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1027",
                        },
                        localIdentifier: "a1",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/64727",
                        },
                        localIdentifier: "a2",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1024",
                        },
                        localIdentifier: "a3",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1094",
                        },
                        localIdentifier: "a4",
                    },
                ],
                nativeTotals: [
                    {
                        measureIdentifier: "m1",
                        attributeIdentifiers: ["a1"],
                    },
                    {
                        measureIdentifier: "m1",
                        attributeIdentifiers: ["a1", "a2", "a3"],
                    },
                    {
                        measureIdentifier: "m2",
                        attributeIdentifiers: ["a1", "a2", "a3"],
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["a1", "a2", "a3", "a4"],
                        totals: [
                            {
                                measureIdentifier: "m1",
                                type: "sum",
                                attributeIdentifier: "a1",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "max",
                                attributeIdentifier: "a1",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "nat",
                                attributeIdentifier: "a2",
                            },
                            {
                                measureIdentifier: "m1",
                                type: "nat",
                                attributeIdentifier: "a4",
                            },
                            {
                                measureIdentifier: "m2",
                                type: "nat",
                                attributeIdentifier: "a4",
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
};
