// (C) 2007-2018 GoodData Corporation
import { AFM } from '@gooddata/typings';
import {
    dataSourceProvider,
    IDataSourceProviderProps
} from './DataSourceProvider';

export {
    IDataSourceProviderProps
};

import { ICommonChartProps } from '../core/base/BaseChart';
import { ColumnAreaChart as CoreColumnAreaChart } from '../core/ColumnAreaChart';

function generateDefaultDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    return [
        {
            itemIdentifiers: ['measureGroup']
        },
        {
            itemIdentifiers: (afm.attributes || []).map(a => a.localIdentifier)
        }
    ];
}

export const ColumnAreaChart = dataSourceProvider<ICommonChartProps>(
    CoreColumnAreaChart, generateDefaultDimensions, 'ColumnAreaChart');
