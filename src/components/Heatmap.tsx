// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationObject, VisualizationInput } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { Heatmap as AfmHeatmap } from "./afm/Heatmap";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, mergeSeparatorsIntoMeasures } from "../helpers/conversion";
import { getResultSpec } from "../helpers/resultSpec";
import { getHeatmapDimensionsFromBuckets } from "../helpers/dimensions";
import { MEASURES, VIEW, STACK } from "../constants/bucketNames";

export interface IHeatmapBucketProps {
    measure: VisualizationInput.AttributeOrMeasure;
    rows?: VisualizationInput.IAttribute;
    columns?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IHeatmapProps extends ICommonChartProps, IHeatmapBucketProps {
    projectId: string;
}

type IHeatmapNonBucketProps = Subtract<IHeatmapProps, IHeatmapBucketProps>;

export function Heatmap(props: IHeatmapProps): JSX.Element {
    const measures = mergeSeparatorsIntoMeasures(
        props.config && props.config.separators,
        [props.measure] || [],
    );

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: measures,
        },
        {
            localIdentifier: VIEW,
            items: props.rows ? [props.rows] : [],
        },
        {
            localIdentifier: STACK,
            items: props.columns ? [props.columns] : [],
        },
    ];

    const newProps: IHeatmapNonBucketProps = omit<IHeatmapProps, keyof IHeatmapBucketProps>(props, [
        "measure",
        "rows",
        "columns",
        "filters",
        "sortBy",
    ]);

    return (
        <AfmHeatmap
            {...newProps}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy, getHeatmapDimensionsFromBuckets)}
        />
    );
}
