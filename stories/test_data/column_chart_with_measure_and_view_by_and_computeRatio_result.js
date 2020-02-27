// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [
                [
                    "0.233421591200058",
                    "0.196757175926936",
                    "0.330941425697762",
                    "0.0689560594966825",
                    "0.0816790621242528",
                    "0.0882446855543087",
                ],
            ],
            paging: { count: [1, 6], offset: [0, 0], total: [1, 6] },
            headerItems: [
                [[{ measureHeaderItem: { name: "% Amount", order: 0 } }]],
                [
                    [
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
                                name: "Explorer",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=169655",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Grammar Plus",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=168284",
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
                                name: "WonderKid",
                                uri: "/gdc/md/" + projectId + "/obj/949/elements?id=965523",
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
