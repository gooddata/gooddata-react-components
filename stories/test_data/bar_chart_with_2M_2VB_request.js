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
                    {
                        localIdentifier: "m2",
                        definition: { measure: { item: { uri: "/gdc/md/" + projectId + "/obj/2" } } },
                        alias: "Amount [BOP]",
                    },
                ],
                attributes: [
                    { displayForm: { uri: "/gdc/md/" + projectId + "/obj/4.df" }, localIdentifier: "a1" },
                    { displayForm: { uri: "/gdc/md/" + projectId + "/obj/5.df" }, localIdentifier: "a2" },
                ],
            },
            resultSpec: {
                dimensions: [{ itemIdentifiers: ["measureGroup"] }, { itemIdentifiers: ["a1", "a2"] }],
                sorts: [
                    {
                        attributeSortItem: {
                            attributeIdentifier: "a1",
                            direction: "desc",
                            aggregation: "sum",
                        },
                    },
                    {
                        measureSortItem: {
                            direction: "desc",
                            locators: [{ measureLocatorItem: { measureIdentifier: "m1" } }],
                        },
                    },
                ],
            },
        },
    };
};
