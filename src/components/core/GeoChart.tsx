// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");
import { WrappedComponentProps } from "react-intl";

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";
import {
    commonDefaultProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import { createDataSource, IGeoDataSource, IGeoDataSourceFeatures } from "./geoChart/dataSource";

import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { LoadingComponent } from "../simple/LoadingComponent";

import "../../../styles/css/geoChart.css";

const DEFAULT_LOCATION = {
    LAT: 34,
    LNG: 5,
    ZOOM: 2,
};

const MAP_PIN_COLORS = [
    "#fbb03b",
    "#223b53",
    "#e26a6a",
    "#aa8f00",
    "#3498db",
    "#3477db",
    "#2277db",
    "#bb77db",
    "#0077db",
    "#3aa7db",
];
const MAP_PIN_SIZES = [8, 9, 12, 16, 25];

const MAPBOX_ACCESS_TOKEN =
    "pk.eyJ1IjoiaW1udXR6IiwiYSI6ImNrMHAxY2UxZzBnc2EzZG11YmVhd2dubG0ifQ.bUTN7ceAHq6kVooe3MKgqg";
const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v11";
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export interface IGeoChartProps extends ICommonChartProps, IDataSourceProviderInjectedProps {
    // cancelPagePromises?: () => void;
    config?: {}; // IGeoChartConfig;
}

export interface IGeoChartState {
    isLoading: boolean;
    lat: number;
    lng: number;
    zoom: number;
}

export type IGeoChartInnerProps = IGeoChartProps &
    ILoadingInjectedProps &
    IDataSourceProviderInjectedProps &
    WrappedComponentProps;

/**
 * Geo Chart react component
 */
export class GeoChartInner extends BaseVisualization<IGeoChartInnerProps, IGeoChartState> {
    public static defaultProps: Partial<IGeoChartInnerProps> = {
        ...commonDefaultProps,
        onDataTooLarge: noop,
        config: {},
    };

    private map: mapboxgl.Map;
    private mapContainerRef: HTMLDivElement;
    private mapDataSource: IGeoDataSourceFeatures;
    private colorMax: number;
    private colorMin: number;
    private sizeMax: number;
    private sizeMin: number;

    constructor(props: IGeoChartInnerProps) {
        super(props);

        this.state = {
            isLoading: true,
            lat: DEFAULT_LOCATION.LAT,
            lng: DEFAULT_LOCATION.LNG,
            zoom: DEFAULT_LOCATION.ZOOM,
        };
    }

    public componentDidMount = () => {
        this.loadMap();
        this.createDataSource();
    };

    public renderVisualization = () => {
        const style: React.CSSProperties = {};
        return (
            <div className="gd-geo-component" style={style}>
                <div className="mapContainer" ref={this.setMapContainerRef} />]{this.renderLoadingOverlay()}
            </div>
        );
    };

    private renderLoadingOverlay = (): React.ReactNode => {
        if (this.state.isLoading) {
            return <LoadingComponent />;
        }
        return null;
    };

    //
    // getters / setters / manipulators
    //

    private setMapContainerRef = (container: HTMLDivElement): void => {
        this.mapContainerRef = container;
    };

    private loadMap = (): void => {
        const { lat, lng, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainerRef,
            style: MAPBOX_STYLE,
            center: [lng, lat],
            zoom,
        });
        map.on("move", this.mapMoved);
        this.map = map;
    };

    //
    // working with data source
    //

    private createDataSource = (): void => {
        createDataSource(this.props.resultSpec, this.props.getPage).then(this.dataSourceCreated);
    };

    private dataSourceCreated = (dataSource: IGeoDataSource): void => {
        const { features, colorMax, colorMin, sizeMax, sizeMin } = dataSource;
        if (!isEqual(features, this.mapDataSource)) {
            this.mapDataSource = features;
            this.colorMax = colorMax;
            this.colorMin = colorMin;
            this.sizeMax = sizeMax;
            this.sizeMin = sizeMin;

            const DATA_SOURCE_NAME = "countries";
            const MAP_LAYER_NAME = "mycircle";

            this.setDataSource(DATA_SOURCE_NAME, features);

            this.map.addLayer({
                id: MAP_LAYER_NAME,
                type: "circle",
                source: DATA_SOURCE_NAME,
                paint: this.getMarkerOptions(),
            });

            this.setState({ isLoading: false });
        }
    };

    private setDataSource = (dataSourceName: string, dataSourceFeatures: IGeoDataSourceFeatures) => {
        const source: mapboxgl.GeoJSONSourceRaw = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: dataSourceFeatures,
            },
        };
        this.map.addSource(dataSourceName, source);
    };

    //
    // event handlers
    //

    private mapMoved = () => {
        const { lat, lng } = this.map.getCenter();
        const zoom = this.map.getZoom();
        this.setState({
            lat,
            lng,
            zoom,
        });
    };

    //
    // geo options & styling
    //

    private getMarkerOptions = (): mapboxgl.CirclePaint => {
        const { colorMax, colorMin, sizeMax, sizeMin } = this;

        const colorsCount = MAP_PIN_COLORS.length;
        const colorUnit = (colorMax - colorMin) / colorsCount;

        const colorOptions: any = ["step", ["get", "pushpinValue"], "#000000"];
        for (let index = 0; index < colorsCount; index++) {
            let value = colorMin + colorUnit * index;
            if (value > colorMax) {
                value = colorMax;
            }

            colorOptions.push(value);
            colorOptions.push(MAP_PIN_COLORS[index]);
        }

        const sizesCount = MAP_PIN_SIZES.length;
        const sizeUnit = (sizeMax - sizeMin) / sizesCount;

        const sizeOptions: any = [];
        for (let index = 0; index < sizesCount; index++) {
            let value = sizeMin + sizeUnit * index;
            if (value > sizeMax) {
                value = sizeMax;
            }

            sizeOptions.push([value, MAP_PIN_SIZES[index]]);
        }

        return {
            "circle-color": colorOptions,
            "circle-radius": {
                property: "pushpinValue",
                stops: sizeOptions,
            },
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.75,
        };
    };
}

export const GeoChart = visualizationLoadingHOC(GeoChartInner, false);
