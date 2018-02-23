import * as React from 'react';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { PieChart as CorePieChart } from './core/PieChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { dataSourceProvider } from './afm/DataSourceProvider';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface IPieChartProps extends ICommonChartProps {
    projectId: string;
    measures: VisualizationObject.BucketItem[];
    attributes?: VisualizationObject.IVisualizationAttribute[];
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

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

export function PieChart(props: IPieChartProps): JSX.Element {
    const Component = dataSourceProvider(CorePieChart, generateDefaultDimensions);

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
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
