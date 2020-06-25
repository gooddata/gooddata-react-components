const DEFAULT_SCENARIO_CONFIG = {
    readyEvent: "GDC_GEO_CANVAS_READY",
    // Sometimes, Color/Position of labels in Mapbox is rendered incorrectly.
    // BackstopJS would wait for 200 milliseconds before taking a screenshot
    delay: 200,
    misMatchThreshold: 0.3
};

const chartStories = [
    "with location",
    "with location and show unclustered pins",
    "with location and size",
    "with location, size and segmentBy",
    "with location and color",
    "with location, size and color",
    "with location and size, color contains same values",
    "with location, size, color, segmentBy and tooltipText",
    "with location, size, color, segmentBy, tooltipText and location filter",
    "with color and segment alias shown in tooltip",
    "empty map",
];

const legendStories = [
    "with legend is disabled",
    "with legend position is auto",
    "with legend position is left",
    "with legend position is right",
    "with legend position is top",
    "with legend position is bottom",
    "with legend position is left and height of container is not enough",
];

const colorMappingStories = [
    "with custom colors",
    "with custom colors, color mapping for SegmentBy",
    "with color mapping for Location",
];

const viewportStories = [
    "with North America viewport",
    "with World viewport",
    "with Include all data viewport",
    "with disabled interactive and zoom control button",
];

const pointsStories = [
    "with disabled groupNearbyPoints",
    "with enabled groupNearbyPoints",
    "with config point size",
];

const URIComponentsStories = ["GeoPushpinChart example"];

function configGenerator(stories, config = DEFAULT_SCENARIO_CONFIG) {
    return stories.reduce(
        (result, story) => ({
            ...result,
            [story]: config,
        }),
        {},
    );
}

const configuration = {
    sections: {
        "Core components/GeoPushpinChart": configGenerator(chartStories),
        "Core components/GeoPushpinChart/Config/Legend": configGenerator(legendStories),
        "Core components/GeoPushpinChart/Config/Color": configGenerator(colorMappingStories),
        "Core components/GeoPushpinChart/Config/Viewport": configGenerator(viewportStories),
        "Core components/GeoPushpinChart/Config/Points": configGenerator(pointsStories),
        "URI components": configGenerator(URIComponentsStories),
    },
};

module.exports = configuration;
