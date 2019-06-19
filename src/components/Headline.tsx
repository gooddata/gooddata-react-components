// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { Headline as AfmHeadline } from "./afm/Headline";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, mergeSeparatorsIntoMeasures } from "../helpers/conversion";
import { MEASURES } from "../constants/bucketNames";

export interface IHeadlineBucketProps {
    primaryMeasure: VisualizationInput.IMeasure;
    secondaryMeasure?: VisualizationInput.IMeasure;
    filters?: VisualizationInput.IFilter[];
}

export interface IHeadlineProps extends ICommonChartProps, IHeadlineBucketProps {
    projectId: string;
}

type IHeadlineNonBucketProps = Subtract<IHeadlineProps, IHeadlineBucketProps>;

/**
 * Headline
 * is a component with bucket props primaryMeasure, secondaryMeasure, filters
 */
export function Headline(props: IHeadlineProps): JSX.Element {
    const measuresFromProps = props.secondaryMeasure
        ? [props.primaryMeasure, props.secondaryMeasure]
        : [props.primaryMeasure];
    const measures = mergeSeparatorsIntoMeasures(props.config && props.config.separators, measuresFromProps);

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: measures,
        },
    ];

    const newProps: IHeadlineNonBucketProps = omit<IHeadlineProps, keyof IHeadlineBucketProps>(props, [
        "primaryMeasure",
        "secondaryMeasure",
        "filters",
    ]);

    return <AfmHeadline {...newProps} afm={convertBucketsToAFM(buckets, props.filters)} />;
}
