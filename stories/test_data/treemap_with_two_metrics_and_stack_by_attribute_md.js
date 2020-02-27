// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        buckets: [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "amountMetric",
                        title: "Amount",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                    },
                    {
                        measure: {
                            localIdentifier: "5a9402a04445430880fd1c8b6d846164",
                            title: "# of Activities",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/14636",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "segment",
                items: [
                    {
                        visualizationAttribute: {
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/1027",
                            },
                            localIdentifier: "departmentAttribute",
                        },
                    },
                ],
            },
        ],
    };
};
