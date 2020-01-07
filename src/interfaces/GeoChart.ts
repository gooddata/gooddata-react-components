// (C) 2020 GoodData Corporation
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";
import { ICommonChartProps } from "../components/core/base/BaseChart";

export interface IGeoDataIndex {
    color?: number;
    location?: number;
    segmentBy?: number;
    size?: number;
    tooltipText?: number;
}

export interface IGeoConfig {
    center?: [number, number];
    mdObject?: VisualizationObject.IVisualizationObjectContent;
    selectedSegmentItem?: string;
    tooltipText?: VisualizationInput.IAttribute;
    zoom?: number;
}

export interface IGeoPushpinChartBucketProps {
    location: VisualizationInput.IAttribute;
    size?: VisualizationInput.AttributeOrMeasure;
    color?: VisualizationInput.AttributeOrMeasure;
    segmentBy?: VisualizationInput.IAttribute;
    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IGeoPushpinChartProps extends ICommonChartProps, IGeoPushpinChartBucketProps {
    config?: IGeoConfig;
    projectId: string;
    exportTitle?: string;
}
