// (C) 2020 GoodData Corporation
import { IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import MeasureColorStrategy from "./measure";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import { getAtributeColorAssignment } from "./utils";

class TreemapColorStrategy extends MeasureColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        viewByAttribute: any,
        stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        let colorAssignment: IColorAssignment[];
        if (viewByAttribute) {
            colorAssignment = getAtributeColorAssignment(
                viewByAttribute,
                colorPalette,
                colorMapping,
                executionResponse,
                afm,
            );
        } else {
            const result = super.createColorAssignment(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
            colorAssignment = result.outputColorAssignment;
        }

        return {
            fullColorAssignment: colorAssignment,
            outputColorAssignment: colorAssignment,
        };
    }
}

export default TreemapColorStrategy;
