// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";

import { createClusterLayers, createPushpinDataLayer } from "./geoChartDataLayers";
import { createPushpinDataSource } from "./geoChartDataSource";
import {
    DEFAULT_CLUSTER_LABELS_CONFIG,
    DEFAULT_CLUSTER_LAYER_NAME,
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LATITUDE,
    DEFAULT_LAYER_NAME,
    DEFAULT_LONGITUDE,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_ZOOM,
    DEFAULT_TOOLTIP_OPTIONS,
} from "../../../constants/geoChart";
import { IGeoConfig, IGeoData } from "../../../interfaces/GeoChart";

import "../../../../styles/scss/geoChart.scss";
import { handlePushpinMouseEnter, handlePushpinMouseLeave } from "./geoChartTooltip";
import { getGeoData } from "../../../helpers/geoChart";

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
    afterRender(): void;
}

export default class GeoChartRenderer extends React.PureComponent<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {
            mapboxAccessToken: "",
        },
        afterRender: noop,
    };

    private chart: mapboxgl.Map;
    private tooltip: mapboxgl.Popup;
    private chartRef: HTMLElement;
    private geoData: IGeoData = {};

    public constructor(props: IGeoChartRendererProps) {
        super(props);

        mapboxgl.accessToken = props.config.mapboxAccessToken;
    }

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        if (!isEqual(this.props.execution, prevProps.execution)) {
            if (prevProps.execution) {
                this.cleanupMap();
                this.setupMap();
            } else {
                this.removeMap();
                this.createMap();
            }
        }
        return false;
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
        const { config } = this.props;
        const center = get(config, "center", [DEFAULT_LONGITUDE, DEFAULT_LATITUDE] as [number, number]);
        const zoom = get(config, "zoom", DEFAULT_ZOOM);

        this.chart = new mapboxgl.Map({
            ...DEFAULT_MAPBOX_OPTIONS,
            container: this.chartRef,
            center,
            zoom,
        });
    };

    public render() {
        return <div className="s-gd-geo-chart-renderer" ref={this.setChartRef} />;
    }

    private createMapControls = () => {
        this.chart.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
            }),
            "top-left",
        );
    };

    private handleMapEvent = () => {
        const { chart, tooltip } = this;

        chart.on("load", this.setupMap);
        chart.on("mouseenter", DEFAULT_LAYER_NAME, handlePushpinMouseEnter(chart, tooltip));
        chart.on("mouseleave", DEFAULT_LAYER_NAME, handlePushpinMouseLeave(chart, tooltip));
    };

    private setupMap = (): void => {
        const { chart } = this;
        const {
            execution: { executionResult, executionResponse },
            config: { mdObject: { buckets = [] } = {}, selectedSegmentItem },
        } = this.props;

        // hide city, town, village and hamlet labels
        if (this.chart.getLayer("settlement-label")) {
            this.chart.removeLayer("settlement-label");
        }

        this.geoData = getGeoData(buckets, executionResponse.dimensions);

        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(executionResult, this.geoData));

        if (this.geoData.size) {
            chart.addLayer(
                createPushpinDataLayer(
                    DEFAULT_DATA_SOURCE_NAME,
                    executionResult,
                    this.geoData,
                    selectedSegmentItem,
                ),
                "state-label", // pushpin will be rendered under state/county label
            );
        } else {
            const clusterLayers: mapboxgl.Layer[] = createClusterLayers(DEFAULT_DATA_SOURCE_NAME);
            clusterLayers.forEach(
                (clusterLayer: mapboxgl.Layer) => chart.addLayer(clusterLayer, "state-label"), // cluster points will be rendered under state/county label
            );
        }

        // keep listening to the data event until the style is loaded
        chart.on("data", this.handleLayerLoaded);
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
        this.chart.removeLayer(DEFAULT_LAYER_NAME);
        if (!this.geoData.size) {
            this.chart.removeLayer(DEFAULT_CLUSTER_LAYER_NAME);
            this.chart.removeLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id);
        }
        this.chart.removeSource(DEFAULT_DATA_SOURCE_NAME);
    };

    private removeMap = (): void => {
        if (this.chart) {
            this.chart.remove();
        }
    };
}
