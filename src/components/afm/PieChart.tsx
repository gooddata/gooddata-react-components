// (C) 2007-2018 GoodData Corporation
import {
    dataSourceProvider,
    IDataSourceProviderProps
} from './DataSourceProvider';

export {
    IDataSourceProviderProps
};

import { ICommonChartProps } from '../core/base/BaseChart';
import { PieChart as CorePieChart } from '../core/PieChart';
import { generateDefaultDimensionsForRoundChart as generateDefaultDimensions } from './afmHelper';

/**
 * AFM PieChart
 * is an internal component that accepts afm, resultSpec
 * @internal
 */
export const PieChart = dataSourceProvider<ICommonChartProps>(CorePieChart, generateDefaultDimensions, 'PieChart');
