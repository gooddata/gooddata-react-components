// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "Sum of Cashflow",
                                            format: "#,##0.00%",
                                            localIdentifier: "m_1",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Year (Date Financial Operational Date)",
                                localIdentifier: "a_1",
                                uri: "/gdc/md/" + projectId + "/obj/10",
                                identifier: "date_financial_operational_date.aag81lMifn6q",
                                formOf: {
                                    name: "Year (Date Financial Operational Date)",
                                    uri: "/gdc/md/" + projectId + "/obj/11",
                                    identifier: "date_financial_operational_date.year",
                                },
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/7571149223380679680?c=4c539427fff910057fbb83fd379b06ff&q=eAGdkk1LAzEQQP9KSC8Ki6lVdteCiFgrPahg7UGkh9lkaqP5WLIJZSn9706qBa%2F1NpOZ9zJhsuUB%0AWx%2FiE1jkY75wUUeDihdcepOs6%2Fj4fVlwizFomZMtX%2FlgIVLzoBgMhmfDITXvKTqaJ8v8it1Bt14Z%0Av%2BE7YoPfZPDX8RB8anmx5Up3rYF%2BSraZIlR8KCmsErZJyfaXVdlWdd9IiTqk8nwt%2B1Dr2vha%2BOZT%0AXF2UI7q2gQ7vDVp0cfEyO14yqgT%2B4N2NVtdkhEgPbVLE%2F8w0qsiggjZm4jduHrG9Pegm0%2BOnK7Ou%0Ao%2BUQ2n7lOFkLoaf00bu4ZuAUe0MIf%2Bd%2Bzfs7dIhcZScTiMim2oGTGgx7bjFA1N5RnEunxB8WuBcf%0AgfkIZv9HdsvdN%2FdGxZQ%3D%0A&offset=0%2C0&limit=1000%2C1000&dimensions=1&totals=0",
            },
        },
    };
};
