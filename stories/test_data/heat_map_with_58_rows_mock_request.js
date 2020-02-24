// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m2",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/2",
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
                        localIdentifier: "country",
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
                        itemIdentifiers: ["country"],
                    },
                    {
                        itemIdentifiers: ["Popularity", "measureGroup"],
                    },
                ],
            },
        },
    };
};
