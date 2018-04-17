import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { BulletChart as AfmBulletChart } from './afm/BulletChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { generateStackedDimensions } from '../helpers/dimensions';
import { isStackedChart } from '../helpers/stacks';

export interface IBulletChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    trendBy?: VisualizationObject.IVisualizationAttribute;
    segmentBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IBulletChartProps extends ICommonChartProps, IBulletChartBucketProps {
    projectId: string;
}

type IBulletChartNonBucketProps = Subtract<IBulletChartProps, IBulletChartBucketProps>;

export interface IBulletChartProps extends ICommonChartProps {
    projectId: string;
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

export function BulletChart(props: IBulletChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
        },
        {
            localIdentifier: 'attributes',
            items: props.trendBy ? [props.trendBy] : []
        },
        {
            localIdentifier: 'stacks',
            items: props.segmentBy ? [props.segmentBy] : []
        }
    ];

    const newProps
        = omit<IBulletChartProps, IBulletChartNonBucketProps>(props, ['measures', 'trendBy', 'segmentBy', 'filters']);

    return (
        <AfmBulletChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets)}
        />
    );
}
