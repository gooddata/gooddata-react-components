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
                localIdentifier: "segment",
                items: [],
            },
        ],
    };
};
