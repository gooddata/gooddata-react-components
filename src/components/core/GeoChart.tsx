// (C) 2019-2020 GoodData Corporation
import { geoValidatorHOC } from "./base/GeoValidatorHOC";
import { visualizationLoadingHOC } from "./base/VisualizationLoadingHOC";
import { GeoChartOptionsWrapper } from "./geoChart/GeoChartOptionsWrapper";

export const GeoChart = geoValidatorHOC(visualizationLoadingHOC(GeoChartOptionsWrapper, true));
