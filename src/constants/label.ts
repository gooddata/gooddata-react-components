// (C) 2019 GoodData Corporation
import { VisualizationTypes } from "./visualizationTypes";

export const WHITE_LABEL = {
    color: "#ffffff",
    textShadow: "0 0 1px #000000",
};

export const BLACK_LABEL = {
    color: "#000000",
    textShadow: "none",
};

// types with label inside sections have white labels
export const whiteDataLabelTypes = [
    VisualizationTypes.PIE,
    VisualizationTypes.DONUT,
    VisualizationTypes.TREEMAP,
    VisualizationTypes.BUBBLE,
];
