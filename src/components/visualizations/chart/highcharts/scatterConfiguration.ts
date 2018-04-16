import cloneDeep = require('lodash/cloneDeep');

const SCATTER_TEMPLATE: any = {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    plotOptions: {
        scatter: {
            marker: {
                symbol: 'circle',
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            }
        },
        xAxis: [{
            labels: {
                enabled: true
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        }],
        yAxis: [{
            labels: {
                enabled: true
            }
        }]
    },
    series: {
        states: {
            hover: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    }
};

export function getScatterConfiguration() {
    return cloneDeep(SCATTER_TEMPLATE);
}
