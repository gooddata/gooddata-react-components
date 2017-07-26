import * as PropTypes from 'prop-types';
import chartConfig from './ChartConfig';

export const visualizationPropTypes = {
    uri: PropTypes.string.isRequired,
    ...chartConfig
};
