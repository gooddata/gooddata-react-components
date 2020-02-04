// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Execution } from "@gooddata/typings";
import { GeoChartInner } from "../../src/components/core/GeoChart";
import { createIntlMock } from "../../src/components/visualizations/utils/intlUtils";
import { IGeoConfig } from "../../src/interfaces/GeoChart";
import { getExecutionResponse, getExecutionResult } from "../data/geoChart";
import {
    COLOR_ITEM,
    LOCATION_ITEM,
    SEGMENT_BY_ITEM,
    SIZE_ITEM,
    TOOLTIP_TEXT_ITEM,
} from "../../src/helpers/tests/geoChart/data";

const wrapperStyle: React.CSSProperties = { width: 900, height: 600, position: "relative" };
const DEFAULT_CONFIG: IGeoConfig = {
    center: [-94.60376, 38.573936],
    zoom: 3.3,
    mapboxAccessToken: process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
};

function getExecution(
    isWithLocation = false,
    isWithSegmentBy = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
): Execution.IExecutionResponses {
    return {
        executionResponse: getExecutionResponse(
            isWithLocation,
            isWithSegmentBy,
            isWithTooltipText,
            isWithSize,
            isWithColor,
        ),
        executionResult: getExecutionResult(
            isWithLocation,
            isWithSegmentBy,
            isWithTooltipText,
            isWithSize,
            isWithColor,
        ),
    };
}

function getPageWithExecution(execution: Execution.IExecutionResponses) {
    return () => Promise.resolve(execution);
}

const dataLarge = () => {
    action("Data too large");
};

const afterRender = () => console.log("GDC_GEO_CANVAS_READY"); // tslint:disable-line:no-console

const intl = createIntlMock();

function renderChart(config: IGeoConfig, execution: Execution.IExecutionResponses): React.ReactElement {
    return (
        <div style={wrapperStyle}>
            <GeoChartInner
                projectId="storybook"
                execution={execution}
                getPage={getPageWithExecution(execution)}
                onDataTooLarge={dataLarge}
                afterRender={afterRender}
                intl={intl}
                isLoading={false}
                config={config}
            />
        </div>
    );
}

storiesOf("Core components/GeoChartInner", module)
    .add("with location", () => {
        const execution = getExecution(true);
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM],
            },
        };
        return screenshotWrap(renderChart(config, execution));
    })
    .add("with location and size", () => {
        const execution = getExecution(true, false, true, true, false);
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM],
            },
        };
        return screenshotWrap(renderChart(config, execution));
    })
    .add("with location and color", () => {
        const execution = getExecution(true, false, true, false, true);
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, COLOR_ITEM],
            },
        };
        return screenshotWrap(renderChart(config, execution));
    })
    .add("with location, size and color", () => {
        const execution = getExecution(true, false, true, true, true);
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM, COLOR_ITEM],
            },
        };
        return screenshotWrap(renderChart(config, execution));
    })
    .add("with location, size, color and segmentBy", () => {
        const execution = getExecution(true, true, true, true, true);
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, SEGMENT_BY_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM, COLOR_ITEM],
            },
        };
        return screenshotWrap(renderChart(config, execution));
    });
