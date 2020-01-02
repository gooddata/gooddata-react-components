// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import noop = require("lodash/noop");
import get = require("lodash/get");
import { VisualizationObject } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { GeoChart as CoreGeoChart } from "./core/GeoChart";
import { dataSourceProvider } from "./afm/DataSourceProvider";
import { convertBucketsToAFM, convertBucketsToMdObject } from "../helpers/conversion";
import { getGeoChartDimensions } from "../helpers/dimensions";
import { getResultSpec } from "../helpers/resultSpec";
import { IGeoChartBucketProps, IGeoChartProps } from "./../interfaces/GeoChart";

import { COLOR, LOCATION, SEGMENT, SIZE, TOOLTIP_TEXT } from "../constants/bucketNames";

export const getBuckets = (props: IGeoChartProps): VisualizationObject.IBucket[] => {
    const { color, location, segmentBy, size, config } = props;
    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: SIZE,
            items: size ? [size] : [],
        },
        {
            localIdentifier: COLOR,
            items: color ? [color] : [],
        },
        {
            localIdentifier: LOCATION,
            items: location ? [location] : [],
        },
        {
            localIdentifier: SEGMENT,
            items: segmentBy ? [segmentBy] : [],
        },
    ];
    const tooltipText = get(config, TOOLTIP_TEXT);
    if (tooltipText) {
        buckets.push({
            localIdentifier: TOOLTIP_TEXT,
            items: [tooltipText] || [],
        });
    }
    return buckets;
};

// noop is never called because resultSpec is always provided
const DataSourceProvider = dataSourceProvider(CoreGeoChart, noop as any, "GeoChart");

type IGeoChartNonBucketProps = Subtract<IGeoChartProps, IGeoChartBucketProps>;

export function GeoChart(props: IGeoChartProps): JSX.Element {
    const { sortBy, filters, exportTitle } = props;

    const buckets: VisualizationObject.IBucket[] = getBuckets(props);

    const afm = convertBucketsToAFM(buckets, filters);

    const resultSpec = getResultSpec(buckets, sortBy, getGeoChartDimensions);

    const newProps: IGeoChartNonBucketProps = omit<IGeoChartProps, keyof IGeoChartBucketProps>({ ...props }, [
        "color",
        "location",
        "segmentBy",
        "size",
        "filters",
        "sortBy",
    ]);
    newProps.config = {
        ...newProps.config,
        mdObject: convertBucketsToMdObject(buckets, props.filters, "local:geo"),
    };

    return <DataSourceProvider {...newProps} afm={afm} resultSpec={resultSpec} exportTitle={exportTitle} />;
}
