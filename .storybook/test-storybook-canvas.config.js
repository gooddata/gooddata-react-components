const DEFAULT_SCENARIO_CONFIG = {
    readyEvent: 'GDC_GEO_CANVAS_READY'
};

const configuration = {
    sections: {
        'Core components/GeoChartInner': {
            'with location': DEFAULT_SCENARIO_CONFIG,
            'with location and size': DEFAULT_SCENARIO_CONFIG,
            'with location and color': DEFAULT_SCENARIO_CONFIG,
            'with location, size and color': DEFAULT_SCENARIO_CONFIG,
            'with location, size, color and segmentBy': DEFAULT_SCENARIO_CONFIG,
        },
        'Core components/GeoPushpinChart': {
            'with location': DEFAULT_SCENARIO_CONFIG,
            'with location and size': DEFAULT_SCENARIO_CONFIG,
            'with location and color': DEFAULT_SCENARIO_CONFIG,
            'with location, size and color': DEFAULT_SCENARIO_CONFIG,
            'with location, size, color, segmentBy and tooltipText': DEFAULT_SCENARIO_CONFIG,
            'with location, size, color, segmentBy, tooltipText and location filter': DEFAULT_SCENARIO_CONFIG,
        }
    }
};

module.exports = configuration;
