// (C) 2020 GoodData Corporation
const { SIZE_AFM_DATA, getLocationAFMData } = require("../../data/geoChart/fixtures");

module.exports = projectId => {
    return {
        executionResult: {
            data: [SIZE_AFM_DATA],
            paging: {
                count: [2, 50],
                offset: [0, 0],
                total: [2, 50],
            },
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Sum of size",
                                order: 0,
                            },
                        },
                    ],
                ],
                [getLocationAFMData(projectId)],
            ],
        },
    };
};
