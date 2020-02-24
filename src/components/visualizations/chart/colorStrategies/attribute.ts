// (C) 2020 GoodData Corporation
import { IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import ColorStrategy from "../colorStrategy";
import { IColorMapping } from "../../../../interfaces/Config";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import { getAtributeColorAssignment } from "./utils";

class AttributeColorStrategy extends ColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        viewByAttribute: any,
        stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        const attribute = stackByAttribute ? stackByAttribute : viewByAttribute;
        const colorAssignment = getAtributeColorAssignment(
            attribute,
            colorPalette,
            colorMapping,
            executionResponse,
            afm,
        );
        return {
            fullColorAssignment: colorAssignment,
        };
    }
}

export default AttributeColorStrategy;
