// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m_1",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/5",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/a1.df",
                        },
                        localIdentifier: "a_1",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/a2.df",
                        },
                        localIdentifier: "a_2",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                    {
                        itemIdentifiers: [],
                    },
                ],
            },
        },
    };
};
