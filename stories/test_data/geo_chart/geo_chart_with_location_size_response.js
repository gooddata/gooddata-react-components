// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/df59ebe56e0129092490c76da9cb4409?dimensions=2",
            },
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            identifier: "20",
                                            uri: "/gdc/md/" + projectId + "/obj/20",
                                            localIdentifier: "size",
                                            format: "#,##0.00",
                                            name: "Size",
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
