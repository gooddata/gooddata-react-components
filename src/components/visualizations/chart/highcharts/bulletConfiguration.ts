// (C) 2007-2020 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");

import { MAX_POINT_WIDTH } from "./commonConfiguration";

const BULLET_TEMPLATE = {
    chart: {
        type: "bar",
    },
    plotOptions: {
        bar: {
            maxPointWidth: MAX_POINT_WIDTH,
            dataLabels: {
                enabled: false,
            },
        },
        bullet: {
            tooltip: {
                followPointer: true,
            },
            targetOptions: {
                borderWidth: 0,
            },
        },
        series: {
            states: {
                hover: {
                    enabled: false,
                },
            },
            grouping: false,
            borderWidth: 0,
        },
    },
    yAxis: [
        {
            stackLabels: {
                enabled: false,
            },
        },
    ],
};

export function getBulletConfiguration() {
    return cloneDeep(BULLET_TEMPLATE);
}
