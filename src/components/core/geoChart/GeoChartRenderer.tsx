// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");
import {
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
    DEFAULT_MAPBOX_STYLE,
    DEFAULT_ZOOM,
    MAPBOX_ACCESS_TOKEN,
} from "../../../constants/geoChart";
import { IGeoConfig } from "../../../interfaces/GeoChart";

import "../../../../styles/scss/geoChart.scss";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface IChartProps {
    config: IGeoConfig;
    mapLoaded(): void;
}

export default class GeoChartRenderer extends React.Component<IChartProps> {
    public static defaultProps: Partial<IChartProps> = {
        config: {},
        mapLoaded: noop,
    };

    private chart: mapboxgl.Map;
    private chartRef: HTMLElement;

    public componentDidMount() {
        this.createChart();
    }

    public shouldComponentUpdate(nextProps: IChartProps) {
        if (isEqual(this.props.config, nextProps.config)) {
            return false;
        }

        return true;
    }

    public componentDidUpdate() {
        this.createChart();
    }

    public componentWillUnmount() {
        this.chart.remove();
    }

    public setChartRef = (ref: HTMLElement) => {
        this.chartRef = ref;
    };

    public getChartRef = (): HTMLElement => {
        return this.chartRef;
    };

    public getChart = (): mapboxgl.Map => {
        if (!this.chart) {
            throw new Error("getChart() should not be called before the component is mounted");
        }

        return this.chart;
    };

    public createChart = () => {
        const { config } = this.props;
        const center = get(config, "center", [DEFAULT_LONGITUDE, DEFAULT_LATITUDE] as [number, number]);
        const zoom = get(config, "zoom", DEFAULT_ZOOM);

        this.chart = new mapboxgl.Map({
            container: this.chartRef,
            style: DEFAULT_MAPBOX_STYLE,
            center,
            zoom,
        });
        this.handleMapEvent();
    };

    public render() {
        return <div ref={this.setChartRef} />;
    }

    private handleMapEvent = () => {
        const {
            props: { mapLoaded },
            chart,
        } = this;
        chart.on("load", mapLoaded);
    };
}
