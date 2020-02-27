// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1283",
                                },
                            },
                        },
                        localIdentifier: "lostMetric",
                        format: "#,##0.00",
                        alias: "Lost",
                    },
                    {
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1284",
                                },
                            },
                        },
                        localIdentifier: "wonMetric",
                        format: "#,##0.00",
                        alias: "Won",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
            },
        },
    };
};
