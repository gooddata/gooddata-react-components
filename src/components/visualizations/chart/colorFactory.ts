// (C) 2007-2020 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";

import { DEFAULT_COLOR_PALETTE } from "../utils/color";
import {
    isHeatmap,
    isOneOfTypes,
    isTreemap,
    isScatterPlot,
    isBubbleChart,
    isBulletChart,
} from "../utils/common";
import { VisualizationTypes } from "../../../constants/visualizationTypes";
import { IColorPalette, IColorMapping, IColorAssignment } from "../../../interfaces/Config";
import MeasureColorStrategy from "./colorStrategies/measure";
import AttributeColorStrategy from "./colorStrategies/attribute";
import HeatmapColorStrategy from "./colorStrategies/heatmap";
import TreemapColorStrategy from "./colorStrategies/treemap";
import ScatterPlotColorStrategy from "./colorStrategies/scatterPlot";
import BubbleChartColorStrategy from "./colorStrategies/bubbleChart";
import BulletChartColorStrategy from "./colorStrategies/bulletChart";

export interface IColorStrategy {
    getColorByIndex(index: number): string;
    getColorAssignment(): IColorAssignment[];
    getFullColorAssignment(): IColorAssignment[];
}

export interface ICreateColorAssignmentReturnValue {
    fullColorAssignment: IColorAssignment[];
    outputColorAssignment?: IColorAssignment[];
}

export type HighChartColorPalette = string[];
export const attributeChartSupportedTypes = [
    VisualizationTypes.PIE,
    VisualizationTypes.DONUT,
    VisualizationTypes.FUNNEL,
    VisualizationTypes.SCATTER,
    VisualizationTypes.BUBBLE,
];

export function isAttributeColorPalette(type: string, afm: AFM.IAfm, stackByAttribute: any) {
    const attributeChartSupported = isOneOfTypes(type, attributeChartSupportedTypes);
    return stackByAttribute || (attributeChartSupported && afm.attributes && afm.attributes.length > 0);
}

export class ColorFactory {
    public static getColorStrategy(
        colorPalette: IColorPalette = DEFAULT_COLOR_PALETTE,
        colorMapping: IColorMapping[],
        viewByAttribute: any,
        stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
        type: string,
        occupiedMeasureBucketsLocalIdentifiers?: VisualizationObject.Identifier[],
    ): IColorStrategy {
        if (isHeatmap(type)) {
            return new HeatmapColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
        }

        if (isTreemap(type)) {
            return new TreemapColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
        }

        if (isScatterPlot(type)) {
            return new ScatterPlotColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
        }

        if (isBubbleChart(type)) {
            return new BubbleChartColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
        }

        if (isBulletChart(type)) {
            return new BulletChartColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
                occupiedMeasureBucketsLocalIdentifiers,
            );
        }

        if (isAttributeColorPalette(type, afm, stackByAttribute)) {
            return new AttributeColorStrategy(
                colorPalette,
                colorMapping,
                viewByAttribute,
                stackByAttribute,
                executionResponse,
                afm,
            );
        }

        return new MeasureColorStrategy(
            colorPalette,
            colorMapping,
            viewByAttribute,
            stackByAttribute,
            executionResponse,
            afm,
        );
    }
}
