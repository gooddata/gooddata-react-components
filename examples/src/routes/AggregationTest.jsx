// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { BarChart, ColumnChart, PieChart } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import {
    totalSalesIdentifier,
    locationResortIdentifier,
    monthDateIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty,
    projectId
} from '../utils/fixtures';
import { createMeasureBucketItem, createAttributeBucketItem } from '../utils/helpers';

const totalSales = createMeasureBucketItem(totalSalesIdentifier);
totalSales.measure.definition.measureDefinition.aggregation = 'sum';

const locationResort = createAttributeBucketItem(locationResortIdentifier);
const month = createAttributeBucketItem(monthDateIdentifier);

const franchiseFeesMeasures = [
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty
].map((identifier) => {
    const bucket = createMeasureBucketItem(identifier);
    bucket.measure.definition.measureDefinition.aggregation = 'sum';
    return bucket;
});

export class AggregationTest extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info('onLoadingChanged', ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info('onLoadingChanged', ...params);
    }

    render() {
        return (
            <div>
                <h1>Aggregation test</h1>

                <p>This route is meant for testing requests with aggregation that sometimes fail during migration.</p>

                <hr className="separator" />

                <h2 id="bar-chart">Bar chart</h2>
                <div style={{ height: 300 }} className="s-bar-chart">
                    <BarChart
                        projectId={projectId}
                        measures={[totalSales]}
                        viewBy={locationResort}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                    />
                </div>

                <hr className="separator" />

                <h2 id="column-chart">Column chart</h2>
                <div style={{ height: 300 }} className="s-bar-chart">
                    <ColumnChart
                        projectId={projectId}
                        measures={[totalSales]}
                        viewBy={month}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                    />
                </div>

                <hr className="separator" />

                <h2 id="column-chart">Pie chart</h2>

                <div style={{ height: 300 }} className="s-pie-chart">
                    <PieChart
                        projectId={projectId}
                        measures={franchiseFeesMeasures}
                        onLoadingChanged={this.onLoadingChanged}
                        onError={this.onError}
                    />
                </div>

            </div>
        );
    }
}

export default AggregationTest;
