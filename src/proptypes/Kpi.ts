import * as PropTypes from 'prop-types';
import filters from './Filters';

export const kpiPropTypes = {
    measure: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    ...filters,
    format: PropTypes.string
};
