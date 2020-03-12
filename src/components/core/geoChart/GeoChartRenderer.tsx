// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import get = require("lodash/get");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";

import {
    createClusterLabels,
    createClusterPoints,
    createPushpinDataLayer,
    createUnclusterPoints,
    createPushpinFilter,
} from "./geoChartDataLayers";
import { createPushpinDataSource } from "./geoChartDataSource";
import {
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LAYER_NAME,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_TOOLTIP_OPTIONS,
    INTERACTION_EVENTS,
} from "../../../constants/geoChart";
import { IGeoConfig, IGeoData, IGeoLngLat } from "../../../interfaces/GeoChart";

import "../../../../styles/scss/geoChart.scss";
import { handlePushpinMouseEnter, handlePushpinMouseLeave } from "./geoChartTooltip";
import { getViewportOptions } from "../../../helpers/geoChart/viewport";
import { isClusteringAllowed } from "../../../helpers/geoChart/common";

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
    geoData: IGeoData;
    afterRender(): void;
    onCenterPositionChanged(center: IGeoLngLat): void;
    onZoomChanged(zoom: number): void;
}

export default class GeoChartRenderer extends React.Component<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {
            mapboxToken: "",
        },
        afterRender: noop,
        onZoomChanged: noop,
        onCenterPositionChanged: noop,
    };

    private chart: mapboxgl.Map;
    private tooltip: mapboxgl.Popup;
    private chartRef: HTMLElement;
    private navigationControlButton: mapboxgl.NavigationControl;

    public constructor(props: IGeoChartRendererProps) {
        super(props);

        mapboxgl.accessToken = props.config.mapboxToken;
        this.navigationControlButton = new mapboxgl.NavigationControl({
            showCompass: false,
        });
    }

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        const {
            config: { selectedSegmentItems },
        } = this.props;
        const { config: { selectedSegmentItems: prevSelectedSegmentItems = [] } = {} } = prevProps || {};

        this.updateMapWithConfig();

        if (selectedSegmentItems && !isEqual(selectedSegmentItems, prevSelectedSegmentItems)) {
            this.setFilterMap();
        }
    }

    public componentDidMount() {
        this.createTooltip();
        this.createMap();
        this.createMapControls();
        this.handleMapEvent();
    }

    public componentWillUnmount() {
        this.removeMap();
    }

    public setChartRef = (ref: HTMLElement) => {
        this.chartRef = ref;
    };

    public createMap = () => {
        const {
            config,
            geoData: {
                location: { data },
            },
        } = this.props;
        const { isExportMode = false } = config || {};
        const isViewportFreezed = this.isViewportFreezed();

        this.chart = new mapboxgl.Map({
            ...DEFAULT_MAPBOX_OPTIONS,
            ...getViewportOptions(data, config),
            container: this.chartRef,
            // If true, the map’s canvas can be exported to a PNG using map.getCanvas().toDataURL().
            // This is false by default as a performance optimization.
            interactive: !isViewportFreezed,
            preserveDrawingBuffer: isExportMode,
        });
    };

    public render() {
        const {
            config: { isExportMode = false },
        } = this.props;
        const classNames = cx("s-gd-geo-chart-renderer", "mapbox-container", {
            isExportMode,
            "s-isExportMode": isExportMode,
        });
        return <div className={classNames} ref={this.setChartRef} />;
    }

    private updateMapWithConfig = (): void => {
        // Config for clustering and pushpin size lead to change layer setting
        // Then calling resetMap here is needed
        this.resetMap();
        this.updatePanAndZoom();
    };

    private resetMap = (): void => {
        this.cleanupMap();
        this.setupMap();
    };

    private isViewportFreezed = (): boolean => {
        const { config } = this.props;
        return get(config, "viewport.freezed", false);
    };

    private createMapControls = (): void => {
        const isViewportFreezed = this.isViewportFreezed();

        if (!isViewportFreezed) {
            this.chart.addControl(this.navigationControlButton, "bottom-right");
            return;
        }

        if (this.chart.loaded()) {
            this.chart.removeControl(this.navigationControlButton);
        }
    };

    private toggleInteractionEvents = (): void => {
        const isViewportFreezed = this.isViewportFreezed();
        if (!this.chart) {
            return;
        }

        const action = isViewportFreezed ? "disable" : "enable";
        INTERACTION_EVENTS.forEach(
            (interactionEvent: string): void => this.chart[interactionEvent][action](),
        );
    };

    private updatePanAndZoom = (): void => {
        this.createMapControls();
        this.toggleInteractionEvents();
    };

    private setFilterMap = (): void => {
        const {
            config: { selectedSegmentItems },
        } = this.props;

        if (this.chart.getLayer(DEFAULT_LAYER_NAME)) {
            this.chart.setFilter(DEFAULT_LAYER_NAME, createPushpinFilter(selectedSegmentItems));
        }
    };

    private handleMapEvent = () => {
        const { chart, tooltip } = this;
        const {
            config: { separators },
        } = this.props;
        chart.on("load", this.setupMap);
        chart.on("mouseenter", DEFAULT_LAYER_NAME, handlePushpinMouseEnter(chart, tooltip, separators));
        chart.on("mouseleave", DEFAULT_LAYER_NAME, handlePushpinMouseLeave(chart, tooltip));
        chart.on("moveend", this.handlePushpinMoveEnd);
        chart.on("zoomend", this.handlePushpinZoomEnd);
    };

    private setupMap = (): void => {
        const { chart, handleLayerLoaded, props } = this;
        const { config, geoData } = props;
        const { points: { groupNearbyPoints = true } = {} } = config || {};

        // hide city, town, village and hamlet labels
        if (chart.getLayer("settlement-label")) {
            chart.removeLayer("settlement-label");
        }

        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(geoData, config));

        if (!isClusteringAllowed(geoData, groupNearbyPoints)) {
            chart.addLayer(
                createPushpinDataLayer(DEFAULT_DATA_SOURCE_NAME, geoData, config),
                "state-label", // pushpin will be rendered under state/county label
            );
        } else {
            chart.addLayer(createClusterPoints(DEFAULT_DATA_SOURCE_NAME));
            chart.addLayer(createClusterLabels(DEFAULT_DATA_SOURCE_NAME));
            // un-clustered points will be rendered under state/county label
            chart.addLayer(createUnclusterPoints(DEFAULT_DATA_SOURCE_NAME), "state-label");
        }

        // keep listening to the data event until the style is loaded
        chart.on("data", handleLayerLoaded);
    };

    private handleLayerLoaded = () => {
        const { chart } = this;
        if (!chart.isStyleLoaded()) {
            return;
        }

        chart.off("data", this.handleLayerLoaded);

        this.props.afterRender();
    };

    private createTooltip = () => {
        this.tooltip = new mapboxgl.Popup(DEFAULT_TOOLTIP_OPTIONS);
    };

    private cleanupMap = (): void => {
        this.removeLayer(DEFAULT_LAYER_NAME);
        this.removeLayer(DEFAULT_CLUSTER_LAYER_NAME);
        this.removeLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id);
        if (this.chart.getSource(DEFAULT_DATA_SOURCE_NAME)) {
            this.chart.removeSource(DEFAULT_DATA_SOURCE_NAME);
        }
    };

    private removeLayer(layerName: string): void {
        if (this.chart.getLayer(layerName)) {
            this.chart.removeLayer(layerName);
        }
    }

    private removeMap = (): void => {
        if (!this.chart) {
            return;
        }
        this.chart.remove();
    };

    private handlePushpinMoveEnd = (e: mapboxgl.EventData): void => {
        const { target } = e;
        const { onCenterPositionChanged } = this.props;
        const { lng, lat } = target.getCenter();
        const center: IGeoLngLat = { lng, lat };
        onCenterPositionChanged(center);
    };

    private handlePushpinZoomEnd = (e: mapboxgl.EventData): void => {
        const { target } = e;
        const { onZoomChanged } = this.props;
        const zoom: number = target.getZoom();

        onZoomChanged(zoom);
    };
}
