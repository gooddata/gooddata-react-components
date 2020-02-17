// (C) 2020 GoodData Corporation
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";
import { ICommonChartProps } from "../components/core/base/BaseChart";

export interface IGeoTooltipItem {
    title: string;
    value: string;
}

export interface IObjectMapping {
    [property: string]: string | number | object | null;
}

export interface IPushpinColor {
    border: string;
    background: string;
}

export interface IGeoDataItem {
    name: string;
    index: number;
}

export interface IGeoData {
    color?: IGeoDataItem;
    location?: IGeoDataItem;
    segment?: IGeoDataItem;
    size?: IGeoDataItem;
    tooltipText?: IGeoDataItem;
}

export interface IGeoConfig {
    center?: [number, number];
    limit?: number;
    mdObject?: VisualizationObject.IVisualizationObjectContent;
    selectedSegmentItem?: string;
    tooltipText?: VisualizationInput.IAttribute;
    zoom?: number;
    mapboxAccessToken: string;
}

export interface IGeoPushpinChartProps extends ICommonChartProps {
    config?: IGeoConfig;
    projectId: string;
    exportTitle?: string;

    location: VisualizationInput.IAttribute;
    size?: VisualizationInput.AttributeOrMeasure;
    color?: VisualizationInput.AttributeOrMeasure;
    segmentBy?: VisualizationInput.IAttribute;

    filters?: VisualizationInput.IFilter[];
    sortBy?: VisualizationInput.ISort[];
}
