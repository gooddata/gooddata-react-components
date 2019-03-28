// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, VisualizationInput } from '@gooddata/typings';

import { BarChart as AfmBarChart } from './afm/BarChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { MEASURES, ATTRIBUTE, STACK } from '../constants/bucketNames';
import { getViewByTwoAttributes } from '../helpers/optionalStacking/common';

export interface IBarChartBucketProps {
    measures: VisualizationInput.AttributeOrMeasure[];
    viewBy?: VisualizationInput.IAttribute | VisualizationInput.IAttribute[];
    stackBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IBarChartProps extends ICommonChartProps, IBarChartBucketProps {
    projectId: string;
}

type IBarChartNonBucketProps = Subtract<IBarChartProps, IBarChartBucketProps>;

/**
 * [BarChart](http://sdk.gooddata.com/gooddata-ui/docs/bar_chart_component.html)
 * is a component with bucket props measures, viewBy, stackBy, filters
 */
export function BarChart(props: IBarChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || []
        },
        {
            localIdentifier: ATTRIBUTE,
            items: getViewByTwoAttributes(props.viewBy) // could be one or two attributes
        },
        {
            localIdentifier: STACK,
            items: props.stackBy ? [props.stackBy] : []
        }
    ];

    const newProps
        = omit<IBarChartProps, IBarChartNonBucketProps>(props, ['measures', 'viewBy', 'stackBy', 'filters']);

    return (
        <AfmBarChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
