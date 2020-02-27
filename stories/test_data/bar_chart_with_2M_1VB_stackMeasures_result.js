// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [
                ["38596194.86", "27222899.64", "22946895.47", "10291576.74", "9525857.91", "8042031.92"],
                ["1225574.49", "1526088.14", "1407310.36", "670355.28", "137605.43", "167463.95"],
            ],
            paging: { count: [2, 6], offset: [0, 0], total: [2, 6] },
            headerItems: [
                [
                    [
                        { measureHeaderItem: { name: "Amount", order: 0 } },
                        { measureHeaderItem: { name: "Amount [BOP]", order: 1 } },
                    ],
                ],
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "Explorer",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=169655",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "CompuSci",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=168279",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Educationly",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=168282",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "WonderKid",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=965523",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "PhoenixSoft",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=964771",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Grammar Plus",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=168284",
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
