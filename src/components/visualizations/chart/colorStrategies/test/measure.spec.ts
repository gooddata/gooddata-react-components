// (C) 2020 GoodData Corporation
import { Execution } from "@gooddata/typings";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { ColorFactory } from "../../colorFactory";
import { IColorMapping, IColorPalette } from "../../../../../interfaces/Config";
import { getColorsFromStrategy } from "./helpers";
import MeasureColorStrategy from "../measure";

const customPalette = [
    {
        guid: "01",
        fill: {
            r: 50,
            g: 50,
            b: 50,
        },
    },
    {
        guid: "02",
        fill: {
            r: 100,
            g: 100,
            b: 100,
        },
    },
    {
        guid: "03",
        fill: {
            r: 150,
            g: 150,
            b: 150,
        },
    },
    {
        guid: "04",
        fill: {
            r: 200,
            g: 200,
            b: 200,
        },
    },
];

describe("MeasureColorStrategy", () => {
    it("should return a palette with a lighter color for each pop measure based on it`s source measure", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.barChartWithPopMeasureAndViewByAttribute,
        );
        const { executionResponse } = fixtures.barChartWithPopMeasureAndViewByAttribute;
        const { afm } = fixtures.barChartWithPopMeasureAndViewByAttribute.executionRequest;
        const type = "column";

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);
        expect(colorStrategy).toBeInstanceOf(MeasureColorStrategy);
        expect(updatedPalette).toEqual(["rgb(173,173,173)", "rgb(50,50,50)"]);
    });

    it("should return a palette with a lighter color for each previous period based on it`s source measure", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.barChartWithPreviousPeriodMeasure);
        const { executionResponse } = fixtures.barChartWithPreviousPeriodMeasure;
        const { afm } = fixtures.barChartWithPreviousPeriodMeasure.executionRequest;
        const type = "column";

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);
        expect(colorStrategy).toBeInstanceOf(MeasureColorStrategy);
        expect(updatedPalette).toEqual(["rgb(173,173,173)", "rgb(50,50,50)"]);
    });

    it("should rotate colors from original palette and generate lighter PoP colors", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.barChartWith6PopMeasuresAndViewByAttribute,
        );
        const { executionResponse } = fixtures.barChartWith6PopMeasuresAndViewByAttribute;
        const { afm } = fixtures.barChartWith6PopMeasuresAndViewByAttribute.executionRequest;
        const type = "column";

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(MeasureColorStrategy);
        expect(updatedPalette).toEqual([
            "rgb(173,173,173)",
            "rgb(50,50,50)",
            "rgb(193,193,193)",
            "rgb(100,100,100)",
            "rgb(213,213,213)",
            "rgb(150,150,150)",
            "rgb(233,233,233)",
            "rgb(200,200,200)",
            "rgb(173,173,173)",
            "rgb(50,50,50)",
            "rgb(193,193,193)",
            "rgb(100,100,100)",
        ]);
    });

    it("should rotate colors from original palette and generate lighter previous period measures", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.barChartWith6PreviousPeriodMeasures);
        const { executionResponse } = fixtures.barChartWith6PreviousPeriodMeasures;
        const { afm } = fixtures.barChartWith6PreviousPeriodMeasures.executionRequest;
        const type = "column";

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(MeasureColorStrategy);

        expect(updatedPalette).toEqual([
            "rgb(173,173,173)",
            "rgb(50,50,50)",
            "rgb(193,193,193)",
            "rgb(100,100,100)",
            "rgb(213,213,213)",
            "rgb(150,150,150)",
            "rgb(233,233,233)",
            "rgb(200,200,200)",
            "rgb(173,173,173)",
            "rgb(50,50,50)",
            "rgb(193,193,193)",
            "rgb(100,100,100)",
        ]);
    });

    it("should just return the original palette if there are no pop measures shorten to cover all legend items", () => {
        const { measureGroup, viewByAttribute, stackByAttribute } = getMVS(
            fixtures.barChartWithoutAttributes,
        );
        const { executionResponse } = fixtures.barChartWithoutAttributes;
        const { afm } = fixtures.barChartWithoutAttributes.executionRequest;
        const type = "column";
        const colorPalette: IColorPalette = undefined;

        const colorStrategy = ColorFactory.getColorStrategy(
            colorPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const itemsCount = measureGroup.items.length;
        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(itemsCount).toEqual(updatedPalette.length);
    });

    it("should return MeasureColorStrategy with properly applied mapping", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.barChartWith6PopMeasuresAndViewByAttribute,
        );
        const { executionResponse } = fixtures.barChartWith6PopMeasuresAndViewByAttribute;
        const { afm } = fixtures.barChartWith6PopMeasuresAndViewByAttribute.executionRequest;
        const type = "column";
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "amountMeasure_0",
                color: {
                    type: "guid",
                    value: "02",
                },
            },
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "amountPopMeasure_0",
                color: {
                    type: "guid",
                    value: "03",
                },
            },
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "amountMeasure_1",
                color: {
                    type: "guid",
                    value: "03",
                },
            },
        ];

        const colorStrategy = ColorFactory.getColorStrategy(
            customPalette,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        const updatedPalette = getColorsFromStrategy(colorStrategy);

        expect(colorStrategy).toBeInstanceOf(MeasureColorStrategy);
        expect(updatedPalette).toEqual([
            "rgb(193,193,193)",
            "rgb(100,100,100)",
            "rgb(213,213,213)",
            "rgb(150,150,150)",
            "rgb(213,213,213)",
            "rgb(150,150,150)",
            "rgb(233,233,233)",
            "rgb(200,200,200)",
            "rgb(173,173,173)",
            "rgb(50,50,50)",
            "rgb(193,193,193)",
            "rgb(100,100,100)",
        ]);
    });

    it("should return only non-derived measures in getColorAssignment", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(
            fixtures.barChartWith6PopMeasuresAndViewByAttribute,
        );
        const { executionResponse } = fixtures.barChartWith6PopMeasuresAndViewByAttribute;
        const { afm } = fixtures.barChartWith6PopMeasuresAndViewByAttribute.executionRequest;
        const type = "column";

        const colorStrategy = ColorFactory.getColorStrategy(
            fixtures.customPalette,
            undefined,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        expect(colorStrategy.getColorAssignment().length).toEqual(6);
    });
});
