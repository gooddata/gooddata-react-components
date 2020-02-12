// (C) 2020 GoodData Corporation
import { AFM, Execution } from "@gooddata/typings";
import { IColor, IColorPalette, TypeGuards } from "@gooddata/gooddata-js";

import {
    DEFAULT_BULLET_GRAY_COLOR,
    getColorByGuid,
    getLighterColorFromRGB,
    getRgbStringFromRGB,
} from "../../utils/color";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import PointsChartColorStrategy from "./pointsChart";

class BulletChartColorStrategy extends PointsChartColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        const fullColorAssignment = this.singleMeasureColorMapping(
            colorPalette,
            colorMapping,
            executionResponse,
            afm,
        );

        return {
            fullColorAssignment,
        };
    }

    protected createPalette(colorPalette: IColorPalette, colorAssignment: IColorAssignment[]): string[] {
        const firstPaletteColor = colorAssignment[0].color;
        if (TypeGuards.isGuidColorItem(firstPaletteColor)) {
            return this.getCustomBulletChartColorPalette(
                getColorByGuid(colorPalette, firstPaletteColor.value as string, 0),
            );
        }

        return this.getCustomBulletChartColorPalette(firstPaletteColor.value as IColor);
    }

    private getCustomBulletChartColorPalette(baseColor: IColor) {
        return [
            getRgbStringFromRGB(baseColor),
            getRgbStringFromRGB(getLighterColorFromRGB(baseColor, -0.3)),
            getRgbStringFromRGB(DEFAULT_BULLET_GRAY_COLOR),
        ];
    }
}

export default BulletChartColorStrategy;
