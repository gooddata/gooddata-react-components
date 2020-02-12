// (C) 2020 GoodData Corporation
import range = require("lodash/range");
import { Execution } from "@gooddata/typings";

import { getMVS } from "../../test/helper";
import * as fixtures from "../../../../../../stories/test_data/fixtures";
import { IColorMapping } from "../../../../../interfaces/Config";
import { ColorFactory, IColorStrategy } from "../../colorFactory";
import { CUSTOM_COLOR_PALETTE } from "../../../../../../stories/data/colors";
import ScatterPlotColorStrategy from "../scatterPlot";

describe("ScatterPlotColorStrategy", () => {
    it("should create palette with same color from first measure for all attribute elements", () => {
        const { viewByAttribute, stackByAttribute } = getMVS(fixtures.scatterPlotWith2MetricsAndAttribute);
        const { executionResponse } = fixtures.scatterPlotWith2MetricsAndAttribute;
        const { afm } = fixtures.scatterPlotWith2MetricsAndAttribute.executionRequest;
        const type = "scatter";

        const expectedColor = "rgb(0,0,0)";
        const colorMapping: IColorMapping[] = [
            {
                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                    headerItem.measureHeaderItem.localIdentifier === "33bd337ed5534fd383861f11ff657b23",
                color: {
                    type: "rgb",
                    value: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
                },
            },
        ];

        const colorStrategy: IColorStrategy = ColorFactory.getColorStrategy(
            CUSTOM_COLOR_PALETTE,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
            type,
        );

        expect(colorStrategy).toBeInstanceOf(ScatterPlotColorStrategy);
        expect(colorStrategy.getColorAssignment().length).toEqual(1);
        range(6).map(itemIndex => {
            expect(colorStrategy.getColorByIndex(itemIndex)).toEqual(expectedColor);
        });
    });
});
