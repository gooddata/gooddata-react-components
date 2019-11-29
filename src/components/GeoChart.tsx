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
// import { IGeoChartConfig } from "../interfaces/GeoChart";

import { MEASURES, ATTRIBUTE, COLUMNS } from "../constants/bucketNames";
import { hasDuplicateIdentifiers } from "../helpers/errorHandlers";

export interface IGeoChartBucketProps {
    measures?: VisualizationInput.AttributeOrMeasure[];
    rows?: VisualizationInput.IAttribute[];
    columns?: VisualizationInput.IAttribute[];
    totals?: VisualizationInput.ITotal[];
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IGeoChartProps extends ICommonChartProps, IGeoChartBucketProps {
    projectId: string;
    // pageSize?: number;
    config?: {}; // IGeoChartConfig;
    // groupRows?: boolean;
    exportTitle?: string;
}

export const getBuckets = (props: IGeoChartBucketProps): VisualizationObject.IBucket[] => {
    const { measures, rows, columns, totals } = props;

    return [
        {
            localIdentifier: MEASURES,
            items: measures || [],
        },
        {
            // ATTRIBUTE for backwards compatibility with Table component. Actually ROWS
            localIdentifier: ATTRIBUTE,
            items: rows || [],
            totals: totals || [],
        },
        {
            localIdentifier: COLUMNS,
            items: columns || [],
        },
    ];
};

// noop is never called because resultSpec is always provided
const DataSourceProvider = dataSourceProvider(CoreGeoChart, noop as any, "GeoChart");

type IGeoChartNonBucketProps = Subtract<IGeoChartProps, IGeoChartBucketProps>;
/**
 * Update link to documentation [GeoChart](https://sdk.gooddata.com/gooddata-ui/docs/next/pivot_table_component.html)
 * is a component with bucket props measures, rows, columns, totals, sortBy, filters
 */
export class GeoChart extends React.Component<IGeoChartProps> {
    public static defaultProps: Partial<IGeoChartProps> = {
        // groupRows: true,
    };

    public render() {
        const { sortBy, filters, exportTitle } = this.props;

        const buckets: VisualizationObject.IBucket[] = getBuckets(this.props);

        const afm = convertBucketsToAFM(buckets, filters);

        const resultSpec = getResultSpec(buckets, sortBy, getGeoChartDimensions);

        hasDuplicateIdentifiers(buckets);

        const newProps: IGeoChartNonBucketProps = omit<IGeoChartProps, keyof IGeoChartBucketProps>(
            this.props,
            ["measures", "rows", "columns", "totals", "filters", "sortBy"],
        );

        return (
            <DataSourceProvider {...newProps} afm={afm} resultSpec={resultSpec} exportTitle={exportTitle} />
        );
    }
}
