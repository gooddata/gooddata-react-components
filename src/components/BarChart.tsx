import * as React from 'react';
import PropTypes from 'prop-types';
import { BaseChart, IChartProps } from './base/BaseChart';

// export const chartPropTypes = {
//     afm: PropTypes.shape({
//         measures: PropTypes.arrayOf(
//             PropTypes.shape({
//                 id: PropTypes.string,
//                 definition: PropTypes.object
//             })
//         ).isRequired,
//         attributes: PropTypes.arrayOf(
//             PropTypes.shape({
//                 id: PropTypes.string,
//                 type: PropTypes.oneOf(['date', 'attribute'])
//             })
//         ),
//         filters: PropTypes.arrayOf(
//             PropTypes.object
//         )
//     }),
//     transformation: PropTypes.isRequired.shape({
//         measures: PropTypes.array,
//         buckets: PropTypes.array
//     }),
//     projectId: PropTypes.string.isRequired
// };

export class BarChart extends React.Component<IChartProps, null> {
    // static propTypes = chartPropTypes;

    public render() {
        return (
            <BaseChart
                type="bar"
                {...this.props}
            />
        );
    }
}
