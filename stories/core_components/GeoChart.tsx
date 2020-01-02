// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { GeoChart } from "../../src";
import { onErrorHandler } from "../mocks";
import {
    ATTRIBUTE_LOCATION_GEOCHART,
    MEASURE_SIZE_GEOCHART,
    MEASURE_COLOR_GEOCHART,
    ATTRIBUTE_SEGMENT_GEOCHART,
    ATTRIBUTE_TOOLTIP_GEOCHART,
} from "../data/geoChartComponentProps";

const wrapperStyle = { width: 800, height: 500 };

storiesOf("Core components/GeoChart", module)
    .add("with location, color", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <GeoChart
                    projectId="storybook"
                    location={ATTRIBUTE_LOCATION_GEOCHART}
                    color={MEASURE_COLOR_GEOCHART}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("with location, size, color, segmentBy, tooltipText", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <GeoChart
                    projectId="storybook"
                    location={ATTRIBUTE_LOCATION_GEOCHART}
                    size={MEASURE_SIZE_GEOCHART}
                    color={MEASURE_COLOR_GEOCHART}
                    segmentBy={ATTRIBUTE_SEGMENT_GEOCHART}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                    config={{
                        tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
                    }}
                />
            </div>,
        ),
    );
