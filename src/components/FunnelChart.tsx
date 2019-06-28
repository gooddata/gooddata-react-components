// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationObject, VisualizationInput } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { FunnelChart as AfmFunnelChart } from "./afm/FunnelChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM } from "../helpers/conversion";
import { getResultSpec } from "../helpers/resultSpec";
import { generateDefaultDimensionsForRoundChart } from "../helpers/dimensions";
import { MEASURES, VIEW } from "../constants/bucketNames";

export interface IFunnelChartBucketProps {
    measures: VisualizationInput.AttributeOrMeasure[];
    viewBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IFunnelChartProps extends ICommonChartProps, IFunnelChartBucketProps {
    projectId: string;
}

type IFunnelChartNonBucketProps = Subtract<IFunnelChartProps, IFunnelChartBucketProps>;

const generateFunnelDimensionsFromBuckets = (buckets: VisualizationObject.IBucket[]) =>
    generateDefaultDimensionsForRoundChart(convertBucketsToAFM(buckets));
/**
 * [FunnelChart](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/next/pie_chart_component.html)
 * is a component with bucket props measures, viewBy, filters
 */
export function FunnelChart(props: IFunnelChartProps): JSX.Element {
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.measures || [],
        },
        {
            localIdentifier: VIEW,
            items: props.viewBy ? [props.viewBy] : [],
        },
    ];

    const newProps: IFunnelChartNonBucketProps = omit<IFunnelChartProps, keyof IFunnelChartBucketProps>(
        props,
        ["measures", "viewBy", "filters", "sortBy"],
    );

    return (
        <AfmFunnelChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy, generateFunnelDimensionsFromBuckets)}
        />
    );
}
