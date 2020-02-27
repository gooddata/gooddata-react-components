// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "amountMeasure",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                        alias: "Amount",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/952",
                        },
                        localIdentifier: "productAttribute",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1805",
                        },
                        localIdentifier: "stageNameAttribute",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["productAttribute"],
                    },
                    {
                        itemIdentifiers: ["stageNameAttribute", "measureGroup"],
                    },
                ],
                sorts: [],
            },
        },
    };
};
