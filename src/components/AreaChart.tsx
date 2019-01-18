// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { isArray, omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { AreaChart as AfmAreaChart } from './afm/AreaChart';

import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { MEASURES, ATTRIBUTE, STACK } from '../constants/bucketNames';

export interface IAreaChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute | VisualizationObject.IVisualizationAttribute[];
    stackBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
}

export interface IAreaChartProps extends ICommonChartProps, IAreaChartBucketProps {
    projectId: string;
}

type IAreaChartNonBucketProps = Subtract<IAreaChartProps, IAreaChartBucketProps>;

/**
 * [AreaChart](http://sdk.gooddata.com/gooddata-ui/docs/area_chart_component.html)
 * is a component with bucket props measures, viewBy, stacksBy, filters
 */
export function AreaChart(props: IAreaChartProps): JSX.Element {
    // TODO: only get first 2 attributes
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || []
        },
        {
            localIdentifier: ATTRIBUTE,
            items: props.viewBy ? (isArray(props.viewBy) ? props.viewBy : [props.viewBy]) : []
        },
        {
            localIdentifier: STACK,
            items: props.stackBy ? [props.stackBy] : []
        }
    ];

    const newProps
        = omit<IAreaChartProps, IAreaChartNonBucketProps>(props, ['measures', 'viewBy', 'stackBy', 'filters']);

    return (
        <AfmAreaChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
