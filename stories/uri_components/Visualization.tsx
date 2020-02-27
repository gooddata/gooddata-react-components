// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AFM } from "@gooddata/typings";
import { screenshotWrap } from "@gooddata/test-storybook";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../utils/ScreenshotReadyWrapper";

import { Visualization, IVisualizationProps } from "../../src/components/uri/Visualization";
import { CUSTOM_COLORS } from "../data/colors";
import { onErrorHandler } from "../mocks";
import "../../styles/scss/charts.scss";
import "../../styles/scss/table.scss";
import { GERMAN_SEPARATORS } from "../data/numberFormat";

const afterRender = () => {
    // tslint:disable-next-line:no-console
    console.log("GDC_GEO_CANVAS_READY");
};

const defaultFilter: AFM.IAbsoluteDateFilter = {
    absoluteDateFilter: {
        dataSet: {
            uri: "/gdc/md/storybook/obj/123",
        },
        from: "2017-01-01",
        to: "2017-12-31",
    },
};

class DynamicVisualization extends React.Component<any, any> {
    private initialProps: IVisualizationProps = {
        projectId: "storybook",
        uri: "/gdc/md/storybook/obj/1001",
        config: { colors: CUSTOM_COLORS },
        filters: [defaultFilter],
    };

    private alternativeProps: IVisualizationProps = {
        projectId: "storybook",
        uri: "/gdc/md/storybook/obj/1002",
        config: {},
        filters: [],
    };

    constructor(nextProps: IVisualizationProps) {
        super(nextProps);
        this.state = this.initialProps;
    }

    public render() {
        return (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
                <div>
                    <button onClick={this.toggle.bind(this, "uri")}>toggle uri</button>
                    <button onClick={this.toggle.bind(this, "filters")}>toggle filter</button>
                    <button onClick={this.toggle.bind(this, "config")}>toggle config</button>
                </div>
                <Visualization
                    key="dynamic-test-vis"
                    onLoadingChanged={this.onLoadingChanged}
                    onError={onErrorHandler}
                    projectId={this.state.projectId}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    {...this.state}
                />
                {this.state.isLoading ? (
                    <div
                        className="gd-spinner large"
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            margin: "-16px 0 0 -16px",
                        }}
                    />
                ) : null}
            </div>
        );
    }

    private toggle(prop: string) {
        this.setState({
            [prop]:
                this.state[prop] === this.initialProps[prop]
                    ? this.alternativeProps[prop]
                    : this.initialProps[prop],
        });
    }

    private onLoadingChanged = ({ isLoading }: { isLoading: boolean }) => {
        this.setState({ isLoading });
    };
}

storiesOf("URI components", module)
    .add("table example", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1001"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("table example - experimental execution", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1001"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    experimentalVisExecution={true}
                />
            </div>,
        ),
    )
    .add("table example with identifier", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="1001"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("table with eventing", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1001"}
                    drillableItems={[{ identifier: "1" }, { identifier: "3" }]}
                    onFiredDrillEvent={action("drill-event fired")}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("table resizable", () =>
        screenshotWrap(
            <div
                style={{
                    width: 800,
                    height: 400,
                    padding: 10,
                    border: "solid 1px #000000",
                    resize: "both",
                    overflow: "auto",
                }}
            >
                <Visualization
                    projectId="storybook"
                    identifier="1001"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("table with German number format", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1001"}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("table with feature flag resizing", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={{ width: 800, height: 400 }}>
                    <Visualization
                        projectId="resizingstorybook"
                        uri={"/gdc/md/resizingstorybook/obj/1001"}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("chart with PoP measures", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1003"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with arithmetic measures", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1008"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with disabled gridline", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1007"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with X and Y axis name aligned to left and top respectively", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/aligned-axis-name"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with previous period measures", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1006"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart example", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart example - experimental execution", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    experimentalVisExecution={true}
                />
            </div>,
        ),
    )
    .add("custom color palette in style settings", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="colorstorybook"
                    uri={"/gdc/md/colorstorybook/obj/1007"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart example with German format number", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart example with custom legend", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    config={{
                        legend: {
                            enabled: false,
                        },
                    }}
                    onLegendReady={action("onLegendReady")} // NOTE: onClick is not shown in action logger
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with overriden config", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1003"}
                    onError={onErrorHandler}
                    locale="en-US"
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("chart with applied filter and custom colors", () => {
        const filter: AFM.IAbsoluteDateFilter = {
            absoluteDateFilter: {
                dataSet: {
                    uri: "/gdc/md/storybook/obj/123",
                },
                from: "2017-01-01",
                to: "2017-12-31",
            },
        };

        return screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    filters={[filter]}
                    config={{ colors: CUSTOM_COLORS }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        );
    })
    .add("chart with eventing", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1002"}
                    drillableItems={[{ identifier: "1" }, { identifier: "2" }]}
                    onFiredDrillEvent={action("drill-event fired")}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("GeoPushpinChart example", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400, position: "relative" }}>
                <Visualization
                    projectId="storybook"
                    identifier="pushpin-chart-location-size-color-segment-tooltip"
                    config={{
                        mapboxToken: process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
                        center: [-94.60376, 38.573936],
                        zoom: 3.3,
                    }}
                    afterRender={afterRender}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("headline", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1004"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("headline with drillableItems", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1004"}
                    drillableItems={[{ uri: "/gdc/md/storybook/obj/1" }]}
                    onFiredDrillEvent={action("onFiredDrillEvent")}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("headline with drillableItems disableDrillUnderline", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1004"}
                    drillableItems={[{ uri: "/gdc/md/storybook/obj/1" }]}
                    onFiredDrillEvent={action("onFiredDrillEvent")}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    // tslint:disable-next-line:jsx-no-lambda
                    getFeatureFlags={async () => {
                        return { disableKpiDashboardHeadlineUnderline: true };
                    }}
                />
            </div>,
        ),
    )
    .add("headline with German number format", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1004"}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("dynamic visualization test", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <DynamicVisualization />
            </div>,
        ),
    )
    .add("error", () => (
        <div style={{ width: 800, height: 400 }}>
            <Visualization
                projectId="storybook"
                uri={"/gdc/md/storybook/obj/1005"}
                onError={onErrorHandler}
                LoadingComponent={null}
            />
        </div>
    ))
    .add("Combo chart", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri={"/gdc/md/storybook/obj/1011"}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    config={{
                        dualAxis: false,
                    }}
                />
            </div>,
        ),
    )
    .add("Combo chart with identifier", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="1011"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    config={{
                        dualAxis: false,
                    }}
                />
            </div>,
        ),
    )
    .add("Combo chart with custom chart type", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="1011"
                    config={{
                        primaryChartType: "line",
                        secondaryChartType: "area",
                        dualAxis: false,
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                />
            </div>,
        ),
    )
    .add("Multiple visualizations - sdk caching", () => (
        <div>
            <div style={{ width: 800, height: 400 }}>
                <Visualization projectId="storybook" uri={"/gdc/md/storybook/obj/1001"} />
            </div>
            <div style={{ width: 800, height: 400 }}>
                <Visualization projectId="storybook" uri={"/gdc/md/storybook/obj/1001"} />
            </div>
            <div style={{ width: 800, height: 400 }}>
                <Visualization projectId="storybook" uri={"/gdc/md/storybook/obj/1002"} />
            </div>
            <div style={{ width: 800, height: 400 }}>
                <Visualization projectId="storybook" uri={"/gdc/md/storybook/obj/1003"} />
            </div>
            <div style={{ width: 800, height: 400 }}>
                <Visualization projectId="storybook" uri={"/gdc/md/storybook/obj/1002"} />
            </div>
        </div>
    ))
    .add("Table with measure value filter in visualization object and one additional in filter prop", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="measure-value-filters"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    filters={[
                        {
                            measureValueFilter: {
                                measure: {
                                    localIdentifier: "m2",
                                },
                                condition: {
                                    comparison: {
                                        operator: "GREATER_THAN",
                                        value: 500,
                                    },
                                },
                            },
                        },
                    ]}
                />
            </div>,
        ),
    )
    .add("xirr", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="xirr-simple"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("xirr with drillableItems", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="xirr-simple"
                    drillableItems={[{ uri: "/gdc/md/storybook/obj/5" }]}
                    onFiredDrillEvent={action("onFiredDrillEvent")}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("Bullet chart with primary, target and comparative measures, viewed by one attribute", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="bullet-chart-2M-1VB"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    // bar chart default sort
    .add("Bar chart with 2M and 1VB will be sorted by first measure", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    uri="/gdc/md/storybook/obj/1007"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("Bar chart with 2M, 1VB and stackMeasures is true will be sorted by total values", () =>
        screenshotWrap(
            <div style={{ width: 800, height: 400 }}>
                <Visualization
                    projectId="storybook"
                    identifier="bar-chart-2M-1VB-stackMeasures"
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add(
        "Bar chart with 2M, 2VB and stackMeasures is true will be sorted by size of the group, then size of each member of the group",
        () =>
            screenshotWrap(
                <div style={{ width: 800, height: 400 }}>
                    <Visualization
                        projectId="storybook"
                        identifier="bar-chart-2M-2VB-stackMeasures"
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>,
            ),
    )
    .add(
        "Bar chart with 1M, 2VB and 1SB will be sorted by size of the group, then size of each member of the group",
        () =>
            screenshotWrap(
                <div style={{ width: 800, height: 400 }}>
                    <Visualization
                        projectId="storybook"
                        identifier="bar-chart-1M-2VB-1SB"
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>,
            ),
    )
    .add(
        "Bar chart with 2M and 2VB will be sorted by size of the group, then first measure of each member of the group",
        () =>
            screenshotWrap(
                <div style={{ width: 800, height: 400 }}>
                    <Visualization
                        projectId="storybook"
                        identifier="bar-chart-2M-2VB"
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>,
            ),
    );
