const DEFAULT_SCENARIO_CONFIG = {
    readyEvent: 'GDC_GEO_CANVAS_READY'
};

const configuration = {
    sections: {
        'Core components/GeoPushpinChart': {
            'with location': DEFAULT_SCENARIO_CONFIG,
            'with location and show unclustered pins': DEFAULT_SCENARIO_CONFIG,
            'with location and size': DEFAULT_SCENARIO_CONFIG,
            'with location, size and segmentBy': DEFAULT_SCENARIO_CONFIG,
            'with location and color': DEFAULT_SCENARIO_CONFIG,
            'with location, size and color': DEFAULT_SCENARIO_CONFIG,
            'with location and size, color contains same values': DEFAULT_SCENARIO_CONFIG,
            'with location, size, color, segmentBy and tooltipText': DEFAULT_SCENARIO_CONFIG,
            'with location, size, color, segmentBy, tooltipText and location filter': DEFAULT_SCENARIO_CONFIG,
            'with North America viewport': DEFAULT_SCENARIO_CONFIG,
            'with World viewport': DEFAULT_SCENARIO_CONFIG,
            'with Include all data viewport': DEFAULT_SCENARIO_CONFIG,
            'with disabled interactive and zoom control button': DEFAULT_SCENARIO_CONFIG,
            'with color and segment alias shown in tooltip': DEFAULT_SCENARIO_CONFIG,
        },
        'URI components': {
            'GeoPushpinChart example': DEFAULT_SCENARIO_CONFIG,
        }
    }
};

module.exports = configuration;
