import * as React from 'react';
import { omit } from 'lodash';
import { VisualizationObject } from '@gooddata/typings';

import { Headline as AfmHeadline } from './afm/Headline';
import { ICommonChartProps } from './core/base/BaseChart';
import { convertBucketsToAFM } from '../helpers/conversion';
import { MEASURES } from '../constants/bucketNames';

export interface IHeadlineBucketProps {
    primaryMeasure: VisualizationObject.IMeasure;
    secondaryMeasure?: VisualizationObject.IMeasure;
    filters?: VisualizationObject.VisualizationObjectFilter[];
}

export interface IHeadlineProps extends ICommonChartProps, IHeadlineBucketProps {
    projectId: string;
}

/**
 * Headline
 * is a component with bucket props primaryMeasure, secondaryMeasure, filters
 */
export function Headline(props: IHeadlineProps): JSX.Element {
    const buckets = [
        {
            localIdentifier: MEASURES,
            items: props.secondaryMeasure ? [props.primaryMeasure, props.secondaryMeasure] : [props.primaryMeasure]
        }
    ];

    const newProps = omit<IHeadlineProps, keyof IHeadlineBucketProps>(props,
        ['primaryMeasure', 'secondaryMeasure', 'filters']);

    return (
        <AfmHeadline
            {...newProps}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
