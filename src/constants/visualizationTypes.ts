// (C) 2007-2018 GoodData Corporation
export const VisualizationTypes = {
    BAR: 'bar' as 'bar',
    COLUMN: 'column' as 'column',
    LINE: 'line' as 'line',
    PIE: 'pie' as 'pie',
    DONUT: 'donut' as 'donut',
    TABLE: 'table' as 'table',
    HEADLINE: 'headline' as 'headline',
    AREA: 'area' as 'area'
};

export type ChartType = 'bar' | 'column' | 'pie' | 'donut' | 'line' | 'area';
export type VisType = ChartType | 'table' | 'headline';
export type ChartElementType = 'slice' | 'bar' | 'point';
export type VisElementType = ChartElementType | 'cell';
