// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "amountMetric",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                        alias: "Amount",
                    },
                    {
                        localIdentifier: "5a9402a04445430880fd1c8b6d846164",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/14636",
                                },
                            },
                        },
                        alias: "# of Activities",
                    },
                    {
                        localIdentifier: "889402a04445430880fd1c8b6d846164",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1284",
                                },
                            },
                        },
                        alias: "Won",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: [],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
                sorts: [],
            },
        },
    };
};
