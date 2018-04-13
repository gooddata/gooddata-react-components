import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { ColumnLineChart as AfmColumnLineChart } from './afm/ColumnLineChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { generateStackedDimensions } from '../helpers/dimensions';
import { isStackedChart } from '../helpers/stacks';

export interface IColumnLineChartBucketProps {
    measures: VisualizationObject.BucketItem[];
    viewBy?: VisualizationObject.IVisualizationAttribute;
    stackBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IColumnLineChartProps extends ICommonChartProps, IColumnLineChartBucketProps {
    projectId: string;
}

type IColumnLineChartNonBucketProps = Subtract<IColumnLineChartProps, IColumnLineChartBucketProps>;

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

export function ColumnLineChart(props: IColumnLineChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.measures || []
        },
        {
            localIdentifier: 'attributes',
            items: props.viewBy ? [props.viewBy] : []
        },
        {
            localIdentifier: 'stacks',
            items: props.stackBy ? [props.stackBy] : []
        }
    ];

    const newProps
        = omit<IColumnLineChartProps, IColumnLineChartNonBucketProps>(props, ['measures', 'viewBy', 'stackBy', 'filters']);

    return (
        <AfmColumnLineChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets)}
        />
    );
}
