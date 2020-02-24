// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "amount",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/3.df",
                        },
                        localIdentifier: "60countries",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/5.df",
                        },
                        localIdentifier: "Popularity",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["60countries"],
                    },
                    {
                        itemIdentifiers: ["Popularity", "measureGroup"],
                    },
                ],
            },
        },
    };
};
