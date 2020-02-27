// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "33bd337ed5534fd383861f11ff657b23",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1144",
                                },
                            },
                        },
                        alias: "Amount",
                    },
                    {
                        localIdentifier: "88291f6f6fef47a7b9c5ad709af2b45b",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/13465",
                                },
                            },
                        },
                        alias: "# of Open Opps.",
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
