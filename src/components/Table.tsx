import * as React from 'react';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { Table as CoreTable } from './core/Table';
import { ICommonChartProps } from './core/base/BaseChart';
import { dataSourceProvider } from './afm/DataSourceProvider';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface ITableProps extends ICommonChartProps {
    projectId: string;
    measures: VisualizationObject.BucketItem[];
    attributes?: VisualizationObject.IVisualizationAttribute[];
    totals?: VisualizationObject.IVisualizationTotal[];
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

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

export function Table(props: ITableProps): JSX.Element {
    const Component = dataSourceProvider(CoreTable, generateDefaultDimensions);

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || [],
            totals: props.totals || []
        },
        {
            localIdentifier: 'attributes',
            items: props.attributes || []
        }
    ];

    return (
        <Component
            {...props}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets)}
        />
    );
}
