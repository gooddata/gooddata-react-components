// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { BulletChart as AfmBulletChart } from "./afm/BulletChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM } from "../helpers/conversion";
import { getStackingResultSpec } from "../helpers/resultSpec";
import { MEASURES, ATTRIBUTE } from "../constants/bucketNames";
import {
    getViewByTwoAttributes,
    sanitizeConfig,
    disableBucketItemComputeRatio,
} from "../helpers/optionalStacking/common";

export interface IBulletChartBucketProps {
    primaryMeasure: VisualizationInput.AttributeOrMeasure;
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
    const measures = [disableBucketItemComputeRatio(props.primaryMeasure)];
    const viewBy = getViewByTwoAttributes(props.viewBy); // could be one or two attributes

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: measures,
        },
        {
            localIdentifier: ATTRIBUTE,
            items: viewBy,
        },
    ];

    const newProps: IBulletChartNonBucketProps = omit<IBulletChartProps, keyof IBulletChartBucketProps>(
        props,
        ["primaryMeasure", "viewBy", "filters", "sortBy"],
    );
    const sanitizedConfig = sanitizeConfig(measures, newProps.config);

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
