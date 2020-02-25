// (C) 2020 GoodData Corporation
const { getLocationAFMData } = require("../../data/geoChart/fixtures");

module.exports = projectId => {
    return {
        executionResult: {
            data: [],
            paging: {
                count: [2, 50],
                offset: [0, 0],
                total: [2, 50],
            },
            headerItems: [[getLocationAFMData(projectId)]],
        },
    };
};
