// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { BulletChart as AfmBulletChart } from "./afm/BulletChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, convertBucketsToMdObject } from "../helpers/conversion";
import { getStackingResultSpec } from "../helpers/resultSpec";
import { MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES, ATTRIBUTE } from "../constants/bucketNames";
import { getViewByTwoAttributes, sanitizeConfig } from "../helpers/optionalStacking/common";
import { disableBucketItemComputeRatio } from "../helpers/utils";

export interface IBulletChartBucketProps {
    primaryMeasure: VisualizationInput.AttributeOrMeasure;
    targetMeasure?: VisualizationInput.AttributeOrMeasure;
    comparativeMeasure?: VisualizationInput.AttributeOrMeasure;
    viewBy?: VisualizationInput.IAttribute[];
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IBulletChartProps extends ICommonChartProps, IBulletChartBucketProps {
    projectId: string;
}

type IBulletChartNonBucketProps = Subtract<IBulletChartProps, IBulletChartBucketProps>;

/**
 * [BulletChart](http://sdk.gooddata.com/gooddata-ui/docs/bullet_chart_component.html)
 */
export function BulletChart(props: IBulletChartProps): JSX.Element {
    const viewBy = getViewByTwoAttributes(props.viewBy); // could be one or two attributes

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: props.primaryMeasure ? [disableBucketItemComputeRatio(props.primaryMeasure)] : [],
        },
        {
            localIdentifier: SECONDARY_MEASURES,
            items: props.targetMeasure ? [disableBucketItemComputeRatio(props.targetMeasure)] : [],
        },
        {
            localIdentifier: TERTIARY_MEASURES,
            items: props.comparativeMeasure ? [disableBucketItemComputeRatio(props.comparativeMeasure)] : [],
        },
        {
            localIdentifier: ATTRIBUTE,
            items: viewBy,
        },
    ];

    const newProps: IBulletChartNonBucketProps = omit<IBulletChartProps, keyof IBulletChartBucketProps>(
        props,
        ["primaryMeasure", "targetMeasure", "comparativeMeasure", "viewBy", "filters", "sortBy"],
    );
    const sanitizedConfig = sanitizeConfig(
        [
            disableBucketItemComputeRatio(props.primaryMeasure),
            disableBucketItemComputeRatio(props.targetMeasure),
            disableBucketItemComputeRatio(props.comparativeMeasure),
        ],
        {
            ...newProps.config,
            mdObject: convertBucketsToMdObject(buckets, props.filters, "local:bullet"),
        },
    );

    return (
        <AfmBulletChart
            {...newProps}
            config={sanitizedConfig}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getStackingResultSpec(buckets, props.sortBy)}
        />
    );
}
