// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { GeoPushpinChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId } from "../utils/fixtures";
import { MAPBOX_TOKEN, cityCoordinatesUri, populationUri } from "../utils/fixturesGeoChart";

const sizeMeasure = Model.measure(populationUri)
    .format("#,##0.00")
    .aggregation("sum")
    .alias("Population");
const locationAttribute = Model.attribute(cityCoordinatesUri).localIdentifier("location");
const POINT_SIZE_OPTIONS = ["default", "0.5x", "0.75x", "normal", "1.25x", "1.5x"];

export class GeoPushpinChartConfigurationPointsSizeExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minSize: "default",
            maxSize: "default",
        };
    }
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationPointsSizeExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationPointsSizeExample onError", ...params);
    }

    onZoomChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("GeoPushpinChartConfigurationPointsSizeExample onZoomChanged", ...params);
    }

    onCenterPositionChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log(
            "GeoPushpinChartConfigurationPointsSizeExample onCenterPositionChanged",
            ...params,
        );
    }

    onPointSizeChange = event => {
        const { id, value } = event.target;
        this.setState({
            [id]: value,
        });
    };

    renderPointSizeDropDown = (id, label) => (
        <span style={{ display: "inline-block", minWidth: "10em", verticalAlign: "middle" }}>
            {`${label}: `}
            <select id={id} onChange={this.onPointSizeChange}>
                {POINT_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
        </span>
    );

    render() {
        const style = { height: "500px" };
        const { minSize, maxSize } = this.state;
        const geoConfig = {
            mapboxToken: MAPBOX_TOKEN,
            points: {
                minSize,
                maxSize,
            },
        };

        return (
            <div className="s-geo-chart">
                <div style={{ marginTop: "10px" }}>
                    {this.renderPointSizeDropDown("minSize", "Min Size")}
                    {this.renderPointSizeDropDown("maxSize", "Max Size")}
                </div>
                <div style={style} className="s-geo-pushpin-chart-configuration-points-size">
                    <GeoPushpinChart
                        projectId={projectId}
                        location={locationAttribute}
                        size={sizeMeasure}
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

export default GeoPushpinChartConfigurationPointsSizeExample;
