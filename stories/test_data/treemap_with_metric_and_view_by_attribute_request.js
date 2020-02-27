// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                        localIdentifier: "amountMetric",
                        format: "#,##0.00",
                        alias: "Amount",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1027",
                        },
                        localIdentifier: "departmentAttribute",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                    {
                        itemIdentifiers: ["departmentAttribute"],
                    },
                ],
            },
        },
    };
};
