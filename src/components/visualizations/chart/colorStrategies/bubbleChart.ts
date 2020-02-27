// (C) 2020 GoodData Corporation
import { IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import PointsChartColorStrategy from "./pointsChart";

class BubbleChartColorStrategy extends PointsChartColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        viewByAttribute: any,
        stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        let colorAssignment;
        if (stackByAttribute) {
            colorAssignment = super.createColorAssignment(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            ).fullColorAssignment;
        } else {
            colorAssignment = this.singleMeasureColorMapping(
                colorPalette,
                colorMapping,
                executionResponse,
                afm,
            );
        }

        return {
            fullColorAssignment: colorAssignment,
        };
    }

    protected createPalette(
        colorPalette: IColorPalette,
        colorAssignment: IColorAssignment[],
        viewByAttribute: any,
        stackByAttribute: any,
    ): string[] {
        if (stackByAttribute) {
            return super.createPalette(colorPalette, colorAssignment, viewByAttribute, stackByAttribute);
        }

        return super.createSingleColorPalette(colorPalette, colorAssignment, stackByAttribute);
    }
}

export default BubbleChartColorStrategy;
