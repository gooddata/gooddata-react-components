// (C) 2020 GoodData Corporation
import isEqual = require("lodash/isEqual");
import range = require("lodash/range");
import { IColor, TypeGuards, IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import ColorStrategy from "../colorStrategy";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { findMeasureGroupInDimensions } from "../../../../helpers/executionResultHelper";
import {
    DEFAULT_HEATMAP_BLUE_COLOR,
    getColorByGuid,
    getColorFromMapping,
    getRgbStringFromRGB,
    HEATMAP_BLUE_COLOR_PALETTE,
    isCustomPalette,
} from "../../utils/color";
import { IMappingHeader } from "../../../../interfaces/MappingHeader";
import { HighChartColorPalette, ICreateColorAssignmentReturnValue } from "../colorFactory";

class HeatmapColorStrategy extends ColorStrategy {
    public getColorByIndex(index: number): string {
        return this.palette[index % this.palette.length];
    }

    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        let mappedColor;
        let colorAssignment: IColorAssignment[];
        const measureGroup = findMeasureGroupInDimensions(executionResponse.dimensions);
        const headerItem = measureGroup && measureGroup.items[0];
        if (colorMapping) {
            mappedColor = getColorFromMapping(headerItem, colorMapping, executionResponse, afm);
            if (mappedColor) {
                colorAssignment = [
                    {
                        headerItem,
                        color: mappedColor,
                    },
                ];
            }
        }

        colorAssignment = colorAssignment || this.getDefaultColorAssignment(colorPalette, headerItem);

        return {
            fullColorAssignment: colorAssignment,
            outputColorAssignment: colorAssignment,
        };
    }

    protected createPalette(colorPalette: IColorPalette, colorAssignment: IColorAssignment[]): string[] {
        if (TypeGuards.isRgbColorItem(colorAssignment[0].color)) {
            if (isEqual(colorAssignment[0].color.value, DEFAULT_HEATMAP_BLUE_COLOR)) {
                return HEATMAP_BLUE_COLOR_PALETTE;
            }
        }

        if (TypeGuards.isGuidColorItem(colorAssignment[0].color)) {
            return this.getCustomHeatmapColorPalette(
                getColorByGuid(colorPalette, colorAssignment[0].color.value as string, 0),
            );
        }

        return this.getCustomHeatmapColorPalette(colorAssignment[0].color.value as IColor);
    }

    private getCustomHeatmapColorPalette(baseColor: IColor): HighChartColorPalette {
        const { r, g, b } = baseColor;
        const colorItemsCount = 6;
        const channels = [r, g, b];
        const steps = channels.map(channel => (255 - channel) / colorItemsCount);
        const generatedColors = this.getCalculatedColors(colorItemsCount, channels, steps);
        return ["rgb(255,255,255)", ...generatedColors.reverse(), getRgbStringFromRGB(baseColor)];
    }

    private getCalculatedColors(count: number, channels: number[], steps: number[]): HighChartColorPalette {
        return range(1, count).map(
            (index: number) =>
                `rgb(${this.getCalculatedChannel(channels[0], index, steps[0])},` +
                `${this.getCalculatedChannel(channels[1], index, steps[1])},` +
                `${this.getCalculatedChannel(channels[2], index, steps[2])})`,
        );
    }

    private getCalculatedChannel(channel: number, index: number, step: number): number {
        return Math.trunc(channel + index * step);
    }

    private getDefaultColorAssignment(
        colorPalette: IColorPalette,
        headerItem: IMappingHeader,
    ): IColorAssignment[] {
        const hasCustomPaletteWithColors = colorPalette && isCustomPalette(colorPalette) && colorPalette[0];
        if (hasCustomPaletteWithColors) {
            return [
                {
                    headerItem,
                    color: {
                        type: "guid",
                        value: colorPalette[0].guid,
                    },
                },
            ];
        }

        return [
            {
                headerItem,
                color: {
                    type: "rgb",
                    value: DEFAULT_HEATMAP_BLUE_COLOR,
                },
            },
        ];
    }
}

export default HeatmapColorStrategy;
