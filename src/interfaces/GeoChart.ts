// (C) 2020 GoodData Corporation
import { ISeparators } from "@gooddata/numberjs";
import { VisualizationInput, VisualizationObject } from "@gooddata/typings";
import { ICommonChartProps } from "../components/core/base/BaseChart";

export interface IGeoLngLat {
    lat: number;
    lng: number;
}

export interface IGeoLngLatBounds {
    northEast: IGeoLngLat;
    southWest: IGeoLngLat;
}

export interface IGeoTooltipItem {
    title: string;
    value: string | number;
    format?: string;
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

export interface IGeoAttributeItem extends IGeoDataItem {
    data: string[];
}

export interface IGeoLocationItem extends IGeoDataItem {
    data: IGeoLngLat[];
}

export interface IGeoMeasureItem extends IGeoDataItem {
    format: string;
    data: number[];
}

export interface IGeoData {
    location?: IGeoLocationItem;
    size?: IGeoMeasureItem;
    color?: IGeoMeasureItem;
    segment?: IGeoAttributeItem;
    tooltipText?: IGeoAttributeItem;
}

export type IGeoConfigViewportArea =
    | "auto" // default, Include all data
    | "continent_af" // Africa
    | "continent_as" // Asia
    | "continent_au" // Australia + NZ
    | "continent_eu" // Europe
    | "continent_na" // North America
    | "continent_sa" // South America
    | "world";

export interface IGeoConfigViewport {
    area?: IGeoConfigViewportArea;
}

export interface IGeoViewports {
    [key: string]: mapboxgl.LngLatBoundsLike;
}

export interface IGeoConfig {
    center?: IGeoLngLat;
    isExportMode?: boolean;
    limit?: number;
    mdObject?: VisualizationObject.IVisualizationObjectContent;
    selectedSegmentItems?: string[];
    tooltipText?: VisualizationInput.IAttribute;
    zoom?: number; // in the 0-22 zoom range
    mapboxToken: string;
    separators?: ISeparators;
    viewport?: IGeoConfigViewport;
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

export interface IPushpinCategoryLegendItem {
    name: string;
    color?: string;
    legendIndex: number;
    isVisible?: boolean;
}

export interface IValidationResult {
    isDataTooLarge: boolean;
}
