// (C) 2007-2018 GoodData Corporation
import cloneDeep = require('lodash/cloneDeep');

import { MAX_POINT_WIDTH } from './commonConfiguration';

const COMBO_TEMPLATE = {
    chart: {
        zoomType: 'xy',
        type: 'column',
        spacingTop: 20
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true,
                crop: false,
                overflow: 'none',
                padding: 2
            },
            maxPointWidth: MAX_POINT_WIDTH
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    }
};

export function getComboConfiguration() {
    return cloneDeep(COMBO_TEMPLATE);
}
