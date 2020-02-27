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
                ],
            },
            {
                localIdentifier: "view",
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
            {
                localIdentifier: "segment",
                items: [
                    {
                        visualizationAttribute: {
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/1024",
                            },
                            localIdentifier: "regionAttribute",
                        },
                    },
                ],
            },
        ],
    };
};
