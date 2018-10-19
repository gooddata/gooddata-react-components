// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { AFM, VisualizationObject } from '@gooddata/typings';

import { LineChart as AfmLineChart } from './afm/LineChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { ATTRIBUTE, STACK } from '../constants/bucketNames';
import { IDualAxesChartProps } from '../interfaces/DualAxes';
import { getDualAxesBuckets, getDualAxesConfigProps } from '../helpers/dualAxes';

export interface ILineChartBucketProps extends IDualAxesChartProps {
    measures: VisualizationObject.BucketItem[];
    trendBy?: VisualizationObject.IVisualizationAttribute;
    segmentBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
}

export interface ILineChartProps extends ICommonChartProps, ILineChartBucketProps {
    projectId: string;
}

type ILineChartNonBucketProps = Subtract<ILineChartProps, ILineChartBucketProps>;

export interface ILineChartProps extends ICommonChartProps {
    projectId: string;
}

/**
 * [LineChart](http://sdk.gooddata.com/gooddata-ui/docs/line_chart_component.html)
 * is a component with bucket props measures, trendBy, segmentBy, filters
 */
export function LineChart(props: ILineChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        ...getDualAxesBuckets(props),
        {
            localIdentifier: ATTRIBUTE,
            items: props.trendBy ? [props.trendBy] : []
        },
        {
            localIdentifier: STACK,
            items: props.segmentBy ? [props.segmentBy] : []
        }
    ];

    const newProps
        = omit<ILineChartProps, ILineChartNonBucketProps>(
        props,
        ['measures', 'secondaryMeasures', 'trendBy', 'segmentBy', 'filters']
    );

    newProps.config = {
        ...newProps.config,
        ...getDualAxesConfigProps(buckets)
    };

    return (
        <AfmLineChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
