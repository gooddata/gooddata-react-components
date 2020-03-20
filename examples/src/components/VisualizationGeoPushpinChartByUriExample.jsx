// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization } from "@gooddata/react-components";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, geoPushpinChartVisualizationUri } from "../utils/fixturesGeoChart";

export class VisualizationGeoPushpinChartByUri extends Component {
    render() {
        const geoConfig = {
            mapboxToken: MAPBOX_TOKEN,
        };
        const style = { height: "500px" };
        return (
            <div style={style} className="s-visualization-geo-pushpin">
                <Visualization
                    projectId={projectId}
                    uri={geoPushpinChartVisualizationUri}
                    config={geoConfig}
                />
            </div>
        );
    }
}

export default VisualizationGeoPushpinChartByUri;
