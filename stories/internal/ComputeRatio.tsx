// (C) 2019 GoodData Corporation
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { createHighChartResolver, ScreenshotReadyWrapper } from "../utils/ScreenshotReadyWrapper";
import * as React from "react";
import { AreaChart, BarChart, ColumnChart, ComboChart } from "../../src";
import { ATTRIBUTE_1 } from "../data/componentProps";
import { measure } from "../../src/helpers/model";

const wrapperStyle = { width: 800, height: 400 };

// create new measure in every component to make sure it's not changed
const MEASURE_1_RATIO = () =>
    measure("/gdc/md/storybook/obj/1")
        .localIdentifier("m1")
        .ratio();

const MEASURE_2 = () => measure("/gdc/md/storybook/obj/2").localIdentifier("m2");

const MEASURE_2_RATIO = () => MEASURE_2().ratio();

const MEASURE_3 = () => measure("/gdc/md/storybook/obj/3").localIdentifier("m3");

storiesOf("Internal/ComputeRatio", module)
    .add("ignore percent format with multiple measures", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={createHighChartResolver(4)}>
                <div>
                    <div className="storybook-title">Column Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ColumnChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Bar Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <BarChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Area Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <AreaChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Combo Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ComboChart
                            projectId="storybook"
                            primaryMeasures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            secondaryMeasures={[MEASURE_2_RATIO(), MEASURE_3()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                secondaryChartType: "column",
                            }}
                        />
                    </div>
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("ignore stackMeasuresToPercent with one measure and computeRatio configured", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={createHighChartResolver(4)}>
                <div>
                    <div className="storybook-title">Column Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ColumnChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Bar Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <BarChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Area Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <AreaChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Combo Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ComboChart
                            projectId="storybook"
                            primaryMeasures={[MEASURE_1_RATIO()]}
                            secondaryMeasures={[MEASURE_2_RATIO()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("apply stackMeasuresToPercent and ignore computeRatio with multiple measures", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={createHighChartResolver(4)}>
                <div>
                    <div className="storybook-title">Column Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ColumnChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Bar Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <BarChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Area Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <AreaChart
                            projectId="storybook"
                            measures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="storybook-title">Combo Chart</div>
                    <div className="screenshot-container" style={wrapperStyle}>
                        <ComboChart
                            projectId="storybook"
                            primaryMeasures={[MEASURE_1_RATIO(), MEASURE_2()]}
                            secondaryMeasures={[MEASURE_3()]}
                            viewBy={ATTRIBUTE_1}
                            config={{
                                stackMeasuresToPercent: true,
                            }}
                        />
                    </div>
                </div>
            </ScreenshotReadyWrapper>,
        ),
    );
