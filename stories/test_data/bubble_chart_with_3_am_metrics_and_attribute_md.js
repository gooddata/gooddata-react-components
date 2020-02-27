// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        buckets: [
            {
                localIdentifier: "measures",
                items: [
                    {
                        localIdentifier: "m1",
                        title: "M1",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/67097",
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "secondary_measures",
                items: [
                    {
                        localIdentifier: "am1",
                        definition: {
                            arithmeticMeasure: {
                                measureIdentifiers: ["m1", "m2"],
                                operator: "sum",
                            },
                        },
                        title: "M1 + M2",
                    },
                ],
            },
            {
                localIdentifier: "tertiary_measures",
                items: [
                    {
                        localIdentifier: "m2",
                        title: "M2",
                        definition: {
                            measureDefinition: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/13465",
                                },
                            },
                        },
                    },
                ],
            },
            {
                localIdentifier: "attribute",
                items: [
                    {
                        visualizationAttribute: {
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/1028",
                            },
                            localIdentifier: "49a659fbd7c541a69284769d53a2be7f",
                        },
                    },
                ],
            },
        ],
    };
};
