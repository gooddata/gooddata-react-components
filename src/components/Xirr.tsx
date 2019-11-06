// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import { VisualizationInput } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { Xirr as AfmXirr } from "./afm/Xirr";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM } from "../helpers/conversion";
import { MEASURES, ATTRIBUTE } from "../constants/bucketNames";

export interface IXirrBucketProps {
    measure: VisualizationInput.IMeasure;
    attribute: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
}

export interface IXirrProps extends ICommonChartProps, IXirrBucketProps {
    projectId: string;
}

type IXirrNonBucketProps = Subtract<IXirrProps, IXirrBucketProps>;

/**
 * Xirr
 * is a component with bucket props measure, attribute, filters
 */
export function Xirr(props: IXirrProps): JSX.Element {
    const buckets = [
        {
            localIdentifier: MEASURES,
            items: [props.measure],
        },
        {
            localIdentifier: ATTRIBUTE,
            items: [props.attribute],
        },
    ];

    const newProps: IXirrNonBucketProps = omit<IXirrProps, keyof IXirrBucketProps>(props, [
        "measure",
        "attribute",
        "filters",
    ]);

    return <AfmXirr {...newProps} afm={convertBucketsToAFM(buckets, props.filters)} />;
}
