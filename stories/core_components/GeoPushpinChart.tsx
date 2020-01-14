// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { VisualizationInput } from "@gooddata/typings";
import { screenshotWrap } from "@gooddata/test-storybook";

import { IGeoConfig } from "../../src/interfaces/GeoChart";
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
const DEFAULT_CONFIG: Partial<IGeoConfig> = {
    center: [-94.60376, 38.573936],
    zoom: 3.3,
};

function renderGeoPushpinChart(props: any = {}): React.ReactElement {
    const { location, size, color, segmentBy, config, filters } = props;
    return screenshotWrap(
        <div style={wrapperStyle}>
            <GeoPushpinChart
                projectId="storybook"
                location={location}
                size={size}
                color={color}
                segmentBy={segmentBy}
                config={{
                    ...DEFAULT_CONFIG,
                    ...config,
                }}
                filters={filters}
                onError={onErrorHandler}
                LoadingComponent={null}
                ErrorComponent={null}
            />
        </div>,
    );
}

storiesOf("Core components/GeoPushpinChart", module)
    .add("with location", () => renderGeoPushpinChart({ location: ATTRIBUTE_LOCATION_GEOCHART }))
    .add("with location, size", () =>
        renderGeoPushpinChart({ location: ATTRIBUTE_LOCATION_GEOCHART, size: MEASURE_SIZE_GEOCHART }),
    )
    .add("with location and color", () =>
        renderGeoPushpinChart({ location: ATTRIBUTE_LOCATION_GEOCHART, color: MEASURE_COLOR_GEOCHART }),
    )
    .add("with location, size and color", () =>
        renderGeoPushpinChart({
            location: ATTRIBUTE_LOCATION_GEOCHART,
            size: MEASURE_SIZE_GEOCHART,
            color: MEASURE_COLOR_GEOCHART,
        }),
    )
    .add("with location, size, color, segmentBy and tooltipText", () => {
        const config: IGeoConfig = {
            tooltipText: ATTRIBUTE_TOOLTIP_GEOCHART,
        };
        return renderGeoPushpinChart({
            location: ATTRIBUTE_LOCATION_GEOCHART,
            size: MEASURE_SIZE_GEOCHART,
            color: MEASURE_COLOR_GEOCHART,
            segmentBy: ATTRIBUTE_SEGMENT_GEOCHART,
            config,
        });
    })
    .add("with location, size, color, segmentBy, tooltipText and location filter", () => {
        const config: IGeoConfig = {
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
        return renderGeoPushpinChart({
            location: ATTRIBUTE_LOCATION_GEOCHART,
            size: MEASURE_SIZE_GEOCHART,
            color: MEASURE_COLOR_GEOCHART,
            segmentBy: ATTRIBUTE_SEGMENT_GEOCHART,
            config,
            filters: [locationFilter],
        });
    });
