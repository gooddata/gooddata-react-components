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
                                            localIdentifier: "m2",
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
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/7603215962270694400?c=b7f51bae44a49da46978348ee18f05d6&q=eAGlkl1PwjAUhv9KU7xc2IcMNxJjMFHDjRKVq2UXZe3IoF2xHxIg%2B%2B%2BeAmLAC4O7adrT9pz3PefZ%0AYsWWUplnIhge4EltKsMZxR4uJLei1niQbTExRlVTa9i7u4V3YyWpLQw801YIotYQgwOt9JKT9aNU%0AYkQh5M9o4Qvq07JefG4%2BSD%2B5FpuwiNJqThdrqrSkIlnNV76czv00jiDFlGj2wJlgtZm8ji7O0Ut9%0Atv%2Bt7yp6Cwl3hk4kH938Q2MvdSmlIdx1Jsu9LM8bb9vOeZgEcWvrYZDG595bOHXpQJMGNvAA%2FJVu%0Ataq6dCLgrY%2Bb5gyUo7BvoN4MmTG0o%2FBnZKfBs6bnHhYMsCz2iJbAHAGp%2BKrjdTpBNwic%2BiOcQwR7%0AJEtEOEeUwfg8pNiMKMqZ1u5C7xRI5TbG6q6b84H2oZC2drDvC16OTRjdpNhh8ofKXzVRdv8yzltU%0AjpI4wQ30SsmVa9TBwpOSdonz5gslzlgS%0A&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
