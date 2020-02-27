// (C) 2019-2020 GoodData Corporation
import { VisualizationObject } from "@gooddata/typings";
import { measure, attribute } from "../../src/helpers/model";

export const ATTRIBUTE_LOCATION_GEOCHART: VisualizationObject.IVisualizationAttribute = attribute(
    "/gdc/md/storybook/obj/30.df",
).localIdentifier("location");
export const MEASURE_SIZE_GEOCHART: VisualizationObject.IMeasure = measure(
    "/gdc/md/storybook/obj/20",
).localIdentifier("size");
export const MEASURE_COLOR_GEOCHART: VisualizationObject.IMeasure = measure(
    "/gdc/md/storybook/obj/21",
).localIdentifier("color");
export const ATTRIBUTE_SEGMENT_GEOCHART: VisualizationObject.IVisualizationAttribute = attribute(
    "/gdc/md/storybook/obj/23.df",
).localIdentifier("segmentBy");
export const ATTRIBUTE_TOOLTIP_GEOCHART: VisualizationObject.IVisualizationAttribute = attribute(
    "/gdc/md/storybook/obj/24.df",
).localIdentifier("tooltip");
