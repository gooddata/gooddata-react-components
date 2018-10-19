// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { AFM, VisualizationObject } from '@gooddata/typings';

import { BarChart as AfmBarChart } from './afm/BarChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { ATTRIBUTE, STACK } from '../constants/bucketNames';
import { IDualAxesChartProps } from '../interfaces/DualAxes';
import { getDualAxesBuckets, getDualAxesConfigProps } from '../helpers/dualAxes';
import { IColumnChartProps } from './ColumnChart';

export interface IBarChartBucketProps extends IDualAxesChartProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    stackBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
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
        ...getDualAxesBuckets(props),
        {
            localIdentifier: ATTRIBUTE,
            items: props.viewBy ? [props.viewBy] : []
        },
        {
            localIdentifier: STACK,
            items: props.stackBy ? [props.stackBy] : []
        }
    ];

    const newProps = omit<IColumnChartProps, IBarChartNonBucketProps>(
        props,
        ['measures', 'secondaryMeasures', 'viewBy', 'stackBy', 'filters']
    );

    newProps.config = {
        ...newProps.config,
        ...getDualAxesConfigProps(buckets)
    };

    return (
        <AfmBarChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
