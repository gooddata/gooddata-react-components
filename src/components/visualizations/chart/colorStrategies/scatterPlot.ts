// (C) 2020 GoodData Corporation
import { IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import PointsChartColorStrategy from "./pointsChart";

class ScatterPlotColorStrategy extends PointsChartColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        const colorAssignment = this.singleMeasureColorMapping(
            colorPalette,
            colorMapping,
            executionResponse,
            afm,
        );
        return {
            fullColorAssignment: colorAssignment,
        };
    }

    protected createPalette(
        colorPalette: IColorPalette,
        colorAssignment: IColorAssignment[],
        _viewByAttribute: any,
        stackByAttribute: any,
    ): string[] {
        return super.createSingleColorPalette(colorPalette, colorAssignment, stackByAttribute);
    }
}

export default ScatterPlotColorStrategy;
