// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import mapboxgl = require("mapbox-gl");
import { Execution } from "@gooddata/typings";
import { createPushpinDataLayer } from "./geoChartDataLayers";
import { createPushpinDataSource } from "./geoChartDataSource";
import {
    DEFAULT_DATA_SOURCE_NAME,
    DEFAULT_LATITUDE,
    DEFAULT_LAYER_NAME,
    DEFAULT_LONGITUDE,
    DEFAULT_MAPBOX_OPTIONS,
    DEFAULT_ZOOM,
    MAPBOX_ACCESS_TOKEN,
    DEFAULT_TOOLTIP_OPTIONS,
} from "../../../constants/geoChart";
import { IGeoConfig } from "../../../interfaces/GeoChart";

import "../../../../styles/scss/geoChart.scss";
import { handlePushpinMouseEnter, handlePushpinMouseLeave } from "./geoChartTooltip";
import { getGeoData } from "../../../helpers/geoChart";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface IGeoChartRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
}

export default class GeoChartRenderer extends React.PureComponent<IGeoChartRendererProps> {
    public static defaultProps: Partial<IGeoChartRendererProps> = {
        config: {},
    };

    private chart: mapboxgl.Map;
    private tooltip: mapboxgl.Popup;
    private chartRef: HTMLElement;

    public componentDidMount() {
        this.createTooltip();
        this.createMap();
        this.createMapControls();
        this.handleMapEvent();
    }

    public componentDidUpdate() {
        this.createMap();
    }

    public componentWillUnmount() {
        this.chart.remove();
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

        const geoData = getGeoData(buckets, executionResponse.dimensions);
        chart.addSource(DEFAULT_DATA_SOURCE_NAME, createPushpinDataSource(executionResult, geoData));
        chart.addLayer(
            createPushpinDataLayer(DEFAULT_DATA_SOURCE_NAME, executionResult, geoData, selectedSegmentItem),
            "waterway-label", // pushpin will be rendered under state/county label
        );
    };

    private createTooltip = () => {
        this.tooltip = new mapboxgl.Popup(DEFAULT_TOOLTIP_OPTIONS);
    };
}
