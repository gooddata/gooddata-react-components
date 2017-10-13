import * as PropTypes from 'prop-types';

import { Requireable } from 'prop-types'; // tslint:disable-line:no-duplicate-imports
export {
    Requireable
};

// TODO FIXME new AFM
const baseAttributeFilter = {
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['attribute']).isRequired
};

export const FiltersPropType =
    PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                type: PropTypes.oneOf(['date']).isRequired,
                granularity: PropTypes.string.isRequired,
                intervalType: PropTypes.oneOf(['absolute', 'relative']).isRequired
            }),
            PropTypes.oneOfType([
                PropTypes.shape({
                    in: PropTypes.arrayOf(PropTypes.string).isRequired,
                    ...baseAttributeFilter
                }),
                PropTypes.shape({
                    notIn: PropTypes.arrayOf(PropTypes.string).isRequired,
                    ...baseAttributeFilter
                })
            ]).isRequired
        ])
    );
