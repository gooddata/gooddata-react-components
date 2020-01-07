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
        series: {
            states: {
                hover: {
                    enabled: false,
                },
            },
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
