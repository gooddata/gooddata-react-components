// (C) 2020 GoodData Corporation
import { Execution, VisualizationObject } from "@gooddata/typings";

import { parseValue } from "../../utils/common";
import { IPointData } from "../../../../interfaces/Config";
import { unwrap } from "../../../../helpers/utils";
import { IColorStrategy } from "../colorFactory";
import { MEASURES, SECONDARY_MEASURES, TERTIARY_MEASURES } from "../../../../constants/bucketNames";
import { MAX_POINT_WIDTH } from "../highcharts/commonConfiguration";

export const SUPPORTED_MEASURE_BUCKETS: ReadonlyArray<VisualizationObject.Identifier> = [
    MEASURES,
    SECONDARY_MEASURES,
    TERTIARY_MEASURES,
];

const PRIMARY_VS_COMPARATIVE_MEASURE_HEIGHT_RATIO = 0.75;

const isComparativeMeasurePresent = (bucketLocalIdentifiers: VisualizationObject.Identifier[]) =>
    bucketLocalIdentifiers.includes(TERTIARY_MEASURES);

const isTargetMeasurePresent = (bucketLocalIdentifiers: VisualizationObject.Identifier[]) =>
    bucketLocalIdentifiers.includes(SECONDARY_MEASURES);

const getValue = (
    value: number,
    isTarget: boolean,
): {
    y: number;
    target?: number;
} =>
    isTarget
        ? {
              target: value === null ? 0 : value,
              y: 0,
          }
        : {
              y: value,
          };

const getSeriesItemData = (
    seriesItem: string[],
    measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
    seriesIndex: number,
    measureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
) =>
    seriesItem.map((pointValue: string) => {
        const value = parseValue(pointValue);
        const isTarget = isTargetSeries(seriesIndex, measureBucketsLocalIdentifiers);
        const nullValueProps =
            isTarget && value === null ? { isNullTarget: true, className: "hidden-empty-series" } : {};

        return {
            ...nullValueProps,
            ...getValue(value, isTarget),
            format: unwrap(measureGroup.items[seriesIndex]).format,
            marker: {
                enabled: pointValue !== null,
            },
            name: unwrap(measureGroup.items[seriesIndex]).name,
        };
    });

const getPrimarySeriesMaxPointWidth = (onlyPrimaryMeasure: boolean) => {
    if (!onlyPrimaryMeasure) {
        return MAX_POINT_WIDTH * PRIMARY_VS_COMPARATIVE_MEASURE_HEIGHT_RATIO;
    }
    return MAX_POINT_WIDTH;
};

const getPrimarySeries = (seriesItemConfig: IPointData, onlyPrimaryMeasure: boolean) => ({
    ...seriesItemConfig,
    pointPadding: onlyPrimaryMeasure ? 0.1 : 0.2,
    maxPointWidth: getPrimarySeriesMaxPointWidth(onlyPrimaryMeasure),
    zIndex: 1,
    bulletChartMeasureType: "primary",
});

const getTargetSeries = (seriesItemConfig: IPointData) => ({
    ...seriesItemConfig,
    type: "bullet",
    pointPadding: 0,
    targetOptions: {
        width: "100%",
    },
    zIndex: 2,
    bulletChartMeasureType: "target",
});

const getComparativeSeries = (seriesItemConfig: IPointData) => ({
    ...seriesItemConfig,
    pointPadding: 0,
    zIndex: 0,
    bulletChartMeasureType: "comparative",
});

export const isPrimarySeries = (
    seriesIndex: number,
    bucketsLocalIdentifiers: VisualizationObject.Identifier[],
) => seriesIndex === bucketsLocalIdentifiers.indexOf(MEASURES);

export const isTargetSeries = (
    seriesIndex: number,
    bucketsLocalIdentifiers: VisualizationObject.Identifier[],
) => seriesIndex === bucketsLocalIdentifiers.indexOf(SECONDARY_MEASURES);

export const isComparativeSeries = (
    seriesIndex: number,
    bucketsLocalIdentifiers: VisualizationObject.Identifier[],
) => seriesIndex === bucketsLocalIdentifiers.indexOf(TERTIARY_MEASURES);

const getSeries = (
    seriesIndex: number,
    seriesItemConfig: IPointData,
    measureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
) => {
    if (isTargetSeries(seriesIndex, measureBucketsLocalIdentifiers)) {
        return getTargetSeries(seriesItemConfig);
    } else if (isComparativeSeries(seriesIndex, measureBucketsLocalIdentifiers)) {
        return getComparativeSeries(seriesItemConfig);
    }

    const onlyPrimaryMeasure =
        !isComparativeMeasurePresent(measureBucketsLocalIdentifiers) &&
        !isTargetMeasurePresent(measureBucketsLocalIdentifiers);
    return getPrimarySeries(seriesItemConfig, onlyPrimaryMeasure);
};

export function getBulletChartSeries(
    executionResultData: Execution.DataValue[][],
    measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
    colorStrategy: IColorStrategy,
    occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
) {
    return executionResultData.map((seriesItem: string[], seriesIndex: number) => {
        const seriesItemData = getSeriesItemData(
            seriesItem,
            measureGroup,
            seriesIndex,
            occupiedMeasureBucketsLocalIdentifiers,
        );

        const seriesItemConfig: IPointData = {
            legendIndex: seriesIndex,
            data: seriesItemData,
            name: measureGroup.items[seriesIndex].measureHeaderItem.name,
            color: colorStrategy.getColorByIndex(seriesIndex),
        };

        return getSeries(seriesIndex, seriesItemConfig, occupiedMeasureBucketsLocalIdentifiers);
    });
}
