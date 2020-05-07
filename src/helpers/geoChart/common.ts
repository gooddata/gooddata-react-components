// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import { VisualizationObject, Execution, VisualizationInput } from "@gooddata/typings";
import { IChartConfig, IColorAssignment } from "../../interfaces/Config";
import { IGeoConfig, IGeoData, IGeoPointsConfig } from "../../interfaces/GeoChart";
import { LOCATION } from "../../constants/bucketNames";

export function getGeoAttributeHeaderItems(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
): Execution.IResultHeaderItem[][] {
    const { color, size } = geoData;

    const hasColorMeasure = color !== undefined;
    const hasSizeMeasure = size !== undefined;
    const attrHeaderItemIndex = hasColorMeasure || hasSizeMeasure ? 1 : 0;
    const attributeHeaderItems = executionResult.headerItems[attrHeaderItemIndex];

    return attributeHeaderItems;
}

export function isDataOfReasonableSize(
    executionResult: Execution.IExecutionResult,
    geoData: IGeoData,
    limit: number,
): boolean {
    const { location } = geoData;

    const attributeHeaderItems = getGeoAttributeHeaderItems(executionResult, geoData);
    const locationData = location !== undefined ? attributeHeaderItems[location.index] : [];

    return locationData.length <= limit;
}

export function isLocationMissing(buckets: VisualizationObject.IBucket[]): boolean {
    const locationBucket: VisualizationObject.IBucket = buckets.find(
        (bucket: VisualizationObject.IBucket) => bucket.localIdentifier === LOCATION,
    );
    return !locationBucket || !locationBucket.items.length;
}

export function calculateAverage(values: number[] = []): number {
    if (!values.length) {
        return 0;
    }
    return values.reduce((a: number, b: number): number => a + b, 0) / values.length;
}

export function getFormatFromExecutionResponse(
    result: Execution.IExecutionResponse,
    indexMeasure: number,
): string {
    return get(
        result,
        `dimensions[0].headers[0].measureGroupHeader.items[${indexMeasure}].measureHeaderItem.format`,
    );
}

// show clusters when there is location attribute only
export function isClusteringAllowed(geoData: IGeoData, groupNearbyPoints: boolean = true): boolean {
    const { color, location, segment, size } = geoData;
    return groupNearbyPoints && location && !(color || segment || size);
}

export function isGeoConfig(config: IChartConfig | IGeoConfig): config is IGeoConfig {
    return (config as IGeoConfig).mapboxToken !== undefined;
}

export function isChartConfig(config: IChartConfig | IGeoConfig): config is IChartConfig {
    return !isGeoConfig(config);
}

export function isPointsConfigChanged(
    prevPointsConfig: IGeoPointsConfig,
    pointsConfig: IGeoPointsConfig,
): boolean {
    return !isEqual(prevPointsConfig, pointsConfig);
}

export function isFluidLegendEnabled(responsive: boolean, showFluidLegend: boolean): boolean {
    return responsive && showFluidLegend;
}

export function isColorAssignmentItemChanged(
    prevColorAssigment: IColorAssignment[],
    colorAssigment: IColorAssignment[],
): boolean {
    return !isEqual(prevColorAssigment, colorAssigment);
}

export function isTooltipTextValueString(
    tooltipText: VisualizationInput.IAttribute | string,
): tooltipText is string {
    return typeof tooltipText === "string";
}
