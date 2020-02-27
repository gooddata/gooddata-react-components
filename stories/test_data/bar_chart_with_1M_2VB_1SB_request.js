// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1",
                        definition: { measure: { item: { uri: "/gdc/md/" + projectId + "/obj/1" } } },
                        alias: "Amount",
                    },
                ],
                attributes: [
                    { displayForm: { uri: "/gdc/md/" + projectId + "/obj/4.df" }, localIdentifier: "a1" },
                    { displayForm: { uri: "/gdc/md/" + projectId + "/obj/5.df" }, localIdentifier: "a2" },
                    { displayForm: { uri: "/gdc/md/" + projectId + "/obj/6.df" }, localIdentifier: "a3" },
                ],
            },
            resultSpec: {
                dimensions: [{ itemIdentifiers: ["a3"] }, { itemIdentifiers: ["a1", "a2", "measureGroup"] }],
                sorts: [
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a1",
                            direction: "desc",
                            aggregation: "sum",
                        },
                    },
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a2",
                            direction: "desc",
                            aggregation: "sum",
                        },
                    },
                ],
            },
        },
    };
};
