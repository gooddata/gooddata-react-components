// (C) 2007-2019 GoodData Corporation
import React from "react";
import { BarChart, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { totalSalesIdentifier, locationResortIdentifier, projectId } from "../utils/fixtures";
import { ExampleWithOnDrill } from "./utils/ExampleWithOnDrill";

const amount = Model.measure(totalSalesIdentifier)
    .format("#,##0")
    .alias("$ Total Sales")
    .localIdentifier("m1");

const locationResort = Model.attribute(locationResortIdentifier).localIdentifier("a1");

export class BarChartOnDrillExample extends ExampleWithOnDrill {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info("BarChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info("BarChartExample onLoadingChanged", ...params);
    }

    render() {
        return (
            <div className="s-bar-chart-on-drill">
                <div style={{ height: 300 }} className="s-bar-chart">
                    <BarChart
                        projectId={projectId}
                        measures={[amount]}
                        viewBy={locationResort}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                        onDrill={this.onDrill}
                        drillableItems={[
                            {
                                identifier: totalSalesIdentifier,
                            },
                        ]}
                    />
                </div>
                {this.renderDrillEvent()}
            </div>
        );
    }
}

export default BarChartOnDrillExample;
