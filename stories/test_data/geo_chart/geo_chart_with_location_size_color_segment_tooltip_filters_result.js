// (C) 2020 GoodData Corporation
const {
    SIZE_AFM_DATA,
    COLOR_AFM_DATA,
    getLocationAFMData,
    getSegmentAFMData,
    getTooltipTextAFMData,
} = require("../../data/geoChart/fixtures");

module.exports = projectId => {
    const locationData = getLocationAFMData(projectId);
    const segmentData = getSegmentAFMData(projectId);
    const tooltipTextData = getTooltipTextAFMData(projectId);
    return {
        executionResult: {
            data: [SIZE_AFM_DATA.slice(0, 5), COLOR_AFM_DATA.slice(0, 5)],
            paging: {
                count: [2, 5],
                offset: [0, 0],
                total: [2, 5],
            },
            headerItems: [
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "Size",
                                order: 0,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "Color",
                                order: 1,
                            },
                        },
                    ],
                ],
                [locationData.slice(0, 5), segmentData.slice(0, 5), tooltipTextData.slice(0, 5)],
            ],
        },
    };
};
