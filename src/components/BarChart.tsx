import * as React from 'react';
import { BaseChart, IChartProps } from './base/BaseChart';
import { chartPropTypes } from '../proptypes/Chart';

export class BarChart extends React.Component<IChartProps, null> {
    static propTypes = chartPropTypes;

    public render() {
        return (
            <BaseChart
                type="bar"
                {...this.props}
            />
        );
    }
}
