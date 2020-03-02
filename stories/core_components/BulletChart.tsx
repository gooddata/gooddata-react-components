// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { BulletChart, HeaderPredicateFactory } from "../../src";
import { onErrorHandler } from "../mocks";
import { CUSTOM_COLORS } from "../data/colors";
import {
    ATTRIBUTE_1,
    ATTRIBUTE_2,
    MEASURE_1,
    MEASURE_1_WITH_ALIAS,
    MEASURE_2,
    ATTRIBUTE_1_SORT_ITEM,
    MEASURE_2_SORT_ITEM,
    MEASURE_3,
} from "../data/componentProps";
import { GERMAN_SEPARATORS } from "../data/numberFormat";
import { CUSTOM_COLOR_PALETTE_CONFIG } from "../data/configProps";
import { Execution } from "@gooddata/typings";
import { RGBType } from "@gooddata/gooddata-js";

const wrapperStyle = { width: 800, height: 400 };

storiesOf("Core components/BulletChart", module)
    .add("primary measure", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary and target measures", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary, target and comparative measures", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary and comparative measures", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    comparativeMeasure={MEASURE_3}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary measure, one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary and target measures, one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary, target and comparative measures, one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary and comparative measures, one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary, target and comparative measures with two attributes", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("primary measure with alias", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1_WITH_ALIAS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("custom colors by palette", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_2]}
                    config={CUSTOM_COLOR_PALETTE_CONFIG}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("custom colors by colors", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_2]}
                    config={{ colors: CUSTOM_COLORS }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("when both color props, prefer palette", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_2]}
                    config={{
                        ...CUSTOM_COLOR_PALETTE_CONFIG,
                        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)"],
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("sorted by attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    sortBy={[ATTRIBUTE_1_SORT_ITEM]}
                />
            </div>,
        ),
    )
    .add("sorted by measure", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_2}
                    targetMeasure={MEASURE_1}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    sortBy={[MEASURE_2_SORT_ITEM]}
                />
            </div>,
        ),
    )
    .add("with German number format", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    config={GERMAN_SEPARATORS}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("with min max config", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={{
                        xaxis: {
                            min: "100",
                            max: "600",
                        },
                    }}
                />
            </div>,
        ),
    )
    .add("color mapping", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={{
                        ...CUSTOM_COLOR_PALETTE_CONFIG,
                        colorMapping: [
                            {
                                predicate: (headerItem: Execution.IMeasureHeaderItem) =>
                                    headerItem.measureHeaderItem &&
                                    headerItem.measureHeaderItem.localIdentifier === "m1",
                                color: {
                                    type: "rgb" as RGBType,
                                    value: {
                                        r: 255,
                                        g: 128,
                                        b: 0,
                                    },
                                },
                            },
                        ],
                    }}
                />
            </div>,
        ),
    )
    .add("rotation setting on Y axis", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    config={{
                        yaxis: {
                            rotation: "60",
                        },
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("hidden X axis", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    config={{
                        xaxis: {
                            visible: false,
                        },
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("hidden Y axis", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_1, ATTRIBUTE_2]}
                    config={{
                        yaxis: {
                            visible: false,
                        },
                    }}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("drillable items", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    primaryMeasure={MEASURE_1}
                    targetMeasure={MEASURE_2}
                    comparativeMeasure={MEASURE_3}
                    viewBy={[ATTRIBUTE_2, ATTRIBUTE_1]}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    drillableItems={[
                        HeaderPredicateFactory.uriMatch("/gdc/md/storybook/obj/1"),
                        HeaderPredicateFactory.uriMatch("/gdc/md/storybook/obj/2"),
                        HeaderPredicateFactory.uriMatch("/gdc/md/storybook/obj/5/"),
                    ]}
                />
            </div>,
        ),
    );
