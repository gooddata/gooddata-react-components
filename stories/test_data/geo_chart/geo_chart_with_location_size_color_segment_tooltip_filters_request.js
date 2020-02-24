// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "size",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/20",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "color",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/21",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/30.df",
                        },
                        localIdentifier: "location",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/23.df",
                        },
                        localIdentifier: "segmentBy",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/24.df",
                        },
                        localIdentifier: "tooltip",
                    },
                ],
                filters: [
                    {
                        positiveAttributeFilter: {
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/30.df",
                            },
                            in: {
                                uris: [
                                    "/gdc/md/" + projectId + "/obj/694/elements?id=1808",
                                    "/gdc/md/" + projectId + "/obj/694/elements?id=1903",
                                    "/gdc/md/" + projectId + "/obj/694/elements?id=1870",
                                    "/gdc/md/" + projectId + "/obj/694/elements?id=1895",
                                ],
                            },
                        },
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                    {
                        itemIdentifiers: ["location", "segmentBy", "tooltip"],
                    },
                ],
            },
        },
    };
};
