const merge = require('lodash/merge');

const canvasConfiguration = require('./test-storybook-canvas.config');
const NOT_PROCESSING = ':not(.screenshot-ready-wrapper-processing)';
const defaultReadySelector = `${NOT_PROCESSING} .screenshot-target, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .highcharts-container, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .s-headline-value, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .viz-table-wrap, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .gdc-kpi, .screenshot-wrapper > .gdc-kpi,` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .gdc-kpi-error, .screenshot-wrapper > .gdc-kpi-error, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .s-error, ` +
    `.screenshot-wrapper > ${NOT_PROCESSING} .s-gd-geo-chart-renderer .mapboxgl-canvas, ` +
    '.screenshot-wrapper .screenshot-ready-wrapper-done';

const configuration = {
    sections: {
        _defaults: {
            'readySelector': defaultReadySelector
        }
    }
};

module.exports = merge({}, configuration, canvasConfiguration);
