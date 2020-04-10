// (C) 2020 GoodData Corporation
import React from "react";
import "@gooddata/react-components/styles/css/main.css";
import { GeoPushpinChart, HeaderPredicateFactory, Model } from "@gooddata/react-components";

import { projectId } from "../utils/fixtures";
import {
    MAPBOX_TOKEN,
    cityCoordinatesUri,
    populationUri,
    densityUri,
    stateNamesUri,
} from "../utils/fixturesGeoChart";
import { ExampleWithOnDrill } from "./utils/ExampleWithOnDrill";

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
const drillableItems = [
    HeaderPredicateFactory.uriMatch(populationUri),
    HeaderPredicateFactory.uriMatch(densityUri),
];

export class GeoPushpinChartDrillExample extends ExampleWithOnDrill {
    render() {
        return (
            <div className="s-geo-pushpin-chart-on-drill">
                <div style={{ height: 300 }} className="s-geo-pushpin-chart">
                    <GeoPushpinChart
                        projectId={projectId}
                        location={locationAttribute}
                        size={sizeMeasure}
                        color={colorMeasure}
                        segmentBy={segmentByAttribute}
                        config={{
                            mapboxToken: MAPBOX_TOKEN,
                        }}
                        drillableItems={drillableItems}
                        onFiredDrillEvent={this.onDrill}
                    />
                </div>
                {this.renderDrillEvent()}
            </div>
        );
    }
}

export default GeoPushpinChartDrillExample;
