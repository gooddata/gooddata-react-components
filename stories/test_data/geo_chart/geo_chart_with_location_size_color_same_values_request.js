// (C) 2020 GoodData Corporation

module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "size_same_values",
                        definition: {
                            measure: {
                                item: {
                                    uri: `/gdc/md/${projectId}/obj/22`,
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "color_same_values",
                        definition: {
                            measure: {
                                item: {
                                    uri: `/gdc/md/${projectId}/obj/23`,
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: `/gdc/md/${projectId}/obj/30.df`,
                        },
                        localIdentifier: "location",
                    },
                    {
                        displayForm: {
                            uri: `/gdc/md/${projectId}/obj/24.df`,
                        },
                        localIdentifier: "tooltip",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                    {
                        itemIdentifiers: ["location", "tooltip"],
                    },
                ],
            },
        },
    };
};
