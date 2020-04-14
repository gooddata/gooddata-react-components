// (C) 2007-2020 GoodData Corporation
import { ApiExecutionResponseError, ApiResponseError } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";
import { MEASUREGROUP } from "../../constants/dimensions";

const emptyResponseWithNull: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            // tslint:disable-next-line:max-line-length
            executionResult:
                "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/2651138797087227392",
        },
    },
    executionResult: null,
};

const emptyResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            // tslint:disable-next-line:max-line-length
            executionResult:
                "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/2651138797087227392",
        },
    },
    executionResult: {
        data: [],
        paging: {
            count: [0, 0],
            offset: [0, 0],
            total: [0, 0],
        },
    },
};

const emptyResponseWithNullData: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            // tslint:disable-next-line:max-line-length
            executionResult:
                "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/2651138797087227392",
        },
    },
    executionResult: {
        data: [null],
        paging: {
            count: [1],
            offset: [0],
            total: [1],
        },
    },
};

const attributeOnlyResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            name: "Activity Type",
                            localIdentifier: "7db11218-2497-4c0d-ae3d-e746150ff259",
                            uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1252",
                            identifier: "label.activity.activitytype",
                            formOf: {
                                name: "Activity Type",
                                uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1251",
                                identifier: "attr.activity.activitytype",
                            },
                        },
                    },
                ],
            },
            {
                headers: [],
            },
        ],
        links: {
            executionResult:
                "/gdc/app/projects/iv700nz0qecyidsh6kakoxo5fmk8o9cs/executionResults/4863872856674434048" +
                "?q=eAGdkbFOwzAQhl8Fea7kJFILREKIAaQuHaAVA%2Brg2Nf2iB0H%2B1IIUd6dSxvBQpdsPtv36b%2FvOhGg%0" +
                "A9oFWyoHIxaYiJAtGzIT2tnHVKxo6RJG%2FbWdih5YgjEXwn8OpE4ooYNEQrIdOZjxowiNSe7Vua2BQ%0AbJxTo" +
                "eUXLgzG2qr2yQe3NHwl90ZLZyQer5Ok%2Bk4%2BQLdo4mFRqtJ%2F%2BfnOlTf%2BVkfpi3eZZvOMGYWK%0A8Gj" +
                "BQUWb5%2BUESCrh3B7v0dwx8TT0P9F%2FZ5uUNR3InpQ9KevZYGTTIu9GtxdNvozfDAZgmb7iaCpq%0AxjUBJ8y" +
                "ib7f9rxAtq44gNgH%2FFvxGMMB71Gfo%2F4ALEO1%2Fg%3D%3D%0A&c=58db8bd401cd8f37900b01e46aec7d0" +
                "0&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
        },
    },
    executionResult: {
        data: [],
        paging: {
            count: [4, 0],
            offset: [0, 0],
            total: [4, 1],
        },
        headerItems: [
            [
                [
                    {
                        attributeHeaderItem: {
                            name: "Email",
                            uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1251/elements?id=169663",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "In Person Meeting",
                            uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1251/elements?id=169661",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Phone Call",
                            uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1251/elements?id=169658",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "Web Meeting",
                            uri: "/gdc/md/iv700nz0qecyidsh6kakoxo5fmk8o9cs/obj/1251/elements?id=169666",
                        },
                    },
                ],
            ],
            [],
        ],
    },
};

const tooLargeResponse: ApiResponseError = {
    name: "Error 413",
    message: "Response is too large",
    cause: null,
    response: {
        status: 413,
        body: null as ReadableStream | null, // tslint:disable-line
        bodyUsed: false,
        headers: null,
        ok: true,
        statusText: "",
        type: "error",
        url: "",
        json: jest.fn(() => {
            return Promise.resolve(null);
        }),
        text: jest.fn(() => {
            return Promise.resolve("");
        }),
        clone: jest.fn(),
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
    },
    responseBody: "",
};

const enrichedErrorResponse: ApiExecutionResponseError = {
    ...tooLargeResponse,
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        localIdentifier: "id:a",
                                        name: "a",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    },
};

const badRequestResponse: ApiResponseError = {
    name: "Error 400",
    message: "Bad request",
    cause: null,
    response: {
        status: 400,
        body: null as ReadableStream | null, // tslint:disable-line
        bodyUsed: false,
        headers: null,
        ok: true,
        statusText: "",
        type: "error",
        url: "",
        json: jest.fn(() => {
            return Promise.resolve(null);
        }),
        text: jest.fn(() => {
            return Promise.resolve("");
        }),
        clone: jest.fn(),
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
    },
    responseBody: "",
};

const oneMeasureAfm: AFM.IAfm = {
    measures: [
        {
            localIdentifier: "1st_measure_local_identifier",
            definition: {
                measure: {
                    item: {
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                    },
                },
            },
        },
    ],
};

const twoMeasuresAfm: AFM.IAfm = {
    measures: [
        ...oneMeasureAfm.measures,
        {
            localIdentifier: "2nd_measure_local_identifier",
            definition: {
                measure: {
                    item: {
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1284",
                    },
                },
            },
        },
    ],
};

const oneAttributeAfm: AFM.IAfm = {
    attributes: [
        {
            displayForm: { uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1027" },
            localIdentifier: "a1",
        },
    ],
};

const executionObjectWithTotals: AFM.IExecution = {
    execution: {
        afm: {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                            },
                        },
                    },
                },
                {
                    localIdentifier: "m2",
                    definition: {
                        measure: {
                            item: {
                                uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                            },
                        },
                    },
                },
            ],
            attributes: [
                {
                    displayForm: {
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1027",
                    },
                    localIdentifier: "a1",
                },
            ],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                    totals: [
                        {
                            type: "sum",
                            measureIdentifier: "m1",
                            attributeIdentifier: "a1",
                        },
                        {
                            type: "sum",
                            measureIdentifier: "m2",
                            attributeIdentifier: "a1",
                        },
                        {
                            type: "avg",
                            measureIdentifier: "m1",
                            attributeIdentifier: "a1",
                        },
                    ],
                },
                {
                    itemIdentifiers: [MEASUREGROUP],
                },
            ],
        },
    },
};

const responseWithTotals: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            // tslint:disable-next-line:max-line-length
            executionResult:
                "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/2651138797087227392",
        },
    },
    executionResult: {
        data: [["42470571.16"]],
        paging: {
            count: [1, 1],
            offset: [0, 0],
            total: [1, 1],
        },
        headerItems: [[], []],
    },
};

const oneAttributeOneMeasureExecutionObject: AFM.IExecution = {
    execution: {
        afm: {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                uri: "/gdc/md/storybook/obj/1",
                            },
                        },
                    },
                },
            ],
            attributes: [
                {
                    displayForm: {
                        uri: "/gdc/md/storybook/obj/4.df",
                    },
                    localIdentifier: "a1",
                },
            ],
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        },
    },
};

const oneAttributeOneMeasureOneFilterExecutionObject: AFM.IExecution = {
    execution: {
        afm: {
            measures: [
                {
                    localIdentifier: "m1",
                    definition: {
                        measure: {
                            item: {
                                uri: "/gdc/md/storybook/obj/1",
                            },
                        },
                    },
                },
            ],
            attributes: [
                {
                    displayForm: {
                        uri: "/gdc/md/storybook/obj/4.df",
                    },
                    localIdentifier: "a1",
                },
            ],
            filters: [
                {
                    absoluteDateFilter: {
                        dataSet: {
                            uri: "/gdc/md/i6k6sk4sznefv1kf0f2ls7jf8tm5ida6/obj/330",
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
                    itemIdentifiers: ["a1"],
                },
                {
                    itemIdentifiers: ["measureGroup"],
                },
            ],
        },
    },
};

const oneAttributeOneMeasureSortByMeasureExecutionObject: AFM.IExecution = {
    execution: {
        afm: oneAttributeOneMeasureExecutionObject.execution.afm,
        resultSpec: {
            dimensions: oneAttributeOneMeasureExecutionObject.execution.resultSpec.dimensions,
            sorts: [
                {
                    measureSortItem: {
                        direction: "desc",
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
};

const oneAttributesOneMeasureResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            identifier: "4.df",
                            uri: "/gdc/md/storybook/obj/4.df",
                            name: "Colours",
                            localIdentifier: "a1",
                            formOf: {
                                uri: "/gdc/md/storybook/obj/4",
                                identifier: "4",
                                name: "Colours",
                            },
                        },
                    },
                ],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        identifier: "1",
                                        uri: "/gdc/md/storybook/obj/1",
                                        localIdentifier: "m1",
                                        format: "#,##0.00",
                                        name: "Amount",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult:
                "/gdc/app/projects/storybook/executionResults/59908ac5f1bf7a4fbbf78b08a7d034ed?dimensions=2",
        },
    },

    executionResult: {
        data: [
            ["678"],
            ["37"],
            ["928"],
            ["47"],
            ["958"],
            ["201"],
            ["416"],
            ["897"],
            ["278"],
            ["613"],
            ["864"],
            ["253"],
        ],
        headerItems: [
            [
                [
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                ],
            ],
            [
                [
                    {
                        measureHeaderItem: {
                            name: "Amount",
                            order: 0,
                        },
                    },
                ],
            ],
        ],
        paging: {
            count: [12, 1],
            offset: [0, 0],
            total: [12, 1],
        },
    },
};

const oneColumnAttributeNoMeasureResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [],
            },
            {
                headers: [
                    {
                        attributeHeader: {
                            identifier: "4.df",
                            uri: "/gdc/md/storybook/obj/4.df",
                            name: "Colours",
                            localIdentifier: "a1",
                            formOf: {
                                uri: "/gdc/md/storybook/obj/4",
                                identifier: "4",
                                name: "Colours",
                            },
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult:
                "/gdc/app/projects/storybook/executionResults/5dbb0787904d7cd284e2986fd3e30ffd?dimensions=2",
        },
    },

    executionResult: {
        data: [],
        headerItems: [
            [],
            [
                [
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=3",
                            name: "Purple",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=2",
                            name: "Red",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=4",
                            name: "Salmon",
                        },
                    },
                ],
            ],
        ],
        paging: {
            count: [0, 1000],
            offset: [0, 0],
            total: [1, 4846],
        },
    },
};

const oneMeasureResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            // tslint:disable-next-line:max-line-length
            executionResult:
                "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/2651138797087227392",
        },
    },
    executionResult: {
        data: [["42470571.16"]],
        paging: {
            count: [1, 1],
            offset: [0, 0],
            total: [1, 1],
        },
        headerItems: [[], []],
    },
};

const oneMeasureOneDimensionResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "foo",
        },
    },
    executionResult: {
        data: ["42470571.16"],
        paging: {
            count: [1],
            offset: [0],
            total: [1],
        },
        headerItems: [[]],
    },
};

const twoMeasuresOneDimensionResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "1st_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                                        identifier: "af2Ewj9Re2vK",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        name: "Lost",
                                        format: "$#,##0.00",
                                        localIdentifier: "2nd_measure_local_identifier",
                                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1284",
                                        identifier: "bgf2Ewj9Re2wL",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "foo",
        },
    },
    executionResult: {
        data: ["42470571.16", "12345678.90"],
        paging: {
            count: [2],
            offset: [0],
            total: [2],
        },
        headerItems: [[]],
    },
};

const locationSizeColorSegmentAfm: AFM.IAfm = {
    measures: [
        {
            localIdentifier: "m_size",
            definition: {
                measure: {
                    item: { uri: "/gdc/md/projectId/obj/4" },
                    aggregation: "sum",
                },
            },
        },
        {
            localIdentifier: "m_color",
            definition: {
                measure: {
                    item: { uri: "/gdc/md/projectId/obj/5" },
                    aggregation: "sum",
                },
            },
        },
    ],
    attributes: [
        {
            displayForm: { uri: "/gdc/md/projectId/obj/1" },
            localIdentifier: "a_location",
        },
        {
            displayForm: { uri: "/gdc/md/projectId/obj/2" },
            localIdentifier: "a_segmentBy",
        },
    ],
    filters: [],
};

const locationAfm: AFM.IAfm = {
    attributes: [
        {
            displayForm: { uri: "/gdc/md/projectId/obj/30.df" },
            localIdentifier: "location",
        },
    ],
};

const locationResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            name: "City",
                            localIdentifier: "location",
                            uri: "/gdc/md/projectId/obj/30.df",
                            identifier: "30.df",
                            formOf: {
                                name: "City",
                                uri: "/gdc/md/projectId/obj/30.df",
                                identifier: "30.df",
                            },
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "/gdc/app/projects/projectId/executionResults/8917638730922032128",
        },
    },
    executionResult: {
        data: [],
        paging: { count: [2, 2], offset: [0, 0], total: [2, 2] },
        headerItems: [
            [
                [
                    {
                        attributeHeaderItem: {
                            name: "42.627312;-78.73768",
                            uri: "/gdc/md/projectId/obj/79/elements?id=2207",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "43.345875;-73.40651",
                            uri: "/gdc/md/projectId/obj/79/elements?id=6559",
                        },
                    },
                ],
            ],
        ],
    },
};

const locationSizeColorSegmentResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Sum of dst",
                                        format: "#,##0.00",
                                        localIdentifier: "m_size",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        name: "Sum of value",
                                        format: "#,##0.00",
                                        localIdentifier: "m_color",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                headers: [
                    {
                        attributeHeader: {
                            name: "latlon",
                            localIdentifier: "a_location",
                            uri: "/gdc/md/projectId/obj/1",
                            identifier: "label.ziplatlong.latlon",
                            formOf: {
                                name: "GEO pushpin",
                                uri: "/gdc/md/projectId/obj/79",
                                identifier: "attr.ziplatlong.latlon",
                            },
                        },
                    },
                    {
                        attributeHeader: {
                            name: "state",
                            localIdentifier: "a_segmentBy",
                            uri: "/gdc/md/projectId/obj/2",
                            identifier: "label.ziplatlong.state",
                            formOf: {
                                name: "state",
                                uri: "/gdc/md/projectId/obj/71",
                                identifier: "attr.ziplatlong.state",
                            },
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "/gdc/app/projects/projectId/executionResults/8917638730922032128",
        },
    },
    executionResult: {
        data: [["54", "36"], ["39509", "84832"]],
        paging: { count: [2, 2], offset: [0, 0], total: [2, 2] },
        headerItems: [
            [
                [
                    { measureHeaderItem: { name: "Sum of dst", order: 0 } },
                    { measureHeaderItem: { name: "Sum of value", order: 1 } },
                ],
            ],
            [
                [
                    {
                        attributeHeaderItem: {
                            name: "42.627312;-78.73768",
                            uri: "/gdc/md/projectId/obj/79/elements?id=2207",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "43.345875;-73.40651",
                            uri: "/gdc/md/projectId/obj/79/elements?id=6559",
                        },
                    },
                ],
                [
                    {
                        attributeHeaderItem: {
                            name: "MA",
                            uri: "/gdc/md/projectId/obj/71/elements?id=722",
                        },
                    },
                    {
                        attributeHeaderItem: {
                            name: "CT",
                            uri: "/gdc/md/projectId/obj/71/elements?id=7644",
                        },
                    },
                ],
            ],
        ],
    },
};

const locationSizeColorSegmentFiltersAfm: AFM.IAfm = {
    measures: [
        {
            localIdentifier: "m_size",
            definition: {
                measure: {
                    item: { uri: "/gdc/md/projectId/obj/4" },
                    aggregation: "sum",
                },
            },
        },
        {
            localIdentifier: "m_color",
            definition: {
                measure: {
                    item: { uri: "/gdc/md/projectId/obj/5" },
                    aggregation: "sum",
                },
            },
        },
    ],
    attributes: [
        {
            displayForm: { uri: "/gdc/md/projectId/obj/1" },
            localIdentifier: "a_location",
        },
        {
            displayForm: { uri: "/gdc/md/projectId/obj/2" },
            localIdentifier: "a_segmentBy",
        },
    ],
    filters: [
        {
            positiveAttributeFilter: {
                displayForm: { uri: "/gdc/md/projectId/obj/2" },
                in: ["/gdc/md/projectId/obj/71/elements?id=7644", "/gdc/md/projectId/obj/71/elements?id=722"],
            },
        },
        {
            positiveAttributeFilter: {
                displayForm: { uri: "/gdc/md/projectId/obj/2" },
                in: ["/gdc/md/projectId/obj/71/elements?id=7644"],
            },
        },
    ],
};

const locationSizeColorSegmentFiltersResponse: Execution.IExecutionResponses = {
    executionResponse: {
        dimensions: [
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        name: "Sum of dst",
                                        format: "#,##0.00",
                                        localIdentifier: "m_size",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        name: "Sum of value",
                                        format: "#,##0.00",
                                        localIdentifier: "m_color",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                headers: [
                    {
                        attributeHeader: {
                            name: "latlon",
                            localIdentifier: "a_location",
                            uri: "/gdc/md/projectId/obj/1",
                            identifier: "label.ziplatlong.latlon",
                            formOf: {
                                name: "GEO pushpin",
                                uri: "/gdc/md/projectId/obj/79",
                                identifier: "attr.ziplatlong.latlon",
                            },
                        },
                    },
                    {
                        attributeHeader: {
                            name: "state",
                            localIdentifier: "a_segmentBy",
                            uri: "/gdc/md/projectId/obj/2",
                            identifier: "label.ziplatlong.state",
                            formOf: {
                                name: "state",
                                uri: "/gdc/md/projectId/obj/71",
                                identifier: "attr.ziplatlong.state",
                            },
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "/gdc/app/projects/projectId/executionResults/6726824952228314112",
        },
    },
    executionResult: {
        data: [["36"], ["84832"]],
        paging: { count: [2, 270], offset: [0, 0], total: [2, 270] },
        headerItems: [
            [
                [
                    { measureHeaderItem: { name: "Sum of dst", order: 0 } },
                    { measureHeaderItem: { name: "Sum of value", order: 1 } },
                ],
            ],
            [
                [
                    {
                        attributeHeaderItem: {
                            name: "43.345875;-73.40651",
                            uri: "/gdc/md/projectId/obj/79/elements?id=6559",
                        },
                    },
                ],
                [
                    {
                        attributeHeaderItem: {
                            name: "CT",
                            uri: "/gdc/md/projectId/obj/71/elements?id=7644",
                        },
                    },
                ],
            ],
        ],
    },
};

export {
    emptyResponse,
    emptyResponseWithNull,
    emptyResponseWithNullData,
    attributeOnlyResponse,
    tooLargeResponse,
    enrichedErrorResponse,
    locationAfm,
    locationResponse,
    locationSizeColorSegmentAfm,
    locationSizeColorSegmentResponse,
    locationSizeColorSegmentFiltersAfm,
    locationSizeColorSegmentFiltersResponse,
    oneMeasureResponse,
    oneMeasureAfm,
    twoMeasuresAfm,
    executionObjectWithTotals,
    responseWithTotals,
    badRequestResponse,
    oneMeasureOneDimensionResponse,
    twoMeasuresOneDimensionResponse,
    oneAttributeOneMeasureExecutionObject,
    oneAttributeOneMeasureOneFilterExecutionObject,
    oneAttributesOneMeasureResponse,
    oneAttributeOneMeasureSortByMeasureExecutionObject,
    oneColumnAttributeNoMeasureResponse,
    oneAttributeAfm,
};
