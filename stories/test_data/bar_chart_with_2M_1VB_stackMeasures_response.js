// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "Amount",
                                            format: "$#,##0.00",
                                            localIdentifier: "m1",
                                            uri: "/gdc/md/" + projectId + "/obj/1",
                                            identifier: "ah1EuQxwaCqs",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "Amount [BOP]",
                                            format: "$#,##0.00",
                                            localIdentifier: "c85bc0e35ef04744ae33a15363877f0d",
                                            uri: "/gdc/md/" + projectId + "/obj/2",
                                            identifier: "aagV61RmaPTt",
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
                                name: "Product Name",
                                localIdentifier: "a1",
                                uri: "/gdc/md/" + projectId + "/obj/4.df",
                                identifier: "label.product.id.name",
                                formOf: {
                                    name: "Product",
                                    uri: "/gdc/md/" + projectId + "/obj/949",
                                    identifier: "attr.product.id",
                                },
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/4302218125462863360?c=28fab5c4289c36a1ad128c737395d840&q=eAGlkE1PwkAQhv%2FKZvHYUKigLYkxmKjhosTIqelh6Uybwm4X90MChP%2FuLBg%2F4sGgt9mdmfed99lx%0Agytt3INQyEd81rrGSQQe8VJLr1rLR%2FmOC%2BdMM%2FcOn0OX5qZGgy8djVmvlDAb%2BqMHNHYlxeZOGzUB%0A%2BoprKGMFMVTt8nX7Ii7Sc7Xtl0nWLGC5AWM1qHS9WMd6voizYUISc2HxVqLC1s2eJidrDLIYj9v2%0AuoErEjwE%2BnbyR5o%2F3DjIgqR2QgYyeRHlRbEvIq6QCJVHWhXFF44szzpRp9Pr9nq088lpzKhmumJC%0ASgZIShEzWAsDEq0NDetEjUybUDhvu19SjJX2beB%2BNDw9QT%2B5zPg%2B2vFfrvzhyfKbx2nxD%2BckHaY8%0AsDJ6HUC9R7g32q94sX8DkYHZxQ%3D%3D%0A&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
