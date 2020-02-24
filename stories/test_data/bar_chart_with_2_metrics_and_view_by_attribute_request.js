// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/158",
                        },
                        localIdentifier: "yearCreatedAttribute",
                    },
                ],
                measures: [
                    {
                        alias: "Lost",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1283",
                                },
                            },
                        },
                        format: "#,##0.00",
                        localIdentifier: "lostMetric",
                    },
                    {
                        alias: "Won",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1284",
                                },
                            },
                        },
                        format: "#,##0.00",
                        localIdentifier: "wonMetric",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["yearCreatedAttribute"],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
            },
        },
    };
};
