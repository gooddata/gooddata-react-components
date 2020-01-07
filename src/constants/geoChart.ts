// (C) 2019-2020 GoodData Corporation
import { DEFAULT_COLORS } from "../components/visualizations/utils/color";

export const DEFAULT_DATA_SOURCE_NAME = "gdcPushpinsData";

export const DEFAULT_LATITUDE: number = 34;
export const DEFAULT_LONGITUDE: number = 5;
export const DEFAULT_ZOOM: number = 2;

// 6 steps, should be lesser than 20
export const DEFAULT_PUSHPIN_COLOR_SCALE = 6;
export const DEFAULT_PUSHPIN_COLOR_VALUE = DEFAULT_COLORS[0];
export const DEFAULT_PUSHPIN_COLOR_VALUE_KEY = "pushpinColorValue";

export const DEFAULT_PUSHPIN_OPTIONS = {
    "circle-stroke-width": 1,
};

export const DEFAULT_PUSHPIN_SEGMENT_BY_VALUE_KEY = "pushpinSegmentByValue";

export const DEFAULT_PUSHPIN_SIZE_SCALE = [10, 28, 46, 64, 82, 100];
export const DEFAULT_PUSHPIN_SIZE_VALUE = 10;
export const DEFAULT_PUSHPIN_SIZE_VALUE_KEY = "pushpinSizeValue";

export const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaW1udXR6IiwiYSI6ImNrMHAxY2UxZzBnc2EzZG11YmVhd2dubG0ifQ.bUTN7ceAHq6kVooe3MKgqg";

const DEFAULT_MAPBOX_STYLE = "mapbox://styles/mapbox/light-v10";
export const DEFAULT_MAPBOX_OPTIONS = {
    // hide mapbox's information on map
    attributionControl: false,
    style: DEFAULT_MAPBOX_STYLE,
};

export const PUSHPIN_STYLE_CIRCLE = "circle";
export const PUSHPIN_STYLE_CIRCLE_COLOR = "circle-color";
export const PUSHPIN_STYLE_CIRCLE_SIZE = "circle-radius";
export const PUSHPIN_STYLE_CIRCLE_STROKE_COLOR = "circle-stroke-color";
