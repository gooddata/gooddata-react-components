// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [["24000", null], [null, "7200"]],
            paging: {
                count: [2, 2],
                offset: [0, 0],
                total: [2, 2],
            },
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Primary measure - period ago",
                                order: 0,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "Primary measure",
                                order: 1,
                            },
                        },
                    ],
                ],
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "2010",
                                uri: "/gdc/md/" + projectId + "/obj/323/elements?id=2010",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2011",
                                uri: "/gdc/md/" + projectId + "/obj/323/elements?id=2011",
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
