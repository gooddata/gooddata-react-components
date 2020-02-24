// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [["58427629.5", "21978695.46"], ["6038400.96", "30180730.62"]],
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Amount",
                                order: 0,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "# of Open Opps.",
                                order: 1,
                            },
                        },
                    ],
                ],
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "Direct Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1226",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Inside Sales",
                                uri: "/gdc/md/" + projectId + "/obj/1027/elements?id=1234",
                            },
                        },
                    ],
                ],
            ],
            paging: {
                count: [2, 2],
                offset: [0, 0],
                total: [2, 2],
            },
        },
    };
};
