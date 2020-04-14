// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { CUSTOM_COLOR_PALETTE } from "../utils/colors";
import {
    MAPBOX_TOKEN,
    cityCoordinatesUri,
    populationUri,
    densityUri,
    stateNamesUri,
    cityNamesUri,
    predicateAttributeHeaderItemUri,
    predicateAttributeHeaderItemName,
} from "../utils/fixturesGeoChart";

const sizeMeasure = Model.measure(populationUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Population");
const colorMeasure = Model.measure(densityUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Density");
const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");
const segmentByAttribute = Model.attribute(stateNamesUri).localIdentifier("segment");
const tooltipTextAttribute = Model.attribute(cityNamesUri).localIdentifier("tooltipText");

const colorMapping = [
    {
        predicate: headerItem =>
            headerItem.attributeHeaderItem &&
            headerItem.attributeHeaderItem.uri === predicateAttributeHeaderItemUri, // find attribute item by uri
        color: {
            type: "guid",
            value: "03",
        },
    },
    {
        predicate: headerItem =>
            headerItem.attributeHeaderItem &&
            headerItem.attributeHeaderItem.name === predicateAttributeHeaderItemName, // find attribute item by Name
        color: {
            type: "rgb",
            value: { r: 162, g: 37, b: 34 },
        },
    },
];

export class GeoPushpinChartConfigurationColorMappingExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationColorMappingExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationColorMappingExample onError", ...params);
    }

    onZoomChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationColorMappingExample onZoomChanged", ...params);
    }

    onCenterPositionChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log(
            "GeoPushpinChartConfigurationColorMappingExample onCenterPositionChanged",
            ...params,
        );
    }

    render() {
        const style = { height: "500px" };
        const geoConfig = {
            tooltipText: tooltipTextAttribute,
            mapboxToken: MAPBOX_TOKEN,
            colorPalette: CUSTOM_COLOR_PALETTE,
            colorMapping,
        };
        return (
            <div style={style} className="s-geo-pushpin-chart-configuration-custom-color">
                <GeoPushpinChart
                    projectId={projectId}
                    location={locationAttribute}
                    size={sizeMeasure}
                    color={colorMeasure}
                    segmentBy={segmentByAttribute}
                    config={geoConfig}
                    onZoomChanged={this.onZoomChanged}
                    onCenterPositionChanged={this.onCenterPositionChanged}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default GeoPushpinChartConfigurationColorMappingExample;
