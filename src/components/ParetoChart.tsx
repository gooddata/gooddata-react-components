import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject } from '@gooddata/typings';

import { ParetoChart as AfmParetoChart } from './afm/ParetoChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';

export interface IParetoChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IParetoChartProps extends ICommonChartProps, IParetoChartBucketProps {
    projectId: string;
}

type IParetoChartNonBucketProps = Subtract<IParetoChartProps, IParetoChartBucketProps>;

export function ParetoChart(props: IParetoChartProps): JSX.Element {
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
        = omit<IParetoChartProps, IParetoChartNonBucketProps>(props, ['measures', 'viewBy', 'filters']);

    return (
        <AfmParetoChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
