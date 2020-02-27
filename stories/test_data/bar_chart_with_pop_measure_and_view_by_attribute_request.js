// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/158",
                        },
                        localIdentifier: "yearCreatedAttribute",
                    },
                ],
                measures: [
                    {
                        localIdentifier: "amountPopMeasure",
                        definition: {
                            popMeasure: {
                                measureIdentifier: "amountMeasure",
                                popAttribute: {
                                    uri: "/gdc/md/" + projectId + "/obj/157",
                                },
                            },
                        },
                        alias: "Amount previous year",
                    },
                    {
                        localIdentifier: "amountMeasure",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                        alias: "Amount current year",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["yearCreatedAttribute"],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
            },
        },
    };
};
