// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";

import { parseValue } from "../../utils/common";
import { IPointData, ISeriesItemConfig, ISeriesItem } from "../../../../interfaces/Config";
import { unwrap } from "../../../../helpers/utils";
import { IColorStrategy } from "../colorFactory";
import get = require("lodash/get");
import { isBucketEmpty } from "../../../../helpers/mdObjBucketHelper";
import { MEASURES, SECONDARY_MEASURES } from "../../../../constants/bucketNames";

const getValue = (
    value: string,
    isTarget: boolean,
): {
    y: number;
    target?: number;
} =>
    isTarget
        ? {
              target: parseValue(value),
              y: 0,
          }
        : {
              y: parseValue(value),
          };

const getSeriesItemData = (
    seriesItem: string[],
    measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
    seriesIndex: number,
    isTarget: boolean,
) =>
    seriesItem.map((pointValue: string) => {
        const pointData: IPointData = {
            ...getValue(pointValue, isTarget),
            format: unwrap(measureGroup.items[seriesIndex]).format,
            marker: {
                enabled: pointValue !== null,
            },
            name: unwrap(measureGroup.items[seriesIndex]).name,
        };

        return pointData;
    });

const isTargetSeries = (seriesIndex: number, mdObject: VisualizationObject.IVisualizationObjectContent) => {
    const buckets: VisualizationObject.IBucket[] = get(mdObject, "buckets", []);
    const primaryMeasureBucketEmpty = isBucketEmpty(buckets, MEASURES);
    const targetMeasureBucketEmpty = isBucketEmpty(buckets, SECONDARY_MEASURES);

    return seriesIndex === 1 && !targetMeasureBucketEmpty && !primaryMeasureBucketEmpty;
};

export function getBulletChartSeries(
    executionResultData: Execution.DataValue[][],
    measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
    colorStrategy: IColorStrategy,
    mdObject: VisualizationObject.IVisualizationObjectContent,
): ISeriesItem[] {
    return executionResultData.map((seriesItem: string[], seriesIndex: number) => {
        const isTarget = isTargetSeries(seriesIndex, mdObject);
        const seriesItemData = getSeriesItemData(seriesItem, measureGroup, seriesIndex, isTarget);

        const seriesItemConfig: ISeriesItemConfig = {
            color: colorStrategy.getColorByIndex(seriesIndex),
            legendIndex: seriesIndex,
            data: seriesItemData,
            type: isTarget ? "bullet" : "",
            name: measureGroup.items[seriesIndex].measureHeaderItem.name,
        };

        return seriesItemConfig;
    });
}
