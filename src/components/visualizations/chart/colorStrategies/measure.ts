// (C) 2020 GoodData Corporation
import { IColorItem, IGuidColorItem, RGBType, TypeGuards, IColorPalette } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import ColorStrategy from "../colorStrategy";
import { IColorAssignment, IColorMapping } from "../../../../interfaces/Config";
import { getColorByGuid, getColorFromMapping, getLighterColorFromRGB } from "../../utils/color";
import { findMeasureGroupInDimensions } from "../../../../helpers/executionResultHelper";
import { findParentMeasureIndex, isDerivedMeasure } from "../chartOptionsBuilder";
import { ICreateColorAssignmentReturnValue } from "../colorFactory";
import { isValidMappedColor } from "./utils";

const emptyColorPaletteItem: IGuidColorItem = { type: "guid", value: "none" };

class MeasureColorStrategy extends ColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        _viewByAttribute: any,
        _stackByAttribute: any,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        const { allMeasuresAssignment, nonDerivedMeasuresAssignment } = this.mapColorsFromMeasures(
            executionResponse,
            afm,
            colorMapping,
            colorPalette,
        );

        return {
            fullColorAssignment: this.mapColorsFromDerivedMeasure(
                executionResponse,
                afm,
                allMeasuresAssignment,
                colorPalette,
            ),
            outputColorAssignment: nonDerivedMeasuresAssignment,
        };
    }

    protected mapMeasureColor(
        headerItem: Execution.IMeasureHeaderItem,
        currentColorPaletteIndex: number,
        colorPalette: IColorPalette,
        colorAssignment: IColorMapping[],
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): IColorItem {
        const mappedColor = getColorFromMapping(headerItem, colorAssignment, executionResponse, afm);

        return isValidMappedColor(mappedColor, colorPalette)
            ? mappedColor
            : {
                  type: "guid",
                  value: colorPalette[currentColorPaletteIndex % colorPalette.length].guid,
              };
    }

    private mapColorsFromMeasures(
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
        colorMapping: IColorMapping[],
        colorPalette: IColorPalette,
    ): { allMeasuresAssignment: IColorAssignment[]; nonDerivedMeasuresAssignment: IColorAssignment[] } {
        let currentColorPaletteIndex = 0;

        const nonDerivedMeasuresAssignment: IColorAssignment[] = [];
        const measureGroup = findMeasureGroupInDimensions(executionResponse.dimensions);
        const allMeasuresAssignment = measureGroup.items.map((headerItem, index) => {
            if (isDerivedMeasure(measureGroup.items[index], afm)) {
                return {
                    headerItem,
                    color: emptyColorPaletteItem,
                };
            }

            const color: IColorItem = this.mapMeasureColor(
                headerItem,
                currentColorPaletteIndex,
                colorPalette,
                colorMapping,
                executionResponse,
                afm,
            );
            const mappedMeasure: IColorAssignment = {
                headerItem,
                color,
            };

            currentColorPaletteIndex++;
            nonDerivedMeasuresAssignment.push(mappedMeasure);

            return mappedMeasure;
        });

        return {
            allMeasuresAssignment,
            nonDerivedMeasuresAssignment,
        };
    }

    private mapColorsFromDerivedMeasure(
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
        measuresColorAssignment: IColorAssignment[],
        colorPalette: IColorPalette,
    ): IColorAssignment[] {
        return measuresColorAssignment.map((mapItem, measureItemIndex) => {
            const measureGroup = findMeasureGroupInDimensions(executionResponse.dimensions);
            if (!isDerivedMeasure(measureGroup.items[measureItemIndex], afm)) {
                return mapItem;
            }
            const parentMeasureIndex = findParentMeasureIndex(afm, measureItemIndex);
            if (parentMeasureIndex > -1) {
                const sourceMeasureColor = measuresColorAssignment[parentMeasureIndex].color;
                return this.getDerivedMeasureColorAssignment(
                    sourceMeasureColor,
                    colorPalette,
                    measureItemIndex,
                    mapItem,
                );
            }
            return mapItem;
        });
    }

    private getDerivedMeasureColorAssignment(
        sourceMeasureColor: IColorItem,
        colorPalette: IColorPalette,
        measureItemIndex: number,
        mapItem: IColorAssignment,
    ) {
        const rgbColor = TypeGuards.isGuidColorItem(sourceMeasureColor)
            ? getColorByGuid(colorPalette, sourceMeasureColor.value, measureItemIndex)
            : sourceMeasureColor.value;
        return {
            ...mapItem,
            color: {
                type: "rgb" as RGBType,
                value: getLighterColorFromRGB(rgbColor, 0.6),
            },
        };
    }
}

export default MeasureColorStrategy;
