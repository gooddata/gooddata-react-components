import {
    AFM
} from '@gooddata/typings';

import {
    dataSourceProvider,
    IDataSourceProviderProps
} from './DataSourceProvider';

export {
    IDataSourceProviderProps
};

import { ICommonChartProps } from '../core/base/BaseChart';
import { BarChart as coreBarChart } from '../core/BarChart';

function generateDefaultDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    return [
        {
            itemIdentifiers: (afm.attributes || []).map(a => a.localIdentifier)
        },
        {
            itemIdentifiers: ['measureGroup']
        }
    ];
}

export const BarChart = dataSourceProvider<ICommonChartProps>(coreBarChart, generateDefaultDimensions);
