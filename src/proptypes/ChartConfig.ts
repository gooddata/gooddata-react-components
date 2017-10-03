import * as PropTypes from 'prop-types';

import { Requireable } from 'prop-types'; // tslint:disable-line:no-duplicate-imports
export {
    Requireable
};

export const ChartConfigPropType =
    PropTypes.shape({
        colors: PropTypes.arrayOf(PropTypes.string),
        legend: PropTypes.shape({
            enabled: PropTypes.bool,
            position: PropTypes.oneOf(['top', 'left', 'right', 'bottom'])
        }),
        limits: PropTypes.shape({
            series: PropTypes.number,
            categories: PropTypes.number
        })
    });
