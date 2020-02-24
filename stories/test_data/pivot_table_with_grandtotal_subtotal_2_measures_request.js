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
                                    uri: "/gdc/md/" + projectId + "/obj/1144",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "m2",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1145",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1024",
                        },
                        localIdentifier: "a1",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1027",
                        },
                        localIdentifier: "a2",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["a1", "a2"],
                        totals: [
                            {
                                measureIdentifier: "m1",
                                type: "sum",
                                attributeIdentifier: "a1",
                            },
                            {
                                measureIdentifier: "m2",
                                type: "sum",
                                attributeIdentifier: "a2",
                            },
                        ],
                    },
                    { itemIdentifiers: ["measureGroup"] },
                ],
            },
        },
    };
};
