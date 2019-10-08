// (C) 2007-2019 GoodData Corporation
import React from "react";
import { Headline, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import { projectId, franchiseFeesIdentifier, franchiseFeesAdRoyaltyIdentifier } from "../utils/fixtures";
import { ExampleWithOnDrill } from "./utils/ExampleWithOnDrill";

const primaryMeasure = Model.measure(franchiseFeesIdentifier)
    .format("#,##0")
    .localIdentifier("m1");
const secondaryMeasure = Model.measure(franchiseFeesAdRoyaltyIdentifier)
    .format("#,##0")
    .localIdentifier("m2");

export class HeadlineOnDrillExample extends ExampleWithOnDrill {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onError", ...params);
    }

    render() {
        return (
            <div className="s-headline-on-drill">
                <div className="s-headline" style={{ display: "flex" }}>
                    <style jsx>
                        {`
                            .column {
                                flex: "1 1 50%";
                            }
                        `}
                    </style>
                    <div className="column">
                        <Headline
                            projectId={projectId}
                            primaryMeasure={primaryMeasure}
                            secondaryMeasure={secondaryMeasure}
                            onLoadingChanged={this.onLoadingChanged}
                            onError={this.onError}
                            onDrill={this.onDrill}
                            drillableItems={[
                                {
                                    identifier: franchiseFeesIdentifier,
                                },
                            ]}
                        />
                    </div>
                </div>
                {this.renderDrillEvent()}
            </div>
        );
    }
}

export default HeadlineOnDrillExample;
