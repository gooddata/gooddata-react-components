// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Execution, VisualizationObject } from "@gooddata/typings";
import { GeoChart, IGeoChartInnerProps } from "../../src/components/core/GeoChart";
import { createIntlMock } from "../../src/components/visualizations/utils/intlUtils";
import { COLOR, LOCATION, SEGMENT_BY, SIZE, TOOLTIP_TEXT } from "../../src/constants/geoChart";
import { IGeoConfig } from "../../src/interfaces/GeoChart";
import { getExecutionResult } from "../data/geoChart";

const wrapperStyle: React.CSSProperties = { width: 900, height: 600, position: "relative" };
const DEFAULT_PROPS: Partial<IGeoChartInnerProps> = {
    intl: createIntlMock(),
    isLoading: false,
    projectId: "storybook",
};
const DEFAULT_CONFIG: Partial<IGeoConfig> = {
    center: [-94.60376, 38.573936],
    zoom: 3.3,
};

const LOCATION_ITEM: VisualizationObject.IBucket = {
    localIdentifier: LOCATION,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_location",
                displayForm: {
                    uri: "/gdc/md/projectId/obj/1",
                },
            },
        },
    ],
};

const SEGMENT_BY_ITEM: VisualizationObject.IBucket = {
    localIdentifier: SEGMENT_BY,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_segmentBy",
                displayForm: {
                    uri: "/gdc/md/projectId/obj/2",
                },
            },
        },
    ],
};

const TOOLTIP_TEXT_ITEM: VisualizationObject.IBucket = {
    localIdentifier: TOOLTIP_TEXT,
    items: [
        {
            visualizationAttribute: {
                localIdentifier: "a_tooltipText",
                displayForm: {
                    uri: "/gdc/md/projectId/obj/3",
                },
            },
        },
    ],
};

const SIZE_ITEM: VisualizationObject.IBucket = {
    localIdentifier: SIZE,
    items: [
        {
            measure: {
                localIdentifier: "m_size",
                definition: {
                    measureDefinition: {
                        item: { uri: "/gdc/md/projectId/obj/4" },
                    },
                },
            },
        },
    ],
};

const COLOR_ITEM: VisualizationObject.IBucket = {
    localIdentifier: COLOR,
    items: [
        {
            measure: {
                localIdentifier: "m_color",
                definition: {
                    measureDefinition: {
                        item: { uri: "/gdc/md/projectId/obj/5" },
                    },
                },
            },
        },
    ],
};

function getExecution(
    isWithLocation = false,
    isWithSegmentBy = false,
    isWithTooltipText = false,
    isWithSize = false,
    isWithColor = false,
): Execution.IExecutionResponses {
    return {
        executionResponse: undefined,
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

function renderChart(config: IGeoConfig, execution: Execution.IExecutionResponses): React.ReactElement {
    return screenshotWrap(
        <div style={wrapperStyle}>
            <GeoChart
                config={{
                    ...DEFAULT_CONFIG,
                    ...config,
                }}
                {...DEFAULT_PROPS}
                execution={execution}
                getPage={getPageWithExecution(execution)}
            />
        </div>,
    );
}

storiesOf("Core components/GeoChart", module)
    .add("with location", () => {
        const execution = getExecution(true);
        const config: IGeoConfig = {
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM],
            },
        };
        return renderChart(config, execution);
    })
    .add("with location and size", () => {
        const execution = getExecution(true, false, true, true, false);
        const config: IGeoConfig = {
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM],
            },
        };
        return renderChart(config, execution);
    })
    .add("with location and color", () => {
        const execution = getExecution(true, false, true, false, true);
        const config: IGeoConfig = {
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, COLOR_ITEM],
            },
        };
        return renderChart(config, execution);
    })
    .add("with location, size and color", () => {
        const execution = getExecution(true, false, true, true, true);
        const config: IGeoConfig = {
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM, COLOR_ITEM],
            },
        };
        return renderChart(config, execution);
    })
    .add("with location, size, color and segment", () => {
        const execution = getExecution(true, true, true, true, true);
        const config: IGeoConfig = {
            mdObject: {
                visualizationClass: {
                    uri: "any_vis_class",
                },
                buckets: [LOCATION_ITEM, SEGMENT_BY_ITEM, TOOLTIP_TEXT_ITEM, SIZE_ITEM, COLOR_ITEM],
            },
        };
        return renderChart(config, execution);
    });
