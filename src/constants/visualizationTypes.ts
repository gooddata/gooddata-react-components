// (C) 2007-2018 GoodData Corporation
export const VisualizationTypes = {
    BAR: 'bar' as 'bar',
    COLUMN: 'column' as 'column',
    LINE: 'line' as 'line',
    PIE: 'pie' as 'pie',
    TABLE: 'table' as 'table',
    DOUGHNUT: 'doughnut' as 'doughnut',
    COMBO: 'combo' as 'combo',
    HEADLINE: 'headline' as 'headline',
    DONUT: 'donut' as 'donut',
    COLUMNLINE: 'column-line' as 'column-line',
    COLUMNAREA: 'column-area' as 'column-area',
    BARLINE: 'bar-line' as 'bar-line',
    AREA: 'area' as 'area',
    AREALINE: 'area-line' as 'area-line',
    BULLET: 'bullet' as 'bullet',
    FUNNEL: 'funnel' as 'funnel',
    SANKEY: 'sankey' as 'sankey',
    SCATTER: 'scatter' as 'scatter',
    BUBBLE: 'bubble' as 'bubble',
    TREEMAP: 'treemap' as 'treemap',
    HEATMAP: 'heatmap' as 'heatmap',
    WORDCLOUD: 'wordcloud' as 'wordcloud',
    WATERFALL: 'waterfall' as 'waterfall',
    HISTOGRAM: 'histogram' as 'histogram',
    PARETO: 'pareto' as 'pareto'
};

export type ChartType = 'bar' | 'column' | 'pie' | 'line' | 'doughnut' |
    'combo' | 'donut' | 'column-line' | 'column-area' | 'area' |
    'area-line' | 'bullet' | 'funnel' | 'sankey' | 'scatter' | 'bubble' |
    'treemap' | 'heatmap' | 'wordcloud' | 'waterfall' | 'histogram' | 'pareto';
export type VisType = ChartType | 'table' | 'headline';
export type ChartElementType = 'slice' | 'bar' | 'point';
export type VisElementType = ChartElementType | 'cell' | 'primaryValue' | 'secondaryValue';
