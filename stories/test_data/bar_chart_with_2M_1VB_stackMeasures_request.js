// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1",
                        definition: {
                            measure: { item: { uri: "/gdc/md/" + projectId + "/obj/1" } },
                        },
                        alias: "Amount",
                    },
                    {
                        localIdentifier: "c85bc0e35ef04744ae33a15363877f0d",
                        definition: {
                            measure: { item: { uri: "/gdc/md/" + projectId + "/obj/2" } },
                        },
                        alias: "Amount [BOP]",
                    },
                ],
                attributes: [
                    {
                        displayForm: { uri: "/gdc/md/" + projectId + "/obj/4.df" },
                        localIdentifier: "a1",
                    },
                ],
            },
            resultSpec: {
                dimensions: [{ itemIdentifiers: ["measureGroup"] }, { itemIdentifiers: ["a1"] }],
                sorts: [
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a1",
                            direction: "desc",
                            aggregation: "sum",
                        },
                    },
                ],
            },
        },
    };
};
