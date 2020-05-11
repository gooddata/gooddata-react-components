// (C) 2007-2020 GoodData Corporation
import get = require("lodash/get");
import { VisualizationObject, AFM, VisualizationInput } from "@gooddata/typings";
import { DataLayer } from "@gooddata/gooddata-js";
import { IMeasureTitleProps, IArithmeticMeasureTitleProps } from "../interfaces/MeasureTitle";
import {
    ATTRIBUTE,
    MEASURES,
    COLUMNS,
    COLOR,
    LOCATION,
    SEGMENT,
    SIZE,
    TOOLTIP_TEXT,
} from "../constants/bucketNames";
import IMeasure = VisualizationObject.IMeasure;
import IArithmeticMeasureDefinition = VisualizationObject.IArithmeticMeasureDefinition;
import { IPivotTableBucketProps } from "../components/PivotTable";
import { mergeFiltersToAfm } from "./afmHelper";
import { findBucketByLocalIdentifier } from "./mdObjBucketHelper";
import { IAxisConfig } from "../interfaces/Config";
import { IGeoConfig, IGeoPushpinChartProps } from "../interfaces/GeoChart";
import { attribute } from "../helpers/model/attributes";
import { isTooltipTextValueString } from "./geoChart/common";

function getTotals(
    mdObject: VisualizationObject.IVisualizationObject,
): VisualizationObject.IVisualizationTotal[] {
    const attributes = mdObject.content.buckets.find(bucket => bucket.localIdentifier === ATTRIBUTE);
    return get(attributes, "totals", []);
}

function getVisualizationClassUri(mdObject: VisualizationObject.IVisualizationObject): string {
    return get(mdObject, "content.visualizationClass.uri", "");
}

/**
 * Build properties object used by the {ArithmeticMeasureTitleFactory} to not be dependent on the
 * {VisualizationObject.IMeasure}. It contains all the necessary properties related to the measure title.
 * @param measures - The measures that will be converted.
 * @return The array of {IMeasureTitleProps} objects.
 *
 * @internal
 */
function buildMeasureTitleProps(measures: IMeasure[]): IMeasureTitleProps[] {
    return measures.map(measure => ({
        localIdentifier: measure.measure.localIdentifier,
        title: measure.measure.title,
        alias: measure.measure.alias,
    }));
}

/**
 * Build properties object used by the {ArithmeticMeasureTitleFactory} to not be dependent on the
 * {VisualizationObject.IArithmeticMeasureDefinition}. It contains all the necessary properties from the arithmetic
 * measure.
 * @param measureDefinition - The definition of the arithmetic measure that will be converted.
 * @return {IArithmeticMeasureTitleProps}
 *
 * @internal
 */
function buildArithmeticMeasureTitleProps(
    measureDefinition: IArithmeticMeasureDefinition,
): IArithmeticMeasureTitleProps {
    const { operator, measureIdentifiers } = measureDefinition.arithmeticMeasure;
    return {
        operator,
        masterMeasureLocalIdentifiers: measureIdentifiers,
    };
}

export const mdObjectToGeoPushpinBucketProps = (
    config: IGeoConfig,
    mdObject: VisualizationObject.IVisualizationObject,
    filtersFromProps: AFM.ExtendedFilter[],
): Partial<IGeoPushpinChartProps> => {
    const hasVisualizationObjectContent = mdObject && mdObject.content;
    if (!hasVisualizationObjectContent) {
        return {};
    }

    const { content } = mdObject;
    const { buckets: contentBuckets } = content;

    const colorBucket = findBucketByLocalIdentifier(contentBuckets, COLOR);
    const locationBucket = findBucketByLocalIdentifier(contentBuckets, LOCATION);
    const segmentByBucket = findBucketByLocalIdentifier(contentBuckets, SEGMENT);
    const sizeBucket = findBucketByLocalIdentifier(contentBuckets, SIZE);

    const color: VisualizationInput.AttributeOrMeasure = colorBucket && colorBucket.items[0];
    const location: VisualizationInput.IAttribute =
        locationBucket && (locationBucket.items[0] as VisualizationObject.IVisualizationAttribute);
    const segmentBy: VisualizationInput.IAttribute =
        segmentByBucket && (segmentByBucket.items[0] as VisualizationObject.IVisualizationAttribute);
    const size: VisualizationInput.AttributeOrMeasure = sizeBucket && sizeBucket.items[0];

    const sortBy: VisualizationInput.ISort[] = [];

    const afmWithoutMergedFilters = DataLayer.toAfmResultSpec(content).afm;
    afmWithoutMergedFilters.filters = afmWithoutMergedFilters.filters || [];

    const afm = mergeFiltersToAfm(afmWithoutMergedFilters, filtersFromProps);

    // Filter out expression filters which are not supported in bucket interface
    const filters: VisualizationInput.IFilter[] = (afm.filters || []).filter(
        afmFilter => !AFM.isExpressionFilter(afmFilter),
    ) as VisualizationObject.VisualizationObjectExtendedFilter[];

    const { tooltipText: tooltipTextDisplayForm } = config;
    const configWithTooltipText: IGeoConfig = { ...config };
    if (tooltipTextDisplayForm && isTooltipTextValueString(tooltipTextDisplayForm)) {
        // tooltipText uri was built from properties.control
        configWithTooltipText.tooltipText = attribute(tooltipTextDisplayForm).localIdentifier(TOOLTIP_TEXT);
    }

    return {
        color,
        config: configWithTooltipText,
        location,
        segmentBy,
        size,
        filters,
        sortBy,
    };
};

export const mdObjectToPivotBucketProps = (
    mdObject: VisualizationObject.IVisualizationObject,
    filtersFromProps: AFM.ExtendedFilter[],
): IPivotTableBucketProps => {
    const measureBucket = mdObject.content.buckets.find(bucket => bucket.localIdentifier === MEASURES);
    const rowBucket = mdObject.content.buckets.find(bucket => bucket.localIdentifier === ATTRIBUTE);
    const columnBucket = mdObject.content.buckets.find(bucket => bucket.localIdentifier === COLUMNS);

    const measures: IPivotTableBucketProps["measures"] = (measureBucket && measureBucket.items) || [];
    const rows: IPivotTableBucketProps["rows"] =
        (rowBucket && (rowBucket.items as VisualizationObject.IVisualizationAttribute[])) || [];
    const columns: IPivotTableBucketProps["columns"] =
        (columnBucket && (columnBucket.items as VisualizationObject.IVisualizationAttribute[])) || [];
    const sortBy: IPivotTableBucketProps["sortBy"] =
        (mdObject &&
            mdObject.content &&
            mdObject.content.properties &&
            JSON.parse(mdObject.content.properties).sortItems) ||
        [];
    const totals: IPivotTableBucketProps["totals"] = (rowBucket && rowBucket.totals) || [];

    const afmWithoutMergedFilters = DataLayer.toAfmResultSpec(mdObject.content).afm;
    afmWithoutMergedFilters.filters = afmWithoutMergedFilters.filters || [];

    const afm = mergeFiltersToAfm(afmWithoutMergedFilters, filtersFromProps);

    // Filter out expression filters which are not supported in bucket interface
    const filters: VisualizationInput.IFilter[] = (afm.filters || []).filter(
        afmFilter => !AFM.isExpressionFilter(afmFilter),
    ) as VisualizationObject.VisualizationObjectExtendedFilter[];

    return {
        measures,
        rows,
        columns,
        filters,
        sortBy,
        totals,
    };
};

export function getMeasuresFromMdObject(
    mdObject: VisualizationObject.IVisualizationObjectContent,
): VisualizationObject.BucketItem[] {
    return get(mdObject, "buckets").reduce((acc, bucket) => {
        const measureItems: VisualizationObject.BucketItem[] = get(bucket, "items", []).filter(
            VisualizationObject.isMeasure,
        );
        return acc.concat(measureItems);
    }, []);
}

export function areAllMeasuresOnSingleAxis(
    mdObject: VisualizationObject.IVisualizationObjectContent,
    secondaryYAxis: IAxisConfig,
): boolean {
    const measureCount = getMeasuresFromMdObject(mdObject).length;
    const numberOfMeasureOnSecondaryAxis = get(secondaryYAxis, "measures.length", 0);
    return numberOfMeasureOnSecondaryAxis === 0 || measureCount === numberOfMeasureOnSecondaryAxis;
}

export default {
    getTotals,
    getVisualizationClassUri,
    buildMeasureTitleProps,
    buildArithmeticMeasureTitleProps,
    mdObjectToGeoPushpinBucketProps,
    mdObjectToPivotBucketProps,
};
