export const VisualizationTypes = {
    BAR: 'bar' as 'bar',
    COLUMN: 'column' as 'column',
    LINE: 'line' as 'line',
    PIE: 'pie' as 'pie',
    TABLE: 'table' as 'table',
    DOUGHNUT: 'doughnut' as 'doughnut',
    COMBO: 'combo' as 'combo'
};

export type ChartType = 'bar' | 'column' | 'pie' | 'line' | 'doughnut' | 'combo';
export type VisType = ChartType | 'table';
export type ChartElementType = 'slice' | 'bar' | 'point';
export type VisElementType = ChartElementType | 'cell';
