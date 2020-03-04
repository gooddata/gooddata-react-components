// (C) 2020 GoodData Corporation
const { COLOR_AFM_DATA, getLocationAFMData } = require("../../data/geoChart/fixtures");

module.exports = projectId => {
    return {
        executionResult: {
            data: [COLOR_AFM_DATA],
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
                                name: "Color",
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
