// (C) 2020 GoodData Corporation
import { IColorPalette, IColorItem } from "@gooddata/gooddata-js";
import { AFM, Execution } from "@gooddata/typings";

import ColorStrategy from "../colorStrategy";
import { IColorMapping, IColorAssignment } from "../../../../interfaces/Config";
import AttributeColorStrategy from "./attribute";
import { getColorFromMapping } from "../../utils/color";
import { ICreateColorAssignmentReturnValue, IColorStrategy } from "../colorFactory";
import { isValidMappedColor } from "./utils";
import { IUnwrappedAttributeHeaderWithItems } from "../../typings/chart";

class GeoChartColorStrategy extends ColorStrategy {
    protected createColorAssignment(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        locationAttribute: Execution.IAttributeHeader,
        segmentByAttribute: IUnwrappedAttributeHeaderWithItems,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): ICreateColorAssignmentReturnValue {
        // color follows SegmentBy
        if (segmentByAttribute) {
            return {
                fullColorAssignment: this.getColorStrategyForSegmentBy(
                    colorPalette,
                    colorMapping,
                    segmentByAttribute,
                    executionResponse,
                    afm,
                ),
            };
        }

        // color follows Location
        return {
            fullColorAssignment: [
                this.getColorStrategyForLocation(
                    colorPalette,
                    colorMapping,
                    locationAttribute,
                    executionResponse,
                    afm,
                ),
            ],
        };
    }

    private getColorStrategyForSegmentBy(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        segmentByAttribute: IUnwrappedAttributeHeaderWithItems,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): IColorAssignment[] {
        const colorStrategy: IColorStrategy = new AttributeColorStrategy(
            colorPalette,
            colorMapping,
            null,
            segmentByAttribute,
            executionResponse,
            afm,
        );

        return colorStrategy.getColorAssignment();
    }

    private getColorStrategyForLocation(
        colorPalette: IColorPalette,
        colorMapping: IColorMapping[],
        locationAttribute: Execution.IAttributeHeader,
        executionResponse: Execution.IExecutionResponse,
        afm: AFM.IAfm,
    ): IColorAssignment {
        const mappedColor = getColorFromMapping(locationAttribute, colorMapping, executionResponse, afm);
        const color: IColorItem = isValidMappedColor(mappedColor, colorPalette)
            ? mappedColor
            : {
                  type: "guid",
                  value: colorPalette[0].guid,
              };
        return {
            headerItem: locationAttribute,
            color,
        };
    }
}

export default GeoChartColorStrategy;
