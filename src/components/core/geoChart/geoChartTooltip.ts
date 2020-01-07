// (C) 2020 GoodData Corporation
import get = require("lodash/get");
import isEmpty = require("lodash/isEmpty");
import mapboxgl from "mapbox-gl";
import { DEFAULT_PUSHPIN_COLOR_VALUE } from "../../../constants/geoChart";
import { IGeoTooltipItem } from "../../../interfaces/GeoChart";

function isTooltipItemValid(item: IGeoTooltipItem): boolean {
    if (!item) {
        return false;
    }
    const { title, value } = item;
    return Boolean(title) && Boolean(value);
}

export function shouldShowTooltip(geoProperties: GeoJSON.GeoJsonProperties): boolean {
    if (isEmpty(geoProperties)) {
        return false;
    }

    const { locationName, color, size, segmentBy } = geoProperties;
    return (
        isTooltipItemValid(locationName) ||
        isTooltipItemValid(size) ||
        isTooltipItemValid(color) ||
        isTooltipItemValid(segmentBy)
    );
}

export function getTooltipHtml(geoProperties: GeoJSON.GeoJsonProperties, tooltipStroke: string): string {
    const { locationName, size, color, segmentBy } = geoProperties;

    const tooltipItems: string = [locationName, size, color, segmentBy].map(getTooltipItemHtml).join("");

    return `<div class="gd-viz-tooltip">
                <span class="stroke gd-viz-tooltip-stroke" style="border-top-color: ${tooltipStroke}"></span>
                <div class="content gd-viz-tooltip-content">${tooltipItems}</div>
            </div>`;
}

function getTooltipItemHtml(item: IGeoTooltipItem): string {
    if (!isTooltipItemValid(item)) {
        return "";
    }

    const { title, value } = item;
    return `<div class="gd-viz-tooltip-item">
                <span class="gd-viz-tooltip-title">${title}</span>
                <div class="gd-viz-tooltip-value-wraper" >
                    <span class="gd-viz-tooltip-value">${value}</span>
                </div>
            </div>`;
}

function parseGeoProperties(properties: GeoJSON.GeoJsonProperties): GeoJSON.GeoJsonProperties {
    const { locationName = "{}", color = "{}", size = "{}", segmentBy = "{}" } = properties;
    return {
        locationName: JSON.parse(locationName),
        size: JSON.parse(size),
        color: JSON.parse(color),
        segmentBy: JSON.parse(segmentBy),
    };
}

export const handlePushpinMouseEnter = (chart: mapboxgl.Map, tooltip: mapboxgl.Popup) => (
    e: mapboxgl.EventData,
): void => {
    const [feature] = e.features;
    const { properties } = feature;
    const parsedProps = parseGeoProperties(properties);

    if (!shouldShowTooltip(parsedProps)) {
        return;
    }

    chart.getCanvas().style.cursor = "pointer";

    const coordinates = feature.geometry.coordinates.slice();
    const tooltipStroke = get(parsedProps, "color.background", DEFAULT_PUSHPIN_COLOR_VALUE);
    const tooltipHtml = getTooltipHtml(parsedProps, tooltipStroke);

    tooltip
        .setLngLat(coordinates)
        .setHTML(tooltipHtml)
        .addTo(chart);
};

export const handlePushpinMouseLeave = (chart: mapboxgl.Map, tooltip: mapboxgl.Popup) => (): void => {
    chart.getCanvas().style.cursor = "";
    tooltip.remove();
};
