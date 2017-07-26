import * as PropTypes from 'prop-types';
import afm from './Afm';
import transformation from './Transformation';

export const tablePropTypes = {
    ...afm,
    ...transformation,
    projectId: PropTypes.string.isRequired
};
