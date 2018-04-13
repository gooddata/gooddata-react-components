import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject } from '@gooddata/typings';

import { TreeMapChart as AfmTreeMapChart } from './afm/TreeMapChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface ITreeMapChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface ITreeMapChartProps extends ICommonChartProps, ITreeMapChartBucketProps {
    projectId: string;
}

type ITreeMapChartNonBucketProps = Subtract<ITreeMapChartProps, ITreeMapChartBucketProps>;

export function TreeMapChart(props: ITreeMapChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
        },
        {
            localIdentifier: 'view',
            items: props.viewBy ? [props.viewBy] : []
        }
    ];

    const newProps
        = omit<ITreeMapChartProps, ITreeMapChartNonBucketProps>(props, ['measures', 'viewBy', 'filters']);

    return (
        <AfmTreeMapChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
