// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";

import { parseValue } from "../../utils/common";
import { IPointData, ISeriesItem } from "../../../../interfaces/Config";
import { unwrap } from "../../../../helpers/utils";
import { IColorStrategy } from "../colorFactory";
import { SECONDARY_MEASURES, TERTIARY_MEASURES } from "../../../../constants/bucketNames";
import { filterOutEmptyBuckets } from "../../../../helpers/mdObjBucketHelper";
import { MAX_POINT_WIDTH } from "../highcharts/commonConfiguration";

export type IBucketLocalIdentifier = VisualizationObject.IBucket["localIdentifier"];

const isComparativeMeasurePresent = (bucketLocalIdentifiers: IBucketLocalIdentifier[]) =>
    bucketLocalIdentifiers.includes(TERTIARY_MEASURES);

const getValue = (
    value: string,
    seriesIndex: number,
    bucketsLocalIdentifiers: IBucketLocalIdentifier[],
): {
    y: number;
    target?: number;
} =>
    isTargetSeries(seriesIndex, bucketsLocalIdentifiers)
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
    bucketsLocalIdentifiers: IBucketLocalIdentifier[],
): IPointData[] =>
    seriesItem.map((pointValue: string) => ({
        ...getValue(pointValue, seriesIndex, bucketsLocalIdentifiers),
        format: unwrap(measureGroup.items[seriesIndex]).format,
        marker: {
            enabled: pointValue !== null,
        },
        name: unwrap(measureGroup.items[seriesIndex]).name,
    }));

const getPrimarySeriesMaxPointWidth = (comparativeMeasurePresent: boolean) => {
    if (comparativeMeasurePresent) {
        return (MAX_POINT_WIDTH / 4) * 3;
    }
    return MAX_POINT_WIDTH;
};

const getPrimarySeries = (
    seriesItemConfig: IPointData,
    colorStrategy: IColorStrategy,
    comparativeMeasurePresent: boolean,
) => ({
    ...seriesItemConfig,
    color: colorStrategy.getColorByIndex(0),
    pointPadding: comparativeMeasurePresent ? 0.2 : 0.1,
    maxPointWidth: getPrimarySeriesMaxPointWidth(comparativeMeasurePresent),
    zIndex: 1,
});

const getTargetSeries = (seriesItemConfig: IPointData, colorStrategy: IColorStrategy) => ({
    ...seriesItemConfig,
    color: colorStrategy.getColorByIndex(1),
    type: "bullet",
    pointPadding: 0,
    targetOptions: {
        width: "100%",
    },
    zIndex: 2,
});

const getComparativeSeries = (seriesItemConfig: IPointData, colorStrategy: IColorStrategy) => ({
    ...seriesItemConfig,
    pointPadding: 0,
    color: colorStrategy.getColorByIndex(2),
    zIndex: 0,
});

const isTargetSeries = (seriesIndex: number, bucketsLocalIdentifiers: IBucketLocalIdentifier[]) =>
    seriesIndex === bucketsLocalIdentifiers.indexOf(SECONDARY_MEASURES);

const isComparativeSeries = (seriesIndex: number, bucketsLocalIdentifiers: IBucketLocalIdentifier[]) =>
    seriesIndex === bucketsLocalIdentifiers.indexOf(TERTIARY_MEASURES);

const getSeries = (
    seriesIndex: number,
    seriesItemConfig: IPointData,
    bucketsLocalIdentifiers: IBucketLocalIdentifier[],
    colorStrategy: IColorStrategy,
) => {
    if (isTargetSeries(seriesIndex, bucketsLocalIdentifiers)) {
        return getTargetSeries(seriesItemConfig, colorStrategy);
    } else if (isComparativeSeries(seriesIndex, bucketsLocalIdentifiers)) {
        return getComparativeSeries(seriesItemConfig, colorStrategy);
    }

    const comparativeMeasurePresent = isComparativeMeasurePresent(bucketsLocalIdentifiers);
    return getPrimarySeries(seriesItemConfig, colorStrategy, comparativeMeasurePresent);
};

export function getBulletChartSeries(
    executionResultData: Execution.DataValue[][],
    measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
    colorStrategy: IColorStrategy,
    buckets: VisualizationObject.IBucket[],
): ISeriesItem[] {
    const notEmptyMeasureBucketsLocalIdentifiers = filterOutEmptyBuckets(buckets).map(
        bucket => bucket.localIdentifier,
    );

    return executionResultData.map((seriesItem: string[], seriesIndex: number) => {
        const seriesItemData = getSeriesItemData(
            seriesItem,
            measureGroup,
            seriesIndex,
            notEmptyMeasureBucketsLocalIdentifiers,
        );

        const seriesItemConfig: IPointData = {
            legendIndex: seriesIndex,
            data: seriesItemData,
            name: measureGroup.items[seriesIndex].measureHeaderItem.name,
        };

        return getSeries(
            seriesIndex,
            seriesItemConfig,
            notEmptyMeasureBucketsLocalIdentifiers,
            colorStrategy,
        );
    });
}
