// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, cityCoordinatesUri } from "../utils/fixturesGeoChart";

const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");

export class GeoPushpinChartConfigurationPointsGroupNearbyExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupNearbyPoints: false,
        };
    }
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log(
            "GeoPushpinChartConfigurationPointsGroupNearbyExample onLoadingChanged",
            ...params,
        );
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationPointsGroupNearbyExample onError", ...params);
    }

    onZoomChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationPointsGroupNearbyExample onZoomChanged", ...params);
    }

    onCenterPositionChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log(
            "GeoPushpinChartConfigurationPointsGroupNearbyExample onCenterPositionChanged",
            ...params,
        );
    }

    toggleGroupNearbyPoints = () => {
        this.setState(prevState => ({
            groupNearbyPoints: !prevState.groupNearbyPoints,
        }));
    };

    render() {
        const style = { height: "500px" };
        const { groupNearbyPoints } = this.state;
        const geoConfig = {
            mapboxToken: MAPBOX_TOKEN,
            points: {
                groupNearbyPoints,
            },
        };

        return (
            <div className="s-geo-chart">
                <button className="s-change-group-nearby-points" onClick={this.toggleGroupNearbyPoints}>
                    Toggle Group nearby points
                </button>
                <div style={style} className="s-geo-pushpin-chart-configuration-points-group-nearby">
                    <GeoPushpinChart
                        projectId={projectId}
                        location={locationAttribute}
                        config={geoConfig}
                        onZoomChanged={this.onZoomChanged}
                        onCenterPositionChanged={this.onCenterPositionChanged}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                    />
                </div>
            </div>
        );
    }
}

export default GeoPushpinChartConfigurationPointsGroupNearbyExample;
