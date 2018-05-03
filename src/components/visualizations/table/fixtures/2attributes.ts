// (C) 2007-2018 GoodData Corporation
import { AFM, Execution } from '@gooddata/typings';
import { TableHeader, TableRow } from '../../../../interfaces/Table';

export const EXECUTION_REQUEST_2A: AFM.IExecution = {
    execution: {
        afm: {
            attributes: [
                {
                    localIdentifier: '1st_attr_df_local_identifier',
                    displayForm: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id'
                    }
                },
                {
                    localIdentifier: '2nd_attr_df_local_identifier',
                    displayForm: {
                        identifier: '2nd_attr_df_identifier'
                    }
                }
            ]
        },
        resultSpec: {
            dimensions: [
                {
                    itemIdentifiers: ['1st_attr_df_local_identifier', '2nd_attr_df_local_identifier']
                },
                {
                    itemIdentifiers: []
                }
            ]
        }
    }
};

export const EXECUTION_RESPONSE_2A: Execution.IExecutionResponse = {
    dimensions: [
        {
            headers: [
                {
                    attributeHeader: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id',
                        identifier: '1st_attr_df_identifier',
                        localIdentifier: '1st_attr_df_local_identifier',
                        name: 'Product Name',
                        formOf: {
                            name: 'Product',
                            uri: '/gdc/md/project_id/obj/1st_attr_uri_id',
                            identifier: '1st_attr_local_identifier'
                        }
                    }
                },
                {
                    attributeHeader: {
                        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id',
                        identifier: '2nd_attr_df_identifier',
                        localIdentifier: '2nd_attr_df_local_identifier',
                        name: 'Region Area',
                        formOf: {
                            name: 'Region',
                            uri: '/gdc/md/project_id/obj/2nd_attr_uri_id',
                            identifier: '2nd_attr_local_identifier'
                        }
                    }
                }
            ]
        },
        {
            headers: [] // empty array => empty 1-st dimension
        }
    ],
    links: {
        executionResult: '/gdc/app/projects/project_id/executionResults/foo?q=bar&c=baz&dimension=a&dimension=m'
    }
};

export const EXECUTION_RESULT_2A: Execution.IExecutionResult = {
    data: [],
    headerItems: [
        [
            [
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=3',
                        name: 'Computer'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=3',
                        name: 'Computer'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=12',
                        name: 'Television'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=12',
                        name: 'Television'
                    }
                }
            ],
            [
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=71',
                        name: 'East Coast'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=67',
                        name: 'West Coast'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=71',
                        name: 'East Coast'
                    }
                },
                {
                    attributeHeaderItem: {
                        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=67',
                        name: 'West Coast'
                    }
                }
            ]
        ],
        [] // empty array => empty 1-st dimension
    ],
    paging: {
        count: [
            4,
            1
        ],
        offset: [
            0,
            0
        ],
        total: [
            4,
            1
        ]
    }
};

export const TABLE_HEADERS_2A: TableHeader[] = [
    {
        type: 'attribute',
        uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id',
        identifier: '1st_attr_df_identifier',
        localIdentifier: '1st_attr_df_local_identifier',
        name: 'Product'
    },
    {
        type: 'attribute',
        uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id',
        identifier: '2nd_attr_df_identifier',
        localIdentifier: '2nd_attr_df_local_identifier',
        name: 'Region'
    }
];

export const TABLE_ROWS_2A: TableRow[] = [
    [
        {
            uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=3',
            name: 'Computer'
        },
        {
            uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=71',
            name: 'East Coast'
        }
    ],
    [
        {
            uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=3',
            name: 'Computer'
        },
        {
            uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=67',
            name: 'West Coast'
        }
    ],
    [
        {
            uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=12',
            name: 'Television'
        },
        {
            uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=71',
            name: 'East Coast'
        }
    ],
    [
        {
            uri: '/gdc/md/project_id/obj/1st_attr_df_uri_id/elements?id=12',
            name: 'Television'
        },
        {
            uri: '/gdc/md/project_id/obj/2nd_attr_df_uri_id/elements?id=67',
            name: 'West Coast'
        }
    ]
];
