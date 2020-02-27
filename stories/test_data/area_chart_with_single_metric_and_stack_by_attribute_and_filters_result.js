// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [["33920"]],
            paging: {
                count: [1, 1],
                offset: [0, 0],
                total: [1, 1],
            },
            headerItems: [
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "Email",
                                uri: "/gdc/md/" + projectId + "/obj/1251/elements?id=169663",
                            },
                        },
                    ],
                ],
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "# of Activities",
                                order: 0,
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
