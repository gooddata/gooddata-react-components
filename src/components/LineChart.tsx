import * as React from 'react';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { LineChart as CoreLineChart } from './core/LineChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { dataSourceProvider } from './afm/DataSourceProvider';
import { convertBucketsToAFM } from '../helpers/conversion';

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

function generateStackedDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    return [
        {
            itemIdentifiers: ['measureGroup', afm.attributes[0].localIdentifier]
        },
        {
            itemIdentifiers: (afm.attributes || []).map((a => a.localIdentifier))
        }
    ];
}

// TODO: Move to helpers
function isStackedChart(buckets: VisualizationObject.IBucket[]): boolean {
    return buckets.some((bucket) => {
        return bucket.localIdentifier === 'stacks' && bucket.items.length > 0;
    });
}

function getStackingResultSpec(buckets: VisualizationObject.IBucket[]): AFM.IResultSpec {
    if (isStackedChart(buckets)) {
        return {
            dimensions: generateStackedDimensions(convertBucketsToAFM(buckets))
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
