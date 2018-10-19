// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { AFM, VisualizationObject } from '@gooddata/typings';

import { ColumnChart as AfmColumnChart } from './afm/ColumnChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { ATTRIBUTE, STACK } from '../constants/bucketNames';
import { getDualAxesBuckets, getDualAxesConfigProps } from '../helpers/dualAxes';
import { IDualAxesChartProps } from '../interfaces/DualAxes';

export interface IColumnChartBucketProps extends IDualAxesChartProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    stackBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
}

export interface IColumnChartProps extends ICommonChartProps, IColumnChartBucketProps {
    projectId: string;
}

type IColumnChartNonBucketProps = Subtract<IColumnChartProps, IColumnChartBucketProps>;

/**
 * [ColumnChart](http://sdk.gooddata.com/gooddata-ui/docs/column_chart_component.html)
 * is a component with bucket props measures, viewBy, stackBy, filters
 */
export function ColumnChart(props: IColumnChartProps): JSX.Element {

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

    const newProps = omit<IColumnChartProps, IColumnChartNonBucketProps>(
        props,
        ['measures', 'secondaryMeasures', 'viewBy', 'stackBy', 'filters']
    );

    newProps.config = {
        ...newProps.config,
        ...getDualAxesConfigProps(buckets)
    };

    return (
        <AfmColumnChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
