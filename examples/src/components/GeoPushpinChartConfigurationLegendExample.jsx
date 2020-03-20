// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, cityCoordinatesUri, populationUri, stateNamesUri } from "../utils/fixturesGeoChart";

const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");
const segmentByAttribute = Model.attribute(stateNamesUri).localIdentifier("segment");
const sizeMeasure = Model.measure(populationUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Population");

export class GeoPushpinChartConfigurationLegendExample extends Component {
    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationLegendExample onError", ...params);
    }

    render() {
        const style = { height: "500px" };
        const geoConfig = {
            mapboxToken: MAPBOX_TOKEN,
            legend: {
                position: "right", // could be "top", "right", "bottom" or "left"
            },
        };
        return (
            <div style={style} className="s-geo-pushpin-chart-configuration-legend">
                <GeoPushpinChart
                    projectId={projectId}
                    location={locationAttribute}
                    segmentBy={segmentByAttribute}
                    size={sizeMeasure}
                    config={geoConfig}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default GeoPushpinChartConfigurationLegendExample;
