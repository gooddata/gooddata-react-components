// (C) 2007-2018 GoodData Corporation
import { getHighchartsOptions } from '../highChartsCreators';
import { VisualizationTypes } from '../../../../constants/visualizationTypes';

const chartOptions = {
    data: {
        series: [
            {
                isDrillable: false,
                name: 'aa',
                data: [
                    {
                        name: 'aa.0'
                    },
                    null
                ],
                color: 'rgb(20,178,226)'
            },
            {
                isDrillable: true,
                name: 'bb',
                data: [
                    {
                        name: 'bb.0'
                    },
                    null
                ],
                color: 'rgb(0,193,141)'
            }
        ]
    }
};

const pieChartOrTreemapOptions = {
    type: VisualizationTypes.PIE,
    colorPalette: [
        'rgb(20,178,226)',
        'rgb(0,193,141)'
    ],
    data: {
        series: [
            {
                name: 'aa',
                data: [
                    {
                        name: 'aa.0',
                        drilldown: false
                    },
                    {
                        name: 'bb.0',
                        drilldown: true
                    }
                ]
            }
        ]
    }
};

const comboChartOptions = {
    type: VisualizationTypes.COMBO,
    data: {
        series: [
            {
                isDrillable: false,
                name: 'aa',
                data: [
                    {
                        name: 'aa.0'
                    },
                    null
                ],
                color: 'rgb(20, 178, 226)'
            },
            {
                isDrillable: true,
                type: 'line',
                name: 'bb',
                data: [
                    {
                        name: 'bb.0'
                    },
                    null
                ],
                color: 'rgb(0,193,141)'
            }
        ]
    }
};

describe('highChartCreators', () => {
    describe('Line chart configuration', () => {
        const config = getHighchartsOptions({ ...chartOptions, type: VisualizationTypes.LINE }, {});

        it('contains styles for drillable', () => {
            expect(config).toHaveProperty('series.0.states.hover.halo.size', 0);

            expect(config).not.toHaveProperty('series.0.marker.states.hover.fillColor');
            expect(config).not.toHaveProperty('series.0.cursor');
        });

        it('contains styles for non-drillable', () => {
            expect(config).not.toHaveProperty('series.1.states.hover.halo.size');

            expect(config).toHaveProperty('series.1.marker.states.hover.fillColor', 'rgb(26,199,152)');
            expect(config).toHaveProperty('series.1.cursor', 'pointer');
        });
    });

    describe('Area chart configuration', () => {
        const config = getHighchartsOptions({ ...chartOptions, type: VisualizationTypes.AREA }, {});

        it('contains styles for drillable', () => {
            expect(config).toHaveProperty('series.0.states.hover.halo.size', 0);

            expect(config).not.toHaveProperty('series.0.marker.states.hover.fillColor');
            expect(config).not.toHaveProperty('series.0.cursor');
        });

        it('contains styles for non-drillable', () => {
            expect(config).not.toHaveProperty('series.1.states.hover.halo.size');

            expect(config).toHaveProperty('series.1.marker.states.hover.fillColor', 'rgb(26,199,152)');
            expect(config).toHaveProperty('series.1.cursor', 'pointer');
        });
    });

    describe('Column chart configuration', () => {
        const config = getHighchartsOptions({ ...chartOptions, type: VisualizationTypes.COLUMN }, {});

        it('contains styles for drillable and non-drillable', () => {
            expect(config).toHaveProperty('series.0.states.hover.brightness');
            expect(config).toHaveProperty('series.0.states.hover.enabled', false);
            expect(config).toHaveProperty('series.1.states.hover.enabled', true);
        });
    });

    describe('Column chart stacked configuration', () => {
        const config = getHighchartsOptions({ ...chartOptions, type: VisualizationTypes.COLUMN, stacking: true }, {});

        it('contains drilldown label styles', () => {
            expect(config).toHaveProperty('drilldown.activeDataLabelStyle.color');
        });
    });

    describe('Bar chart configuration', () => {
        const config = getHighchartsOptions({ ...chartOptions, type: VisualizationTypes.BAR }, {});

        it('contains styles for drillable and non-drillable', () => {
            expect(config).toHaveProperty('series.0.states.hover.brightness');
            expect(config).toHaveProperty('series.0.states.hover.enabled', false);
            expect(config).toHaveProperty('series.1.states.hover.enabled', true);
        });
    });

    describe('Pie chart configuration', () => {
        const config = getHighchartsOptions(pieChartOrTreemapOptions, {});

        it('contains styles for drillable and non-drillable', () => {
            expect(config).toHaveProperty('series.0.data.0.states.hover.brightness');
            expect(config).toHaveProperty('series.0.data.0.halo.size', 0);
            expect(config).not.toHaveProperty('series.0.data.1.halo.size');
        });
    });

    describe('Treemap configuration', () => {
        const config = getHighchartsOptions(pieChartOrTreemapOptions, {});

        it('contains styles for drillable and non-drillable', () => {
            expect(config).toHaveProperty('series.0.data.0.states.hover.brightness');
            expect(config).toHaveProperty('series.0.data.0.halo.size', 0);
            expect(config).not.toHaveProperty('series.0.data.1.halo.size');
        });
    });

    describe('Combo chart configuration', () => {
        const config = getHighchartsOptions(comboChartOptions, {});

        it('contains different hover styles for column and line series', () => {
            expect(config).toHaveProperty('series.0.states.hover.brightness');
            expect(config).toHaveProperty('series.0.states.hover.enabled', false);
            expect(config).toHaveProperty('series.1.cursor', 'pointer');
        });
    });

    describe('Heatmap configuration', () => {
        const config = getHighchartsOptions({
            ...chartOptions,
            type: VisualizationTypes.HEATMAP,
            data: {
                ...chartOptions.data,
                categories: []
            }
        }, {});

        it('have no white grid line between each cell', () => {
            expect(config.series[0].borderWidth).toBe(0);
        });

        it('defined empty data pattern', () => {
            expect(config.defs.patterns[0].id).toEqual('empty-data-pattern');
        });
    });
});
