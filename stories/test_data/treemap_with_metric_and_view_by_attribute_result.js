// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [["80406324.96", "36219131.58"]],
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Amount",
                                order: 0,
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
                count: [1, 2],
                offset: [0, 0],
                total: [1, 2],
            },
        },
    };
};
