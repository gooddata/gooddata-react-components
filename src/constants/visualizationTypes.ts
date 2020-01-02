// (C) 2007-2020 GoodData Corporation
export const VisualizationTypes = {
    BAR: "bar" as "bar",
    COLUMN: "column" as "column",
    LINE: "line" as "line",
    PIE: "pie" as "pie",
    DONUT: "donut" as "donut",
    TABLE: "table" as "table",
    HEADLINE: "headline" as "headline",
    AREA: "area" as "area",
    SCATTER: "scatter" as "scatter",
    BUBBLE: "bubble" as "bubble",
    HEATMAP: "heatmap" as "heatmap",
    GEO: "geo" as "geo",
    PUSHPIN: "pushpin" as "pushpin",
    COMBO: "combo" as "combo",
    COMBO2: "combo2" as "combo2",
    HISTOGRAM: "histogram" as "histogram",
    BULLET: "bullet" as "bullet",
    TREEMAP: "treemap" as "treemap",
    WATERFALL: "waterfall" as "waterfall",
    FUNNEL: "funnel" as "funnel",
    PARETO: "pareto" as "pareto",
    ALLUVIAL: "alluvial" as "alluvial",
    XIRR: "xirr" as "xirr",
};

export type ChartType =
    | "bar"
    | "column"
    | "pie"
    | "line"
    | "area"
    | "donut"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "geo"
    | "combo"
    | "combo2"
    | "histogram"
    | "bullet"
    | "treemap"
    | "waterfall"
    | "funnel"
    | "pareto"
    | "alluvial";

export type GeoPushpinType = "pushpin";
export type HeadlineType = "headline";
export type XirrType = "xirr";
export type TableType = "table";
export type VisType = ChartType | GeoPushpinType | HeadlineType | TableType | XirrType;

export type ChartElementType = "slice" | "bar" | "point" | "label" | "cell"; // 'cell' for heatmap
export type HeadlineElementType = "primaryValue" | "secondaryValue";
export type TableElementType = "cell";
export type VisElementType = ChartElementType | HeadlineElementType | TableElementType;
