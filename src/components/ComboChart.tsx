import * as React from 'react';
import { omit } from 'lodash';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { ComboChart as AfmComboChart } from './afm/ComboChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM, convertBucketsToMdObject } from '../helpers/conversion';
import { getResultSpec } from '../helpers/resultSpec';
import { MEASURES, SECONDARY_MEASURES, VIEW } from '../constants/bucketNames';

export interface IComboChartBucketProps {
    columnMeasures: VisualizationObject.IMeasure[];
    lineMeasures?: VisualizationObject.IMeasure[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: AFM.SortItem[];
}

export interface IComboChartProps extends ICommonChartProps, IComboChartBucketProps {
    projectId: string;
}

/**
 * [ComboChart](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/next/combo_chart_component.html)
 * is a component with bucket props primaryMeasures, secondaryMeasures, viewBy, filters
 */
export function ComboChart(props: IComboChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.columnMeasures || []
        },
        {
            localIdentifier: SECONDARY_MEASURES,
            items: props.lineMeasures || []
        },
        {
            localIdentifier: VIEW,
            items: props.viewBy ? [props.viewBy] : []
        }
    ];

    const newProps
        = omit<IComboChartProps, keyof IComboChartBucketProps>(
            props, ['columnMeasures', 'lineMeasures', 'viewBy', 'filters']
        );
    newProps.config = {
        ...newProps.config,
        mdObject: convertBucketsToMdObject(buckets, props.filters, 'local:combo')
    };

    return (
        <AfmComboChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy)}
        />
    );
}
