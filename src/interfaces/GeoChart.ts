// (C) 2019-2020 GoodData Corporation
import { VisualizationInput } from "@gooddata/typings";
import { ICommonChartProps } from "../components/core/base/BaseChart";
export interface ICoordinates {
    longitude: number;
    latitude: number;
}
export interface IGeoChartBucketProps {
    location?: VisualizationInput.IAttribute;
    size?: VisualizationInput.AttributeOrMeasure;
    color?: VisualizationInput.AttributeOrMeasure;
    segmentBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IGeoChartProps extends ICommonChartProps, IGeoChartBucketProps {
    projectId: string;
    exportTitle?: string;
}
