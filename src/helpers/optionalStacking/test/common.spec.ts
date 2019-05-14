// (C) 2007-2019 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import {
    getComputeRatio,
    getSanitizedStackingConfigFromAfm,
    sanitizeConfig,
    sanitizeMeasures,
    getViewByTwoAttributes,
} from "../common";
import { IColumnChartBucketProps } from "../../../components/ColumnChart";
import { MEASURES, ATTRIBUTE, STACK } from "../../../constants/bucketNames";
import { measure, attribute } from "../../../helpers/model";
import { IChartConfig } from "../../../interfaces/Config";
import * as fixtures from "../../../../stories/test_data/fixtures";

const A1: VisualizationObject.IVisualizationAttribute = attribute("a1").localIdentifier("a1");
const A2: VisualizationObject.IVisualizationAttribute = attribute("a2").localIdentifier("a2");
const M1: VisualizationObject.IMeasure = measure("m1").localIdentifier("m1");
const M2: VisualizationObject.IMeasure = measure("m2").localIdentifier("m2");

function createMeasureWithRatio(name: string): VisualizationObject.IMeasure {
    return measure(name)
        .localIdentifier(name)
        .ratio();
}

function getBuckets(props: IColumnChartBucketProps): VisualizationObject.IBucket[] {
    return [
        {
            localIdentifier: MEASURES,
            items: props.measures || [],
        },
        {
            localIdentifier: ATTRIBUTE,
            items: getViewByTwoAttributes(props.viewBy),
        },
        {
            localIdentifier: STACK,
            items: props.stackBy ? [props.stackBy] : [],
        },
    ];
}

describe("sanitizeMeasures", () => {
    it("should keep measures as is if there is only one measure", () => {
        expect(sanitizeMeasures([M1])).toEqual([M1]);
    });

    it("should sanitized computeRatio if there are multiple measures", () => {
        const M2WithRatio = createMeasureWithRatio("m2");
        const sanitizedMeasures = sanitizeMeasures([M1, M2WithRatio]);
        const measuresWithComputeRatio = sanitizedMeasures.filter(
            (bucketItem: VisualizationObject.BucketItem) => getComputeRatio(bucketItem),
        );

        expect(measuresWithComputeRatio.length).toEqual(0);
    });
});

describe("sanitizeConfig", () => {
    it("should keep config as is if buckets have more than 1 measure", () => {
        const buckets = getBuckets({
            measures: [M1, M2],
            viewBy: [A1],
        });
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        expect(sanitizeConfig(buckets, config)).toEqual(config);
    });

    it("should sanitized stacking config if buckets have one measure and no stackBy", () => {
        const buckets: VisualizationObject.IBucket[] = getBuckets({
            measures: [M1],
            viewBy: [A1],
        });
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        expect(sanitizeConfig(buckets, config)).toEqual({
            stackMeasures: true,
            stackMeasuresToPercent: false,
        });
    });

    it("should sanitized stacking config if buckets have one measure and one stackBy", () => {
        const buckets: VisualizationObject.IBucket[] = getBuckets({
            measures: [M1],
            viewBy: [A1],
            stackBy: A2,
        });
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        expect(sanitizeConfig(buckets, config)).toEqual(config);
    });

    it("should sanitized stacking config if buckets have 1 measure and isComputeRatio", () => {
        const M1WithRatio = createMeasureWithRatio("m1");
        const buckets: VisualizationObject.IBucket[] = getBuckets({
            measures: [M1WithRatio],
            viewBy: [A1],
        });
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        expect(sanitizeConfig(buckets, config)).toEqual({
            stackMeasures: false,
            stackMeasuresToPercent: false,
        });
    });
});

describe("getSanitizedStackingConfigFromAfm", () => {
    it("should keep config as is if afm has more than 1 measure", () => {
        const { afm } = fixtures.barChartWith3MetricsAndViewByAttribute.executionRequest;
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        const hasStackByAttribute = false;
        const newConfig: IChartConfig = getSanitizedStackingConfigFromAfm(afm, config, hasStackByAttribute);
        expect(newConfig).toEqual(config);
    });

    it("should sanitized stacking config if afm has one measure and no stackBy", () => {
        const { afm } = fixtures.barChartWithViewByAttribute.executionRequest;
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        const newConfig: IChartConfig = getSanitizedStackingConfigFromAfm(afm, config, false);
        expect(newConfig).toEqual({
            stackMeasures: true,
            stackMeasuresToPercent: false,
        });
    });

    it("should sanitized stacking config if afm has one measure and one stackBy", () => {
        const { afm } = fixtures.barChartWithStackByAndViewByAttributes.executionRequest;
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        const newConfig: IChartConfig = getSanitizedStackingConfigFromAfm(afm, config, true);
        expect(newConfig).toEqual(config);
    });

    it("should sanitized stacking config if afm has 1 measure and isComputeRatio", () => {
        const { afm } = fixtures.columnChartWithMeasureViewByAndComputeRatio.executionRequest;
        const config: IChartConfig = {
            stackMeasures: true,
            stackMeasuresToPercent: true,
        };
        const hasStackByAttribute = false;
        const newConfig: IChartConfig = getSanitizedStackingConfigFromAfm(afm, config, hasStackByAttribute);
        expect(newConfig).toEqual({
            stackMeasures: false,
            stackMeasuresToPercent: false,
        });
    });
});
