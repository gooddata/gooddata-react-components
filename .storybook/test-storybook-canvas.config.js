const DEFAULT_SCENARIO_CONFIG = {
    readyEvent: "GDC_GEO_CANVAS_READY",
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

const configuration = {
    sections: {
        "Core components/GeoPushpinChart": chartStories.reduce(
            (result, story) => ({
                ...result,
                [story]: DEFAULT_SCENARIO_CONFIG,
            }),
            {},
        ),
        "Core components/GeoPushpinChart/Config/Legend": legendStories.reduce(
            (result, story) => ({
                ...result,
                [story]: DEFAULT_SCENARIO_CONFIG,
            }),
            {},
        ),
        "Core components/GeoPushpinChart/Config/Color": colorMappingStories.reduce(
            (result, story) => ({
                ...result,
                [story]: DEFAULT_SCENARIO_CONFIG,
            }),
            {},
        ),
        "Core components/GeoPushpinChart/Config/Viewport": viewportStories.reduce(
            (result, story) => ({
                ...result,
                [story]: DEFAULT_SCENARIO_CONFIG,
            }),
            {},
        ),
        "Core components/GeoPushpinChart/Config/Points": pointsStories.reduce(
            (result, story) => ({
                ...result,
                [story]: DEFAULT_SCENARIO_CONFIG,
            }),
            {},
        ),
        /* This test case as it's unstable now. We'll bring it back once SD-948 is resolved. 
        .add("GeoPushpinChart example", () =>
        "URI components": {
            "GeoPushpinChart example": DEFAULT_SCENARIO_CONFIG,
        },
        */
    },
};

module.exports = configuration;
