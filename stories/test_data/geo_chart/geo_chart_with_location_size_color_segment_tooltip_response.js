// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/192aab3ad62a2c3acb5da80b4a7dd602?dimensions=2",
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
                        {
                            attributeHeader: {
                                identifier: "23.df",
                                uri: "/gdc/md/" + projectId + "/obj/23.df",
                                name: "Store Type",
                                localIdentifier: "segmentBy",
                                formOf: {
                                    uri: "/gdc/md/" + projectId + "/obj/23",
                                    identifier: "23",
                                    name: "Store Type",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                identifier: "24.df",
                                uri: "/gdc/md/" + projectId + "/obj/24.df",
                                name: "Tooltip",
                                localIdentifier: "tooltip",
                                formOf: {
                                    uri: "/gdc/md/" + projectId + "/obj/24",
                                    identifier: "24",
                                    name: "Tooltip",
                                },
                            },
                        },
                    ],
                },
            ],
        },
    };
};
