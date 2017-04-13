import * as React from 'react';
import { LineFamilyChart, ILineFamilyChartProps } from './LineFamilyChart';

export class LineChart extends React.Component<ILineFamilyChartProps, null> {
    public render() {
        return (
            <LineFamilyChart
                type="line"
                {...this.props}
            />
        );
    }
}
