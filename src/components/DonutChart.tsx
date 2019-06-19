// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { DonutChart as AfmDonutChart } from "./afm/DonutChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, mergeSeparatorsIntoMeasures } from "../helpers/conversion";
import { MEASURES, VIEW } from "../constants/bucketNames";

export interface IDonutChartBucketProps {
    measures: VisualizationInput.AttributeOrMeasure[];
    viewBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
}

export interface IDonutChartProps extends ICommonChartProps, IDonutChartBucketProps {
    projectId: string;
}

type IDonutChartNonBucketProps = Subtract<IDonutChartProps, IDonutChartBucketProps>;

/**
 * [DonutChart](http://sdk.gooddata.com/gooddata-ui/docs/donut_chart_component.html)
 * is a component with bucket props measures, viewBy, filters
 */
export function DonutChart(props: IDonutChartProps): JSX.Element {
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
            localIdentifier: VIEW,
            items: props.viewBy ? [props.viewBy] : [],
        },
    ];

    const newProps: IDonutChartNonBucketProps = omit<IDonutChartProps, keyof IDonutChartBucketProps>(props, [
        "measures",
        "viewBy",
        "filters",
    ]);

    return (
        <AfmDonutChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
        />
    );
}
