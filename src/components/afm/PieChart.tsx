import { AFM } from '@gooddata/typings';
import {
    dataSourceProvider,
    IDataSourceProviderProps
} from './DataSourceProvider';

export {
    IDataSourceProviderProps
};

import { ICommonChartProps } from '../core/base/BaseChart';
import { PieChart as corePieChart } from '../core/PieChart';

// TODO tests
function generateDefaultDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    if ((afm.attributes || []).length === 0) {
        return [
            {
                itemIdentifiers: ['measureGroup']
            },
            {
                itemIdentifiers: []
            }
        ];
    }

    return [
        {
            itemIdentifiers: (afm.attributes || []).map(a => a.localIdentifier)
        },
        {
            itemIdentifiers: ['measureGroup']
        }
    ];
}

export const PieChart = dataSourceProvider<ICommonChartProps>(corePieChart, generateDefaultDimensions);
