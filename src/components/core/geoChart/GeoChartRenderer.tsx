// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import cx from "classnames";
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";

import {
    createClusterLabels,
    createClusterPoints,
    createPushpinDataLayer,
    createUnclusterPoints,
    createPushpinFilter,
} from "./geoChartDataLayers";
import { createPushpinDataSource, IGeoDataSourceProps } from "./geoChartDataSource";
import {
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LAYER_NAME,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_TOOLTIP_OPTIONS,
    INTERACTION_EVENTS,
    ZOOM_CONTROLS_HEIGHT,
} from "../../../constants/geoChart";
import { IDrillConfig } from "../../../interfaces/DrillEvents";
import { IGeoConfig, IGeoData, IGeoLngLat } from "../../../interfaces/GeoChart";
import { IHeaderPredicate } from "../../../interfaces/HeaderPredicate";

import "../../../../styles/scss/geoChart.scss";
import { handlePushpinMouseEnter, handlePushpinMouseLeave } from "./geoChartTooltip";
import { getViewportOptions } from "../../../helpers/geoChart/viewport";
import {
    isClusteringAllowed,
    isPointsConfigChanged,
    isColorAssignmentItemChanged,
} from "../../../helpers/geoChart/common";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import { handleGeoPushpinDrillEvent } from "../../visualizations/utils/drilldownEventing";

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    drillableItems: IHeaderPredicate[];
    drillConfig: IDrillConfig;
    execution: Execution.IExecutionResponses;
    geoData: IGeoData;
    colorStrategy: IColorStrategy;
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
    }

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        const {
            config: { selectedSegmentItems },
            colorStrategy,
        } = this.props;
        const { config: prevConfig, colorStrategy: prevColorStrategy } = prevProps;
        const { selectedSegmentItems: prevSelectedSegmentItems = [] } = prevConfig || {};

        // reisze map when component is updated
        // for exemple: toggle legend, change position of legend
        this.chart.resize();

        // only update map when style is ready
        // work around for ticket SD-898
        // avoid refresh whole map will be fixed in ticket SD-899
        if (!this.chart.isStyleLoaded()) {
            return;
        }
        const isColorChanged = isColorAssignmentItemChanged(
            prevColorStrategy.getColorAssignment(),
            colorStrategy.getColorAssignment(),
        );
        const selectedSegmentItemsChanged =
            selectedSegmentItems && !isEqual(selectedSegmentItems, prevSelectedSegmentItems);
        if (!isColorChanged && selectedSegmentItemsChanged) {
            return this.setFilterMap();
        }

        this.updateMapWithConfig(prevConfig, prevColorStrategy);
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
        const isViewportFrozen = this.isViewportFrozen();

        this.chart = new mapboxgl.Map({
            ...DEFAULT_MAPBOX_OPTIONS,
            ...getViewportOptions(data, config),
            container: this.chartRef,
            // If true, the map’s canvas can be exported to a PNG using map.getCanvas().toDataURL().
            // This is false by default as a performance optimization.
            interactive: !isViewportFrozen,
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

    private updateMapWithConfig = (prevConfig: IGeoConfig, prevColorStrategy: IColorStrategy): void => {
        if (this.shouldResetMap(prevConfig, prevColorStrategy)) {
            // Config for clustering and pushpin size lead to change layer setting
            // Then calling resetMap here is needed
            this.resetMap();
        }

        this.updatePanAndZoom();
        this.updateViewport(prevConfig);
    };

    private resetMap = (): void => {
        this.cleanupMap();
        this.setupMap();
    };

    private shouldResetMap = (prevConfig: IGeoConfig, prevColorStrategy: IColorStrategy): boolean => {
        const { colorStrategy, config } = this.props;

        if (isPointsConfigChanged(prevConfig.points, config.points)) {
            return true;
        }

        if (
            isColorAssignmentItemChanged(
                prevColorStrategy.getColorAssignment(),
                colorStrategy.getColorAssignment(),
            )
        ) {
            return true;
        }

        return false;
    };

    private isViewportFrozen = (): boolean => {
        const { config } = this.props;
        return get(config, "viewport.frozen", false);
    };

    private createMapControls() {
        const isViewportFrozen = this.isViewportFrozen();

        this.chart.addControl(
            new mapboxgl.AttributionControl({
                compact: true,
            }),
        );

        if (!isViewportFrozen) {
            this.addMapControls();
        }
    }

    private removeMapControls = (): void => {
        if (this.navigationControlButton) {
            this.chart.removeControl(this.navigationControlButton);
            this.navigationControlButton = null;
        }
    };

    private addMapControls = (): void => {
        if (!this.navigationControlButton) {
            this.navigationControlButton = new mapboxgl.NavigationControl({
                showCompass: false,
            });
            this.chart.addControl(this.navigationControlButton, "bottom-right");
        }
    };

    private toggleMapControls = (): void => {
        const isViewportFrozen = this.isViewportFrozen();
        if (!isViewportFrozen) {
            this.addMapControls();
        } else {
            this.removeMapControls();
        }
    };

    private toggleInteractionEvents = (): void => {
        const isViewportFrozen = this.isViewportFrozen();
        if (!this.chart) {
            return;
        }

        const action = isViewportFrozen ? "disable" : "enable";
        INTERACTION_EVENTS.forEach(
            (interactionEvent: string): void => this.chart[interactionEvent][action](),
        );
    };

    private updatePanAndZoom = (): void => {
        this.toggleMapControls();
        this.toggleInteractionEvents();
    };

    private updateViewport = (prevConfig: IGeoConfig): void => {
        const {
            config,
            geoData: {
                location: { data },
            },
        } = this.props;

        const { viewport: prevViewport } = prevConfig;
        const { viewport } = config;
        if (isEqual(prevViewport, viewport)) {
            return;
        }

        const { bounds } = getViewportOptions(data, config);
        if (bounds) {
            this.chart.fitBounds(bounds, DEFAULT_MAPBOX_OPTIONS.fitBoundsOptions);
        }
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
        const { chart } = this;
        chart.on("click", DEFAULT_LAYER_NAME, this.handleMapClick);
        chart.on("load", this.setupMap);
        chart.on("load", this.adjustChartHeight);
        chart.on("mouseenter", DEFAULT_LAYER_NAME, this.handlePushpinMouseEnter);
        chart.on("mouseleave", DEFAULT_LAYER_NAME, this.handlePushpinMouseLeave);
        chart.on("moveend", this.handlePushpinMoveEnd);
        chart.on("zoomend", this.handlePushpinZoomEnd);
    };

    private setupMap = (): void => {
        const { chart, handleLayerLoaded, props } = this;
        const { colorStrategy, config, geoData } = props;
        const { points: { groupNearbyPoints = true } = {} } = config || {};

        const hasClustering: boolean = isClusteringAllowed(geoData, groupNearbyPoints);
        const dataSourceProps: IGeoDataSourceProps = {
            colorStrategy,
            config,
            geoData,
            hasClustering,
        };
        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(dataSourceProps));

        if (!hasClustering) {
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

    private adjustChartHeight = () => {
        const { chart, chartRef } = this;
        if (!chartRef) {
            return;
        }

        const chartHeight: number = chartRef.clientHeight;
        const parentHeight: number = chartRef.parentElement.clientHeight;
        const shouldResize: boolean =
            chartHeight <= ZOOM_CONTROLS_HEIGHT && ZOOM_CONTROLS_HEIGHT <= parentHeight;

        if (shouldResize) {
            // set min height to re-position mapbox attribution and zoom control, in case there are too many top legend items
            // that take all visible height of widget and make geo chart container's height zero
            chartRef.style.minHeight = `${parentHeight}px`;
            chart.resize();
        }
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
        // try catch to hide the mapbox's error message
        // TypeError: Cannot read property 'off' of undefined
        // mapbox is trying to call its function after deleted
        // https://github.com/mapbox/mapbox-gl-js/blob/master/src/ui/control/navigation_control.js#L118
        try {
            this.chart.remove();
        } catch {
            return;
        }
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

    private handleMapClick = (e: mapboxgl.EventData): void => {
        const {
            config: { viewport },
            drillableItems,
            drillConfig,
            execution,
            geoData,
        } = this.props;
        const { features, originalEvent } = e;
        const {
            geometry: { coordinates },
            properties,
        } = features[0];

        // Disable drilling in edit/export mode
        if (get(viewport, "frozen", false)) {
            return;
        }

        // without this, the drill dialog will be closed
        originalEvent.stopPropagation();

        return handleGeoPushpinDrillEvent(
            drillableItems,
            drillConfig,
            execution,
            geoData,
            properties,
            coordinates,
            originalEvent.target,
        );
    };

    private handlePushpinMouseEnter = (e: mapboxgl.EventData): void => {
        const { chart, props, tooltip } = this;
        const { config } = props;
        return handlePushpinMouseEnter(e, chart, tooltip, config);
    };

    private handlePushpinMouseLeave = (e: mapboxgl.EventData): void => {
        const { chart, props, tooltip } = this;
        const { config } = props;
        return handlePushpinMouseLeave(e, chart, tooltip, config);
    };
}
