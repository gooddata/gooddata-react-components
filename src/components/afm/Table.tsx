import { AFM } from '@gooddata/typings';
import {
    dataSourceProvider,
    IDataSourceProviderProps
} from './DataSourceProvider';

export {
    IDataSourceProviderProps
};

import { Table as coreTable } from '../core/Table';

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

export const Table = dataSourceProvider(coreTable, generateDefaultDimensions);
