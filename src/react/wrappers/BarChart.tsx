import * as React from 'react';
import { LineFamilyChart, ILineFamilyChartProps } from './LineFamilyChart';

export class BarChart extends React.Component<ILineFamilyChartProps, null> {
    public render() {
        return (
            <LineFamilyChart
                type="bar"
                {...this.props}
            />
        );
    }
}
