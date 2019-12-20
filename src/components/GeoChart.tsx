// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { VisualizationObject, VisualizationInput } from "@gooddata/typings";
import omit = require("lodash/omit");
import noop = require("lodash/noop");

import { Subtract } from "../typings/subtract";
import { GeoChart as CoreGeoChart } from "./core/GeoChart";
import { dataSourceProvider } from "./afm/DataSourceProvider";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM } from "../helpers/conversion";
import { getGeoChartDimensions } from "../helpers/dimensions";
import { getResultSpec } from "../helpers/resultSpec";

import { COLOR, LOCATION, SEGMENT, SIZE } from "../constants/bucketNames";
import { hasDuplicateIdentifiers } from "../helpers/errorHandlers";

export interface IGeoChartBucketProps {
    color?: VisualizationInput.AttributeOrMeasure;
    location?: VisualizationInput.IAttribute;
    segmentBy?: VisualizationInput.IAttribute;
    size?: VisualizationInput.AttributeOrMeasure;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IGeoChartProps extends ICommonChartProps, IGeoChartBucketProps {
    projectId: string;
    exportTitle?: string;
}

export const getBuckets = (props: IGeoChartBucketProps): VisualizationObject.IBucket[] => {
    const { color, location, segmentBy, size } = props;
    return [
        {
            localIdentifier: COLOR,
            items: [color],
        },
        {
            localIdentifier: SIZE,
            items: [size],
        },
        {
            localIdentifier: LOCATION,
            items: [location],
        },
        {
            localIdentifier: SEGMENT,
            items: [segmentBy],
        },
    ];
};

// noop is never called because resultSpec is always provided
const DataSourceProvider = dataSourceProvider(CoreGeoChart, noop as any, "GeoChart");

type IGeoChartNonBucketProps = Subtract<IGeoChartProps, IGeoChartBucketProps>;
/**
 * Update link to documentation [GeoChart](https://sdk.gooddata.com/gooddata-ui/docs/next/geo_chart_component.html)
 * is a component with bucket props color, location, segmentBy, size, sortBy, filters
 */
export class GeoChart extends React.Component<IGeoChartProps> {
    public render() {
        const { sortBy, filters, exportTitle } = this.props;

        const buckets: VisualizationObject.IBucket[] = getBuckets(this.props);

        const afm = convertBucketsToAFM(buckets, filters);

        const resultSpec = getResultSpec(buckets, sortBy, getGeoChartDimensions);

        hasDuplicateIdentifiers(buckets);

        const newProps: IGeoChartNonBucketProps = omit<IGeoChartProps, keyof IGeoChartBucketProps>(
            this.props,
            ["color", "location", "segmentBy", "size", "filters", "sortBy"],
        );

        return (
            <DataSourceProvider {...newProps} afm={afm} resultSpec={resultSpec} exportTitle={exportTitle} />
        );
    }
}
