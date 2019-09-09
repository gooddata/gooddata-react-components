// (C) 2007-2019 GoodData Corporation

import React, { Component } from "react";
import { Table, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    locationStateDisplayFormIdentifier,
    numberOfRestaurantsIdentifier,
    totalSalesIdentifier,
} from "../utils/fixtures";

const localIdentifiers = {
    numberOfRestaurants: "numberOfRestaurants",
    averageRestaurantDailyCosts: "averageRestaurantDailyCosts",
    averageRestaurantSales: "averageRestaurantSales",
};

const measures = [
    Model.measure(totalSalesIdentifier)
        .localIdentifier(localIdentifiers.averageRestaurantDailyCosts)
        .format("#,##0"),
    Model.measure(numberOfRestaurantsIdentifier)
        .localIdentifier(localIdentifiers.numberOfRestaurants)
        .format("#,##0"),
    Model.arithmeticMeasure(
        [localIdentifiers.averageRestaurantDailyCosts, localIdentifiers.numberOfRestaurants],
        "ratio",
    )
        .localIdentifier(localIdentifiers.averageRestaurantSales)
        .format("#,##0")
        .title("$ Avg Restaurant Sales"),
];

const attributes = [Model.attribute(locationStateDisplayFormIdentifier).localIdentifier("month")];

export class ArithmeticMeasureRatioExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("ArithmeticMeasureRatioExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("ArithmeticMeasureRatioExample onError", ...params);
    }

    render() {
        return (
            <div style={{ height: 200 }} className="s-table">
                <Table
                    projectId={projectId}
                    measures={measures}
                    attributes={attributes}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default ArithmeticMeasureRatioExample;
