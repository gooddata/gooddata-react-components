// (C) 2020 GoodData Corporation
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";

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
    tooltipText?: VisualizationInput.IAttribute;
    zoom?: number;
}
