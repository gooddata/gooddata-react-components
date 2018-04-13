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
import { ParetoChart as CoreParetoChart } from '../core/ParetoChart';

function generateDefaultDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    if ((afm.attributes || []).length === 0) {
        return [
            {
                itemIdentifiers: []
            },
            {
                itemIdentifiers: ['measureGroup']
            }
        ];
    }

    return [
        {
            itemIdentifiers: ['measureGroup']
        },
        {
            itemIdentifiers: (afm.attributes || []).map(a => a.localIdentifier)
        }
    ];
}

export const ParetoChart = dataSourceProvider<ICommonChartProps>(CoreParetoChart, generateDefaultDimensions, 'ParetoChart');
