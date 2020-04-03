// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { VisualizationInput } from "@gooddata/typings";
import { screenshotWrap } from "@gooddata/test-storybook";

import { IGeoConfig, IGeoPushpinChartProps } from "../../src/interfaces/GeoChart";
import { GeoPushpinChart } from "../../src";
import { onErrorHandler } from "../mocks";
import {
    ATTRIBUTE_LOCATION_GEOCHART,
    MEASURE_SIZE_GEOCHART,
    MEASURE_COLOR_GEOCHART,
    ATTRIBUTE_SEGMENT_GEOCHART,
    ATTRIBUTE_TOOLTIP_GEOCHART,
    ATTRIBUTE_SEGMENT_GEOCHART_ALIAS,
    MEASURE_COLOR_GEOCHART_ALIAS,
} from "../data/geoChartComponentProps";

const wrapperStyle: React.CSSProperties = { width: 900, height: 600, position: "relative" };

const DEFAULT_CONFIG: IGeoConfig = {
    mapboxToken: process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
};

const afterRender = () => console.log("GDC_GEO_CANVAS_READY"); // tslint:disable-line:no-console

function renderGeoPushpinChart(props: IGeoPushpinChartProps): React.ReactElement {
    const { projectId, location, size, color, segmentBy, config, filters } = props;
    return (
        <div style={wrapperStyle}>
            <GeoPushpinChart
                projectId={projectId}
                location={location}
                size={size}
                color={color}
                segmentBy={segmentBy}
                filters={filters}
                config={config}
                onError={onErrorHandler}
                afterRender={afterRender}
            />
        </div>
    );
}

storiesOf("Core components/GeoPushpinChart", module)
    .add("with location", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config: DEFAULT_CONFIG,
            }),
        ),
    )
    .add("with location and show unclustered pins", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config: {
                    ...DEFAULT_CONFIG,
                    center: {
                        lat: 36.800486,
                        lng: -94.922363,
                    },
                    zoom: 6,
                },
            }),
        ),
    )
    .add("with location and size", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                config: DEFAULT_CONFIG,
            }),
        ),
    )
    .add("with location, size and segmentBy", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                segmentBy: ATTRIBUTE_SEGMENT_GEOCHART,
                config: DEFAULT_CONFIG,
            }),
        ),
    )
    .add("with location and color", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                color: MEASURE_COLOR_GEOCHART,
                config: DEFAULT_CONFIG,
            }),
        ),
    )
    .add("with location, size and color", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                color: MEASURE_COLOR_GEOCHART,
                config: DEFAULT_CONFIG,
            }),
        ),
    )
    .add("with location and size, color contains same values", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                color: MEASURE_COLOR_GEOCHART,
                config,
            }),
        );
    })
    .add("with location, size, color, segmentBy and tooltipText", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                color: MEASURE_COLOR_GEOCHART,
                segmentBy: ATTRIBUTE_SEGMENT_GEOCHART,
                config,
            }),
        );
    })
    .add("with location, size, color, segmentBy, tooltipText and location filter", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
        };
        const locationFilter: VisualizationInput.IPositiveAttributeFilter = {
            positiveAttributeFilter: {
                displayForm: {
                    uri: "/gdc/md/storybook/obj/30.df",
                },
                in: [
                    "/gdc/md/storybook/obj/694/elements?id=1808",
                    "/gdc/md/storybook/obj/694/elements?id=1903",
                    "/gdc/md/storybook/obj/694/elements?id=1870",
                    "/gdc/md/storybook/obj/694/elements?id=1895",
                    "/gdc/md/storybook/obj/694/elements?id=1844",
                ],
            },
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                color: MEASURE_COLOR_GEOCHART,
                segmentBy: ATTRIBUTE_SEGMENT_GEOCHART,
                filters: [locationFilter],
                config,
            }),
        );
    })
    .add("with North America viewport", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config: {
                    ...DEFAULT_CONFIG,
                    viewport: {
                        area: "continent_na",
                    },
                },
            }),
        ),
    )
    .add("with World viewport", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config: {
                    ...DEFAULT_CONFIG,
                    viewport: {
                        area: "world",
                    },
                },
            }),
        ),
    )
    .add("with Include all data viewport", () =>
        screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config: {
                    ...DEFAULT_CONFIG,
                    viewport: {
                        area: "auto",
                    },
                },
            }),
        ),
    )
    .add("with disabled interactive and zoom control button", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            viewport: {
                frozen: true,
            },
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config,
            }),
        );
    })
    .add("with color and segment alias shown in tooltip", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                color: MEASURE_COLOR_GEOCHART_ALIAS,
                segmentBy: ATTRIBUTE_SEGMENT_GEOCHART_ALIAS,
                config,
            }),
        );
    })
    .add("with disabled groupNearbyPoints", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            points: {
                groupNearbyPoints: false,
            },
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config,
            }),
        );
    })
    .add("with enabled groupNearbyPoints", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            points: {
                groupNearbyPoints: true,
            },
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                config,
            }),
        );
    })
    .add("with config point size", () => {
        const config: IGeoConfig = {
            ...DEFAULT_CONFIG,
            points: {
                minSize: "0.5x",
                maxSize: "1.5x",
            },
        };
        return screenshotWrap(
            renderGeoPushpinChart({
                projectId: "storybook",
                location: ATTRIBUTE_LOCATION_GEOCHART,
                size: MEASURE_SIZE_GEOCHART,
                config,
            }),
        );
    });
