// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationObject, VisualizationInput } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { LineChart as AfmLineChart } from "./afm/LineChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, mergeSeparatorsIntoMeasures } from "../helpers/conversion";
import { getStackingResultSpec } from "../helpers/resultSpec";
import { MEASURES, ATTRIBUTE, STACK } from "../constants/bucketNames";

export interface ILineChartBucketProps {
    measures: VisualizationInput.AttributeOrMeasure[];
    trendBy?: VisualizationInput.IAttribute;
    segmentBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface ILineChartProps extends ICommonChartProps, ILineChartBucketProps {
    projectId: string;
}

type ILineChartNonBucketProps = Subtract<ILineChartProps, ILineChartBucketProps>;

/**
 * [LineChart](http://sdk.gooddata.com/gooddata-ui/docs/line_chart_component.html)
 * is a component with bucket props measures, trendBy, segmentBy, filters
 */
export function LineChart(props: ILineChartProps): JSX.Element {
    const measures = mergeSeparatorsIntoMeasures(
        props.config && props.config.separators,
        props.measures || [],
    );

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: measures,
        },
        {
            localIdentifier: ATTRIBUTE,
            items: props.trendBy ? [props.trendBy] : [],
        },
        {
            localIdentifier: STACK,
            items: props.segmentBy ? [props.segmentBy] : [],
        },
    ];

    const newProps: ILineChartNonBucketProps = omit<ILineChartProps, keyof ILineChartBucketProps>(props, [
        "measures",
        "trendBy",
        "segmentBy",
        "filters",
        "sortBy",
    ]);

    return (
        <AfmLineChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
