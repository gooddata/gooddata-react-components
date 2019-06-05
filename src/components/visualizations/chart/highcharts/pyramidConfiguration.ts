// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");

const PYRAMID_TEMPLATE = {
    chart: {
        type: "pyramid",
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b> ({point.y:,.0f})",
                softConnector: true,
            },
            center: ["40%", "50%"],
            width: "80%",
        },
    },
};

export function getPyramidConfiguration() {
    return cloneDeep(PYRAMID_TEMPLATE);
}
