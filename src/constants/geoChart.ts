// (C) 2019-2020 GoodData Corporation

export const SIZE = "size";
export const COLOR = "color";
export const LOCATION = "location";
export const SEGMENT_BY = "segmentBy";
export const TOOLTIP_TEXT = "tooltipText";

export const DEFAULT_DATA_SOURCE_NAME = "gdcPushpinsData";

export const DEFAULT_LATITUDE: number = 34;
export const DEFAULT_LONGITUDE: number = 5;
export const DEFAULT_ZOOM: number = 2;

// cloned from HEATMAP_BLUE_COLOR_PALETTE
export const DEFAULT_PUSHPIN_COLOR_PALETTE = [
    // "rgb(255,255,255)", // the white color looks bad on map
    "rgb(197,236,248)",
    "rgb(138,217,241)",
    "rgb(79,198,234)",
    "rgb(20,178,226)",
    "rgb(22,151,192)",
    "rgb(0,110,145)",
];
export const DEFAULT_PUSHPIN_COLOR_VALUE = "rgb(197,236,248)";
export const DEFAULT_PUSHPIN_COLOR_VALUE_KEY = "pushpinColorValue";

export const DEFAULT_PUSHPIN_OPTIONS = {
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
    "circle-opacity": 0.75,
};

export const DEFAULT_PUSHPIN_SIZE_SCALE = [8, 9, 12, 16, 25];
export const DEFAULT_PUSHPIN_SIZE_VALUE = 8;
export const DEFAULT_PUSHPIN_SIZE_VALUE_KEY = "pushpinSizeValue";

export const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaW1udXR6IiwiYSI6ImNrMHAxY2UxZzBnc2EzZG11YmVhd2dubG0ifQ.bUTN7ceAHq6kVooe3MKgqg";

export const DEFAULT_MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v11";

export const PUSHPIN_STYLE_CIRCLE = "circle";
export const PUSHPIN_STYLE_CIRCLE_COLOR = "circle-color";
export const PUSHPIN_STYLE_CIRCLE_SIZE = "circle-radius";
