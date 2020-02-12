// (C) 2020 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import { IColor, IColorItem, IColorPalette, TypeGuards } from "@gooddata/gooddata-js";

import AttributeColorStrategy from "./attribute";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { findMeasureGroupInDimensions } from "../../../../helpers/executionResultHelper";
import { getColorByGuid, getColorFromMapping, getRgbStringFromRGB } from "../../utils/color";
import { isValidMappedColor } from "./utils";

class PointsChartColorStrategy extends AttributeColorStrategy {
    protected singleMeasureColorMapping(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): IColorAssignment[] {
        const measureGroup = findMeasureGroupInDimensions(executionResponse.dimensions);
        const measureHeaderItem = measureGroup.items[0];
        const measureColorMapping = getColorFromMapping(
            measureHeaderItem,
            colorMapping,
            executionResponse,
            afm,
        );
        const color: IColorItem = isValidMappedColor(measureColorMapping, colorPalette)
            ? measureColorMapping
            : { type: "guid", value: colorPalette[0].guid };
        return [
            {
                headerItem: measureHeaderItem,
                color,
            },
        ];
    }

    protected createSingleColorPalette(
        colorPalette: IColorPalette,
        colorAssignment: IColorAssignment[],
        viewByAttribute: any,
    ): string[] {
        const length = viewByAttribute ? viewByAttribute.items.length : 1;
        const color = TypeGuards.isGuidColorItem(colorAssignment[0].color)
            ? getColorByGuid(colorPalette, colorAssignment[0].color.value as string, 0)
            : (colorAssignment[0].color.value as IColor);
        const colorString = getRgbStringFromRGB(color);
        return Array(length).fill(colorString);
    }
}

export default PointsChartColorStrategy;
