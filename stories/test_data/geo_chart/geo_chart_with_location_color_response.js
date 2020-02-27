// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/172aab3ad62a2c3acb5da80b4a7dd602?dimensions=2",
            },
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            identifier: "21",
                                            uri: "/gdc/md/" + projectId + "/obj/21",
                                            localIdentifier: "color",
                                            format: "#,##0.00",
                                            name: "Color",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    headers: [
                        {
                            attributeHeader: {
                                identifier: "30.df",
                                uri: "/gdc/md/" + projectId + "/obj/30.df",
                                name: "City",
                                localIdentifier: "location",
                                formOf: {
                                    uri: "/gdc/md/" + projectId + "/obj/30",
                                    identifier: "30",
                                    name: "City",
                                },
                            },
                        },
                    ],
                },
            ],
        },
    };
};
