import * as React from 'react';
import { omit } from 'lodash';
import { Subtract } from 'utility-types';
import { VisualizationObject, AFM } from '@gooddata/typings';

import { DualChart as AfmDualChart } from './afm/DualChart';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM, convertBucketsToMdObject } from '../helpers/conversion';

export interface IDualChartBucketProps {
    leftAxisMeasure: VisualizationObject.BucketItem;
    rightAxisMeasure: VisualizationObject.BucketItem;
    trendBy?: VisualizationObject.IVisualizationAttribute;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IDualChartProps extends ICommonChartProps, IDualChartBucketProps {
    projectId: string;
}

type IDualChartNonBucketProps = Subtract<IDualChartProps, IDualChartBucketProps>;

export interface IDualChartProps extends ICommonChartProps {
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

function getResultSpec(buckets: VisualizationObject.IBucket[]): AFM.IResultSpec {
    return {
        dimensions: generateDefaultDimensions(convertBucketsToAFM(buckets))
    };
}

/**
 * [DualChart](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/next/dual_chart_component.html)
 * is a component with bucket props measures, secondaryMeasures, trendBy, filters
 */
export function DualChart(props: IDualChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: 'measures',
            items: props.leftAxisMeasure ? [props.leftAxisMeasure] : []
        },
        {
            localIdentifier: 'secondary_measures',
            items: props.rightAxisMeasure ? [props.rightAxisMeasure] : []
        },
        {
            localIdentifier: 'trend',
            items: props.trendBy ? [props.trendBy] : []
        }
    ];

    const newProps = omit<IDualChartProps, IDualChartNonBucketProps>(props,
        ['leftAxisMeasure', 'rightAxisMeasure', 'trendBy', 'filters']);

    newProps.config = {
        ...newProps.config,
        mdObject: convertBucketsToMdObject(buckets, props.filters, 'local:combo')
    };

    return (
        <AfmDualChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets)}
        />
    );
}
