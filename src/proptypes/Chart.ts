import * as PropTypes from 'prop-types';
import afm from './Afm';
import transformation from './Transformation';
import chartConfig from './ChartConfig';

export const chartPropTypes = {
    ...afm,
    ...transformation,
    ...chartConfig,
    projectId: PropTypes.string.isRequired
};
