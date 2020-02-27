// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        buckets: [
            {
                localIdentifier: "measures",
                items: [
                    {
                        measure: {
                            localIdentifier: "lostMetric",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/1283",
                                    },
                                },
                            },
                            title: "Lost",
                        },
                    },
                    {
                        measure: {
                            localIdentifier: "wonMetric",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/1284",
                                    },
                                },
                            },
                            title: "Won",
                        },
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        measure: {
                            localIdentifier: "expectedMetric",
                            definition: {
                                measureDefinition: {
                                    item: {
                                        uri: "/gdc/md/" + projectId + "/obj/1285",
                                    },
                                },
                            },
                            title: "Expected",
                        },
                    },
                ],
            },
            {
                localIdentifier: "view",
                items: [
                    {
                        visualizationAttribute: {
                            localIdentifier: "yearCreatedAttribute",
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/158",
                            },
                        },
                    },
                ],
            },
        ],
        visualizationClass: {
            uri: "/gdc/md/" + projectId + "/obj/76038",
        },
    };
};
