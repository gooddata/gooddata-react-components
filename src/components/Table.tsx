import * as React from 'react';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { Table as CoreTable } from './core/Table';
import { ICommonChartProps } from './core/base/BaseChart';
import { dataSourceProvider } from './afm/DataSourceProvider';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getTableDimensions } from '../helpers/dimensions';

export interface ITableProps extends ICommonChartProps {
    projectId: string;
    measures: VisualizationObject.BucketItem[];
    attributes?: VisualizationObject.IVisualizationAttribute[];
    totals?: VisualizationObject.IVisualizationTotal[];
    totalsEditAllowed?: boolean;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

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

export function Table(props: ITableProps): JSX.Element {
    const Component = dataSourceProvider(CoreTable, generateDefaultDimensions);

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
        },
        {
            localIdentifier: 'attributes',
            items: props.attributes || [],
            totals: props.totals || []
        }
    ];

    return (
        <Component
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets)}
            resultSpec={{ dimensions: getTableDimensions(buckets) }}
            totalsEditAllowed={props.totalsEditAllowed ? props.totalsEditAllowed : false}
        />
    );
}
