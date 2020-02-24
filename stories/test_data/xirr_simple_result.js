// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: ["-123400", "36200", "54800", "48100"],
            paging: {
                count: [4],
                offset: [0],
                total: [4],
            },
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Sum of Cashflow",
                                order: 0,
                            },
                        },
                    ],
                    [
                        {
                            attributeHeaderItem: {
                                name: "2018",
                                uri: "/gdc/md/" + projectId + "/obj/11/elements?id=2018",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2019",
                                uri: "/gdc/md/" + projectId + "/obj/11/elements?id=2019",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2020",
                                uri: "/gdc/md/" + projectId + "/obj/11/elements?id=2020",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2021",
                                uri: "/gdc/md/" + projectId + "/obj/11/elements?id=2021",
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
