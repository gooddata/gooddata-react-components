// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, cityCoordinatesUri, populationUri, densityUri } from "../utils/fixturesGeoChart";

const sizeMeasure = Model.measure(populationUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Population");
const colorMeasure = Model.measure(densityUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Density");
const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");

export class GeoPushpinChartWithColorLegendExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartWithColorLegendExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartWithColorLegendExample onError", ...params);
    }

    onZoomChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartWithColorLegendExample onZoomChanged", ...params);
    }

    onCenterPositionChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartWithColorLegendExample onCenterPositionChanged", ...params);
    }

    render() {
        const style = { height: "500px" };
        return (
            <div style={style} className="s-geo-pushpin-chart-color">
                <GeoPushpinChart
                    projectId={projectId}
                    location={locationAttribute}
                    size={sizeMeasure}
                    color={colorMeasure}
                    config={{
                        mapboxToken: MAPBOX_TOKEN,
                    }}
                    onZoomChanged={this.onZoomChanged}
                    onCenterPositionChanged={this.onCenterPositionChanged}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default GeoPushpinChartWithColorLegendExample;
