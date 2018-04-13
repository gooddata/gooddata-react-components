import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject } from '@gooddata/typings';

import { HistogramChart as AfmHistogramChart } from './afm/HistogramChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface IHistogramChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IHistogramChartProps extends ICommonChartProps, IHistogramChartBucketProps {
    projectId: string;
}

type IHistogramChartNonBucketProps = Subtract<IHistogramChartProps, IHistogramChartBucketProps>;

export function HistogramChart(props: IHistogramChartProps): JSX.Element {
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
        = omit<IHistogramChartProps, IHistogramChartNonBucketProps>(props, ['measures', 'viewBy', 'filters']);

    return (
        <AfmHistogramChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
