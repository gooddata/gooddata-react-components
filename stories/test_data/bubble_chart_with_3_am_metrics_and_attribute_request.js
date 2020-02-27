// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1",
                        alias: "M1",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/67097",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "m2",
                        alias: "M2",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/13465",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "am1",
                        definition: {
                            arithmeticMeasure: {
                                measureIdentifiers: ["m1", "m2"],
                                operator: "sum",
                            },
                        },
                        alias: "M1 + M2",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1028",
                        },
                        localIdentifier: "49a659fbd7c541a69284769d53a2be7f",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["49a659fbd7c541a69284769d53a2be7f"],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
                sorts: [],
            },
        },
    };
};
