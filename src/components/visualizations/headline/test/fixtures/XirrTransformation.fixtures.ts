// (C) 2019 GoodData Corporation
import { AFM } from "@gooddata/typings";

export const MEASURE_URI = "/gdc/md/project_id/obj/5";

export const BASIC_EXECUTION_REQUEST: AFM.IExecution["execution"] = {
    afm: {
        measures: [
            {
                localIdentifier: "m_1",
                definition: {
                    measure: {
                        item: {
                            uri: MEASURE_URI,
                        },
                        aggregation: "sum",
                    },
                },
                alias: "Sum of Cashflow",
                format: "#,##0.00",
            },
        ],
        attributes: [
            {
                displayForm: {
                    uri: "/gdc/md/project_id/obj/10",
                },
                localIdentifier: "a_1",
            },
        ],
    },
    resultSpec: {
        dimensions: [
            {
                itemIdentifiers: ["measureGroup", "a_1"],
            },
        ],
    },
};

export const BASIC_EXECUTION_RESPONSE = {
    dimensions: [
        {
            headers: [
                {
                    measureGroupHeader: {
                        items: [
                            {
                                measureHeaderItem: {
                                    name: "Sum of Cashflow",
                                    format: "#,##0.00",
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
                        uri: "/gdc/md/project_id/obj/10",
                        identifier: "date_financial_operational_date.aag81lMifn6q",
                        formOf: {
                            name: "Year (Date Financial Operational Date)",
                            uri: "/gdc/md/project_id/obj/11",
                            identifier: "date_financial_operational_date.year",
                        },
                    },
                },
            ],
        },
    ],
    links: {
        executionResult: "/gdc/app/projects/project_id/executionResults/foo",
    },
};

export const BASIC_EXECUTION_RESULT = {
    data: ["-123400", "36200", "54800", "48100"],
    paging: {
        count: [4],
        offset: [0],
        total: [4],
    },
    headerItems: [
        [
            [
                {
                    measureHeaderItem: {
                        name: "Sum of Cashflow",
                        order: 0,
                    },
                },
            ],
            [
                {
                    attributeHeaderItem: {
                        name: "2018",
                        uri: "/gdc/md/project_id/obj/11/elements?id=2018",
                    },
                },
                {
                    attributeHeaderItem: {
                        name: "2019",
                        uri: "/gdc/md/project_id/obj/11/elements?id=2019",
                    },
                },
                {
                    attributeHeaderItem: {
                        name: "2020",
                        uri: "/gdc/md/project_id/obj/11/elements?id=2020",
                    },
                },
                {
                    attributeHeaderItem: {
                        name: "2021",
                        uri: "/gdc/md/project_id/obj/11/elements?id=2021",
                    },
                },
            ],
        ],
    ],
};

export const DRILL_EVENT_DATA = {
    drillContext: {
        element: "primaryValue",
        intersection: [
            {
                header: {
                    identifier: "",
                    uri: MEASURE_URI,
                },
                id: "m_1",
                title: "Sum of Cashflow",
            },
        ],
        type: "xirr",
        value: "0.05958953474733984",
    },
    executionContext: {
        attributes: [{ displayForm: { uri: "/gdc/md/project_id/obj/10" }, localIdentifier: "a_1" }],
        measures: [
            {
                alias: "Sum of Cashflow",
                definition: {
                    measure: {
                        aggregation: "sum",
                        item: {
                            uri: MEASURE_URI,
                        },
                    },
                },
                format: "#,##0.00",
                localIdentifier: "m_1",
            },
        ],
    },
};
