import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject } from '@gooddata/typings';

import { WordCloudChart as AfmWordCloudChart } from './afm/WordCloudChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface IWordCloudChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IWordCloudChartProps extends ICommonChartProps, IWordCloudChartBucketProps {
    projectId: string;
}

type IWordCloudChartNonBucketProps = Subtract<IWordCloudChartProps, IWordCloudChartBucketProps>;

export function WordCloudChart(props: IWordCloudChartProps): JSX.Element {
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
        = omit<IWordCloudChartProps, IWordCloudChartNonBucketProps>(props, ['measures', 'viewBy', 'filters']);

    return (
        <AfmWordCloudChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
