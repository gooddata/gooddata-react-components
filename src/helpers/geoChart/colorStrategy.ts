// (C) 2020 GoodData Corporation

import { Execution, AFM } from "@gooddata/typings";
import { IColorPalette } from "@gooddata/gooddata-js";
import { IColorMapping } from "../../interfaces/Config";
import { IGeoData } from "../../interfaces/GeoChart";
import { findAttributeInDimension } from "../executionResultHelper";
import { IColorStrategy } from "../../components/visualizations/chart/colorFactory";
import GeoChartColorStrategy from "../../components/visualizations/chart/colorStrategies/geoChart";
import { IUnwrappedAttributeHeaderWithItems } from "../../components/visualizations/typings/chart";

export function getColorStrategy(
    colorPalette: IColorPalette,
    colorMapping: IColorMapping[],
    geoData: IGeoData,
    execution: Execution.IExecutionResponses,
    afm: AFM.IAfm,
): IColorStrategy {
    const {
        executionResponse,
        executionResult: { headerItems },
    } = execution;
    const { dimensions } = executionResponse;
    const { location, size, color, segment } = geoData;
    const hasMeasure = size || color;
    const attrDimensionIndex = hasMeasure ? 1 : 0;
    const attributeDimension: Execution.IResultDimension = dimensions[attrDimensionIndex];
    const attributeResultHeaderItems: Execution.IResultHeaderItem[][] = headerItems[attrDimensionIndex];

    const locationAttribute: Execution.IHeader = attributeDimension.headers[location.index];
    const segmentByAttribute: IUnwrappedAttributeHeaderWithItems =
        segment && segment.data.length
            ? findAttributeInDimension(attributeDimension, attributeResultHeaderItems, segment.index)
            : undefined;

    return new GeoChartColorStrategy(
        colorPalette,
        colorMapping,
        locationAttribute,
        segmentByAttribute,
        executionResponse,
        afm,
    );
}
