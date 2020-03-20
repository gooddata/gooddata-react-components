// (C) 2007-2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, cityCoordinatesUri } from "../utils/fixturesGeoChart";

const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");

export class GeoPushpinChartConfigurationViewportExample extends Component {
    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationViewportExample onError", ...params);
    }

    render() {
        const style = { height: "500px" };
        return (
            <div style={style} className="s-geo-pushpin-chart-configuration-viewport">
                <GeoPushpinChart
                    projectId={projectId}
                    location={locationAttribute}
                    config={{
                        mapboxToken: MAPBOX_TOKEN,
                        viewport: {
                            area: "continent_sa",
                        },
                    }}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default GeoPushpinChartConfigurationViewportExample;
