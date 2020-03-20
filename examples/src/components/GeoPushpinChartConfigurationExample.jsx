// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import {
    MAPBOX_TOKEN,
    cityCoordinatesUri,
    populationUri,
    densityUri,
    stateNamesUri,
    cityNamesUri,
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

export class GeoPushpinChartConfigurationExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationExample onError", ...params);
    }

    onZoomChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationExample onZoomChanged", ...params);
    }

    onCenterPositionChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationExample onCenterPositionChanged", ...params);
    }

    render() {
        const style = { height: "500px" };
        const geoConfig = {
            center: {
                lat: 39,
                lng: -80.5,
            },
            zoom: 6,
            tooltipText: tooltipTextAttribute,
            mapboxToken: MAPBOX_TOKEN,
        };
        return (
            <div style={style} className="s-geo-pushpin-chart-configuration">
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

export default GeoPushpinChartConfigurationExample;
