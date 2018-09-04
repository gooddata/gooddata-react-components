import * as React from 'react';
import { omit } from 'lodash';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { ColumnChart as AfmColumnChart } from './afm/ColumnChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { getStackingResultSpec } from '../helpers/resultSpec';
import { MEASURES, ATTRIBUTE, STACK } from '../constants/bucketNames';

export interface IColumnChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    stackBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
}

export interface IColumnChartProps extends ICommonChartProps, IColumnChartBucketProps {
    projectId: string;
}

/**
 * [ColumnChart](http://sdk.gooddata.com/gooddata-ui/docs/column_chart_component.html)
 * is a component with bucket props measures, viewBy, stackBy, filters
 */
export function ColumnChart(props: IColumnChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || []
        },
        {
            localIdentifier: ATTRIBUTE,
            items: props.viewBy ? [props.viewBy] : []
        },
        {
            localIdentifier: STACK,
            items: props.stackBy ? [props.stackBy] : []
        }
    ];

    const newProps
        = omit<IColumnChartProps, keyof IColumnChartBucketProps>(props, ['measures', 'viewBy', 'stackBy', 'filters']);

    return (
        <AfmColumnChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
