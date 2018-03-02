import * as React from 'react';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { LineChart as CoreLineChart } from './core/LineChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { dataSourceProvider } from './afm/DataSourceProvider';
import { convertBucketsToAFM } from '../helpers/conversion';
import { generateStackedDimensions } from '../helpers/dimensions';
import { isStackedChart } from '../helpers/stacks';

export interface ILineChartProps extends ICommonChartProps {
    projectId: string;
    measures: VisualizationObject.BucketItem[];
    attributes?: VisualizationObject.IVisualizationAttribute[];
    stacks?: VisualizationObject.IVisualizationAttribute[];
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

function getStackingResultSpec(buckets: VisualizationObject.IBucket[]): AFM.IResultSpec {
    if (isStackedChart(buckets)) {
        return {
            dimensions: generateStackedDimensions(buckets)
        };
    }

    return {
        dimensions: generateDefaultDimensions(convertBucketsToAFM(buckets))
    };
}

export function LineChart(props: ILineChartProps): JSX.Element {
    const Component = dataSourceProvider(CoreLineChart, generateDefaultDimensions);

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
        },
        {
            localIdentifier: 'attributes',
            items: props.attributes || []
        },
        {
            localIdentifier: 'stacks',
            items: props.stacks || []
        }
    ];

    return (
        <Component
            {...props}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets)}
            resultSpec={getStackingResultSpec(buckets)}
        />
    );
}
