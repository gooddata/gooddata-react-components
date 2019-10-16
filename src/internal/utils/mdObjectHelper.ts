// (C) 2019 GoodData Corporation
import get = require("lodash/get");
import { VisualizationObject } from "@gooddata/typings";
import { getMeasuresFromMdObject } from "./bucketHelper";
import * as BucketNames from "../../constants/bucketNames";
import { IAxisConfig } from "../../interfaces/Config";
import { IVisualizationProperties } from "../interfaces/Visualization";
import { isBarChart, isBubbleChart, isScatterPlot } from "../../components/visualizations/utils/common";
import { getBucketItems } from "../../helpers/mdObjBucketHelper";

function isAttribute(item: VisualizationObject.BucketItem): boolean {
    const attribute = item as VisualizationObject.IVisualizationAttribute;
    return attribute.visualizationAttribute !== undefined;
}

function findBucketByLocalIdentifier(buckets: VisualizationObject.IBucket[], bucketName: string) {
    return (buckets || []).find(bucket => get(bucket, "localIdentifier") === bucketName);
}

export function hasAttribute(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject.buckets.some(bucket => {
        return bucket.items.some(isAttribute);
    });
}

export function haveManyViewItems(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    const viewBucket = mdObject && findBucketByLocalIdentifier(mdObject.buckets, BucketNames.VIEW);
    return viewBucket && get(viewBucket, "items").length > 1;
}

export function hasOneViewItem(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    const viewBucket = mdObject && findBucketByLocalIdentifier(mdObject.buckets, BucketNames.VIEW);
    return viewBucket && get(viewBucket, "items").length === 1;
}

export function hasTertiaryMeasures(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject.buckets
        .filter(bucket => [BucketNames.TERTIARY_MEASURES].indexOf(get(bucket, "localIdentifier")) >= 0)
        .some(bucket => get(bucket, "items").length > 0);
}

export function isStacked(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return (
        mdObject &&
        mdObject.buckets
            .filter(
                bucket =>
                    [BucketNames.STACK, BucketNames.SEGMENT].indexOf(get(bucket, "localIdentifier")) >= 0,
            )
            .some(bucket => get(bucket, "items").length > 0)
    );
}

export function hasMeasures(mdObject: VisualizationObject.IVisualizationObjectContent): boolean {
    return mdObject && getMeasuresFromMdObject(mdObject).length > 0;
}

function areAllMeasuresOnSingleAxis(
    mdObject: VisualizationObject.IVisualizationObjectContent,
    secondaryYAxis: IAxisConfig,
): boolean {
    const measureCount = getMeasuresFromMdObject(mdObject).length;
    const numberOfMeasureOnSecondaryAxis = secondaryYAxis ? secondaryYAxis.measures.length : 0;
    return numberOfMeasureOnSecondaryAxis === 0 || measureCount === numberOfMeasureOnSecondaryAxis;
}

// don't support sort by total value for dual axis and group of categories
export function canSortStackTotalValue(
    mdObject: VisualizationObject.IVisualizationObjectContent,
    supportedControls: IVisualizationProperties,
): boolean {
    return (
        get(supportedControls, "stackMeasures", false) &&
        areAllMeasuresOnSingleAxis(mdObject, get(supportedControls, "secondary_yaxis", false)) &&
        hasOneViewItem(mdObject)
    );
}

export function countItemsInMdObject(mdObject: VisualizationObject.IVisualizationObjectContent) {
    if (!mdObject) {
        return {};
    }

    const { buckets } = mdObject;

    const viewByItemCount: number = getBucketItems(buckets, BucketNames.VIEW).length;
    const measureItemCount: number = getBucketItems(buckets, BucketNames.MEASURES).length;
    const secondaryMeasureItemCount: number = getBucketItems(buckets, BucketNames.SECONDARY_MEASURES).length;

    return {
        viewByItemCount,
        measureItemCount,
        secondaryMeasureItemCount,
    };
}

export function countItemsOnAxes(
    type: string,
    controls: IVisualizationProperties,
    mdObject: VisualizationObject.IVisualizationObjectContent,
) {
    const isBarChartType = isBarChart(type);

    const { viewByItemCount, measureItemCount, secondaryMeasureItemCount } = countItemsInMdObject(mdObject);
    const totalMeasureItemCount = measureItemCount + secondaryMeasureItemCount;

    const secondaryMeasureCountInConfig = (isBarChartType
        ? get(controls, "secondary_xaxis.measures", [])
        : get(controls, "secondary_yaxis.measures", [])
    ).length;

    if (isBarChartType) {
        return {
            yaxis: viewByItemCount,
            xaxis: totalMeasureItemCount - secondaryMeasureCountInConfig,
            secondary_xaxis: secondaryMeasureCountInConfig,
        };
    }

    if (isScatterPlot(type) || isBubbleChart(type)) {
        return {
            xaxis: measureItemCount,
            yaxis: secondaryMeasureItemCount,
        };
    }

    return {
        xaxis: viewByItemCount,
        yaxis: totalMeasureItemCount - secondaryMeasureCountInConfig,
        secondary_yaxis: secondaryMeasureCountInConfig,
    };
}
