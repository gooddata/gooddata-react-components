// (C) 2007-2019 GoodData Corporation
import React, { Component } from "react";
import { LineChart, AttributeFilter, Model, ErrorComponent } from "@gooddata/react-components";
import { AFM } from "@gooddata/typings";

import "@gooddata/react-components/styles/css/main.css";

import { totalSalesIdentifier, locationResortIdentifier, projectId } from "../utils/fixtures";

export class AttributeFilterExample extends Component {
    constructor(props) {
        super(props);

        this.onApply = this.onApply.bind(this);
        this.state = {
            filters: [],
            error: null,
        };
    }

    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info("AttributeFilterExample onLoadingChanged", ...params);
    }

    onApply(filter) {
        // eslint-disable-next-line no-console
        console.log("AttributeFilterExample onApply", filter);
        const inType = AFM.isPositiveAttributeFilter(filter) ? "in" : "notIn";
        const filterItems = AFM.isPositiveAttributeFilter(filter)
            ? filter.positiveAttributeFilter[inType]
            : filter.negativeAttributeFilter[inType];

        if (!filterItems.length) {
            this.setState({ filters: [], error: null });
        } else {
            this.setState({ filters: [filter], error: null });
        }
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info("AttributeFilterExample onLoadingChanged", ...params);
    }

    render() {
        const { filters, error } = this.state;

        const totalSales = Model.measure(totalSalesIdentifier)
            .format("#,##0")
            .alias("$ Total Sales");

        const locationResort = Model.attribute(locationResortIdentifier);

        return (
            <div className="s-attribute-filter">
                <AttributeFilter
                    projectId={projectId}
                    filter={Model.negativeAttributeFilter(locationResortIdentifier, [])}
                    fullscreenOnMobile={false}
                    onApply={this.onApply}
                />
                <div style={{ height: 300 }} className="s-line-chart">
                    {error ? (
                        <ErrorComponent message={error} />
                    ) : (
                        <LineChart
                            projectId={projectId}
                            measures={[totalSales]}
                            trendBy={locationResort}
                            filters={filters}
                            onLoadingChanged={this.onLoadingChanged}
                            onError={this.onError}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default AttributeFilterExample;
