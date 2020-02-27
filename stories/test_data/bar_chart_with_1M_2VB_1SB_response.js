// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Region",
                                localIdentifier: "a3",
                                uri: "/gdc/md/" + projectId + "/obj/6.df",
                                identifier: "label.owner.region",
                                formOf: {
                                    name: "Region",
                                    uri: "/gdc/md/" + projectId + "/obj/1023",
                                    identifier: "attr.owner.region",
                                },
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
                        {
                            attributeHeader: {
                                name: "Stage Name",
                                localIdentifier: "a2",
                                uri: "/gdc/md/" + projectId + "/obj/5.df",
                                identifier: "label.stage.name.stagename",
                                formOf: {
                                    name: "Stage Name",
                                    uri: "/gdc/md/" + projectId + "/obj/1095",
                                    identifier: "attr.stage.name",
                                },
                            },
                        },
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
                                ],
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/8309397244913908736?c=a69620847e8de7b4b1382396e3c24e81&q=eAGlk0lvwjAQhf9KZHqMyMJSglRVHNqKS1XRckI5mNiJDHZMvRQByn%2FvmCVVkHqAXCIvyct7M98c%0AkKIbqcw7FhSN0bw0zHBKkI8yya0oNRovDggbo9jSGvrlbuG9DyWJzQy8pq0QWO3gDDaE6Q3Hu1ep%0AxJTAUVCQLBAkIHm5%2Ftl%2F4%2BGoJ%2FZRFidsRdY7orQkYrRdbQO5XAXJIAaJJdb0hVNBSzOfTW%2FW6CcB%0APX2tnxl5AsFjoIblOs0dHvuJk5QGc1eZRZpW%2FqFd7GgUDlrnjsJkcB28RUwnB540gIHGkC93T6vY%0Are2AbENUVVeU1MYuNH0aXFDviOBfv5qHjYojQYHH7E1Ju0Gpf96eUM2BPQyu0UPH73TCbhi6IDWk%0AEw%2FWnsw9zLlHKLTR9xQtsCKcau0u9NGMVG5hrO66fp%2BpnwhpSwf96f%2B34xPFjwmqwLGS238ma0YL%0AJsuGZ9i0GqwojPug0W6yQKR3TdilLrXnurN3lAb0wWRjtNLqF%2BrZkf8%3D%0A&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
