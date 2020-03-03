// (C) 2007-2020 GoodData Corporation
import * as React from "react";
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
import { isClusteringAllowed } from "../../../helpers/geoChart/common";

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
    geoData: IGeoData;
    afterRender(): void;
}

export default class GeoChartRenderer extends React.Component<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {
            mapboxToken: "",
        },
        afterRender: noop,
    };

    private chart: mapboxgl.Map;
    private tooltip: mapboxgl.Popup;
    private chartRef: HTMLElement;

    public constructor(props: IGeoChartRendererProps) {
        super(props);

        mapboxgl.accessToken = props.config.mapboxToken;
    }

    public componentDidUpdate(prevProps: IGeoChartRendererProps) {
        if (!this.props.execution) {
            return;
        }
        const {
            execution: { executionResponse },
            config: { selectedSegmentItems },
        } = this.props;
        const {
            execution: { executionResponse: prevExecutionResponse = {} } = {},
            config: { selectedSegmentItems: prevSelectedSegmentItems = [] } = {},
        } = prevProps || {};

        if (!isEqual(executionResponse, prevExecutionResponse)) {
            if (prevExecutionResponse) {
                this.cleanupMap();
                this.setupMap();
            } else {
                this.removeMap();
                this.createMap();
            }
        } else if (!isEqual(selectedSegmentItems, prevSelectedSegmentItems)) {
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
            "bottom-right",
        );
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
    };

    private setupMap = (): void => {
        const { chart } = this;
        const {
            config: { selectedSegmentItems },
            geoData,
        } = this.props;

        // hide city, town, village and hamlet labels
        if (this.chart.getLayer("settlement-label")) {
            this.chart.removeLayer("settlement-label");
        }

        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(geoData));

        if (!isClusteringAllowed(geoData)) {
            chart.addLayer(
                createPushpinDataLayer(DEFAULT_DATA_SOURCE_NAME, geoData, selectedSegmentItems),
                "state-label", // pushpin will be rendered under state/county label
            );
        } else {
            chart.addLayer(createClusterPoints(DEFAULT_DATA_SOURCE_NAME));
            chart.addLayer(createClusterLabels(DEFAULT_DATA_SOURCE_NAME));
            // un-clustered points will be rendered under state/county label
            chart.addLayer(createUnclusterPoints(DEFAULT_DATA_SOURCE_NAME), "state-label");
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
        const { geoData } = this.props;

        if (this.chart.getLayer(DEFAULT_LAYER_NAME)) {
            this.chart.removeLayer(DEFAULT_LAYER_NAME);
        }

        if (isClusteringAllowed(geoData)) {
            if (this.chart.getLayer(DEFAULT_CLUSTER_LAYER_NAME)) {
                this.chart.removeLayer(DEFAULT_CLUSTER_LAYER_NAME);
            }
            if (this.chart.getLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id)) {
                this.chart.removeLayer(DEFAULT_CLUSTER_LABELS_CONFIG.id);
            }
        }
        if (this.chart.getSource(DEFAULT_DATA_SOURCE_NAME)) {
            this.chart.removeSource(DEFAULT_DATA_SOURCE_NAME);
        }
    };

    private removeMap = (): void => {
        if (this.chart) {
            this.chart.remove();
        }
    };
}
