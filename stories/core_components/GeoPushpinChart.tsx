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
} from "../data/geoChartComponentProps";

const wrapperStyle: React.CSSProperties = { width: 900, height: 600, position: "relative" };

const DEFAULT_CONFIG: IGeoConfig = {
    center: [-94.60376, 38.573936],
    zoom: 3.3,
    mapboxAccessToken: process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
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
                LoadingComponent={null}
                ErrorComponent={null}
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
                    "/gdc/md/projectId/obj/694/elements?id=1808",
                    "/gdc/md/projectId/obj/694/elements?id=1903",
                    "/gdc/md/projectId/obj/694/elements?id=1870",
                    "/gdc/md/projectId/obj/694/elements?id=1895",
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
    });
