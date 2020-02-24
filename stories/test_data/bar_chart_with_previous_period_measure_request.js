// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "m1.pp1",
                        alias: "Primary measure - period ago",
                        definition: {
                            previousPeriodMeasure: {
                                measureIdentifier: "m1",
                                dateDataSets: [
                                    {
                                        dataSet: {
                                            uri: "/gdc/md/" + projectId + "/obj/330",
                                        },
                                        periodsAgo: 1,
                                    },
                                ],
                            },
                        },
                    },
                    {
                        localIdentifier: "m1",
                        alias: "Primary measure",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                                filters: [
                                    {
                                        positiveAttributeFilter: {
                                            displayForm: {
                                                uri: "/gdc/md/" + projectId + "/obj/970",
                                            },
                                            in: ["/gdc/md/" + projectId + "/obj/969/elements?id=958077"],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/324",
                        },
                        localIdentifier: "a1",
                    },
                ],
                filters: [
                    {
                        absoluteDateFilter: {
                            dataSet: {
                                uri: "/gdc/md/" + projectId + "/obj/330",
                            },
                            from: "2011-01-01",
                            to: "2011-12-31",
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
                        itemIdentifiers: ["a1"],
                    },
                ],
                sorts: [],
            },
        },
    };
};
