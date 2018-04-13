import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { WaterfallChart as AfmWaterfallChart } from './afm/WaterfallChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { generateStackedDimensions } from '../helpers/dimensions';
import { isStackedChart } from '../helpers/stacks';

export interface IWaterfallChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    trendBy?: VisualizationObject.IVisualizationAttribute;
    segmentBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IWaterfallChartProps extends ICommonChartProps, IWaterfallChartBucketProps {
    projectId: string;
}

type IWaterfallChartNonBucketProps = Subtract<IWaterfallChartProps, IWaterfallChartBucketProps>;

export interface IWaterfallChartProps extends ICommonChartProps {
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

export function WaterfallChart(props: IWaterfallChartProps): JSX.Element {
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
        = omit<IWaterfallChartProps, IWaterfallChartNonBucketProps>(props, ['measures', 'trendBy', 'segmentBy', 'filters']);

    return (
        <AfmWaterfallChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets)}
        />
    );
}
