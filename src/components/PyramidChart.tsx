// (C) 2007-2018 GoodData Corporation
import * as React from "react";

import { VisualizationObject, VisualizationInput } from "@gooddata/typings";
import { Subtract } from "../typings/subtract";
import { PyramidChart as AfmPyramidChart } from "./afm/PyramidChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM } from "../helpers/conversion";
import { getResultSpec } from "../helpers/resultSpec";
import { generateDefaultDimensionsForRoundChart } from "../helpers/dimensions";
import { MEASURES, VIEW } from "../constants/bucketNames";
import omit = require("lodash/omit");

export interface IPyramidChartBucketProps {
    measures: VisualizationInput.AttributeOrMeasure[];
    viewBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IPyramidChartProps extends ICommonChartProps, IPyramidChartBucketProps {
    projectId: string;
}

type IPyramidChartNonBucketProps = Subtract<IPyramidChartProps, IPyramidChartBucketProps>;

const generatePyramidDimensionsFromBuckets = (buckets: VisualizationObject.IBucket[]) =>
    generateDefaultDimensionsForRoundChart(convertBucketsToAFM(buckets));

export function PyramidChart(props: IPyramidChartProps): JSX.Element {
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
    const newProps: IPyramidChartNonBucketProps = omit<IPyramidChartProps, keyof IPyramidChartBucketProps>(
        props,
        ["measures", "viewBy", "filters", "sortBy"],
    );

    return (
        <AfmPyramidChart
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy, generatePyramidDimensionsFromBuckets)}
        />
    );
}
