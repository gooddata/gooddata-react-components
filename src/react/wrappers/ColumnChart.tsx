import * as React from 'react';
import { LineFamilyChart, ILineFamilyChartProps } from './LineFamilyChart';

export class ColumnChart extends React.Component<ILineFamilyChartProps, null> {
    public render() {
        return (
            <LineFamilyChart
                type="column"
                {...this.props}
            />
        );
    }
}
