// (C) 2020 GoodData Corporation
import omit = require("lodash/omit");
import { Execution, AFM } from "@gooddata/typings";
import { IColorPalette } from "@gooddata/gooddata-js";

import { IColorMapping } from "../../interfaces/Config";
import { IGeoData } from "../../interfaces/GeoChart";
import { findGeoAttributesInDimension, IGeoAttributesInDimension } from "../geoChart/executionResultHelper";
import { IColorStrategy } from "../../components/visualizations/chart/colorFactory";
import GeoChartColorStrategy from "../../components/visualizations/chart/colorStrategies/geoChart";

export function getColorStrategy(
    colorPalette: IColorPalette,
    colorMapping: IColorMapping[],
    geoData: IGeoData,
    execution: Execution.IExecutionResponses,
    afm: AFM.IAfm,
): IColorStrategy {
    const { executionResponse } = execution;
    const { locationAttribute, segmentByAttribute }: IGeoAttributesInDimension = findGeoAttributesInDimension(
        execution,
        geoData,
    );
    const locationAttributeHeader: Execution.IAttributeHeader = {
        attributeHeader: omit(locationAttribute, "items"),
    };

    return new GeoChartColorStrategy(
        colorPalette,
        colorMapping,
        locationAttributeHeader,
        segmentByAttribute,
        executionResponse,
        afm,
    );
}
