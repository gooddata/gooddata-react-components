// (C) 2020 GoodData Corporation
import { IColorItem, TypeGuards } from "@gooddata/gooddata-js";
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";

import { IColorPalette } from "../../../..";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { findMeasureGroupInDimensions } from "../../../../helpers/executionResultHelper";
import {
    DEFAULT_BULLET_GRAY_COLOR,
    getColorByGuid,
    getColorFromMapping,
    getLighterColorFromRGB,
    getRgbStringFromRGB,
} from "../../utils/color";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import { isValidMappedColor } from "./utils";
import ColorStrategy from "../colorStrategy";
import { isComparativeSeries, isPrimarySeries, isTargetSeries } from "../chartOptions/bulletChartOptions";

class BulletChartColorStrategy extends ColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
        occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
    ): ICreateColorAssignmentReturnValue {
        const measureGroup = findMeasureGroupInDimensions(executionResponse.dimensions);

        const defaultColorsAssignment = this.getDefaultColorAssignment(
            colorPalette,
            measureGroup,
            occupiedMeasureBucketsLocalIdentifiers,
        );

        const colorAssignment = measureGroup.items.map(headerItem => {
            const color: IColorItem = this.mapMeasureColor(
                headerItem,
                colorPalette,
                colorMapping,
                executionResponse,
                afm,
                defaultColorsAssignment,
            );

            return {
                headerItem,
                color,
            };
        });

        return {
            fullColorAssignment: colorAssignment,
        };
    }

    protected createPalette(colorPalette: IColorPalette, colorAssignments: IColorAssignment[]): string[] {
        return colorAssignments
            .map((colorAssignment, index) => {
                if (TypeGuards.isRgbColorItem(colorAssignment.color)) {
                    return colorAssignment.color.value;
                } else if (TypeGuards.isGuidColorItem(colorAssignment.color)) {
                    return getColorByGuid(colorPalette, colorAssignment.color.value as string, index);
                }
            })
            .filter(color => typeof color !== "undefined")
            .map(color => getRgbStringFromRGB(color));
    }

    protected mapMeasureColor(
        headerItem: Execution.IMeasureHeaderItem,
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
        defaultColorsAssignment: IColorAssignment[],
    ): IColorItem {
        const mappedColor = getColorFromMapping(headerItem, colorMapping, executionResponse, afm);
        if (isValidMappedColor(mappedColor, colorPalette)) {
            return mappedColor;
        }

        const defaultColorAssignment = defaultColorsAssignment.find(
            (colorAssignment: IColorAssignment) =>
                (colorAssignment.headerItem as Execution.IMeasureHeaderItem).measureHeaderItem
                    .localIdentifier === headerItem.measureHeaderItem.localIdentifier,
        );

        return defaultColorAssignment.color;
    }

    private getDefaultColorAssignment(
        colorPalette: IColorPalette,
        measureGroup: Execution.IMeasureGroupHeader["measureGroupHeader"],
        occupiedMeasureBucketsLocalIdentifiers: VisualizationObject.Identifier[],
    ): IColorAssignment[] {
        return measureGroup.items.map(
            (headerItem: Execution.IMeasureHeaderItem, index: number): IColorAssignment => {
                const color: IColorItem =
                    (isPrimarySeries(index, occupiedMeasureBucketsLocalIdentifiers) && {
                        type: "guid",
                        value: colorPalette[0].guid,
                    }) ||
                    (isTargetSeries(index, occupiedMeasureBucketsLocalIdentifiers) && {
                        type: "rgb",
                        value: getLighterColorFromRGB(colorPalette[0].fill, -0.3),
                    }) ||
                    (isComparativeSeries(index, occupiedMeasureBucketsLocalIdentifiers) && {
                        type: "rgb",
                        value: DEFAULT_BULLET_GRAY_COLOR,
                    });

                return {
                    headerItem,
                    color,
                };
            },
        );
    }
}

export default BulletChartColorStrategy;
