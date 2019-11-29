// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import isEqual = require("lodash/isEqual");
import noop = require("lodash/noop");
import mapboxgl = require("mapbox-gl");

import { ICommonChartProps } from "./base/BaseChart";
import { BaseVisualization } from "./base/BaseVisualization";
import {
    commonDefaultProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
} from "./base/VisualizationLoadingHOC";
import { createDataSource, IGeoDataSourceFeatures } from "./geoChart/dataSource";

import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { LoadingComponent } from "../simple/LoadingComponent";

// import { IGeoChartConfig } from "../../interfaces/GeoChart";

import InjectedIntlProps = ReactIntl.InjectedIntlProps;

import "../../../styles/css/geoChart.css";

const DEFAULT_LOCATION = {
    LAT: 34,
    LNG: 5,
    ZOOM: 2,
};

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
    InjectedIntlProps;

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

    constructor(props: IGeoChartInnerProps) {
        super(props);

        this.state = {
            isLoading: true,
            lat: DEFAULT_LOCATION.LAT,
            lng: DEFAULT_LOCATION.LNG,
            zoom: DEFAULT_LOCATION.ZOOM,
        };

        // https://docs.mapbox.com/mapbox-gl-js/api/
        // https://docs.mapbox.com/help/tutorials/#web-apps
        // https://github.com/mapbox/mapbox-react-examples
        // https://staging3.intgdc.com/gdc/app/projects/dfnkvzqa683mz1c29ijdkydrsodm8wjw/
        // geoResults/2728863045332106752?displayForm=/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/79486
    }

    // public componentWillUpdate = (nextProps: IGeoChartInnerProps, nextState: IGeoChartState) => {
    // }

    // public componentDidUpdate = (prevProps: IGeoChartInnerProps, _prevState: IGeoChartState) => {
    //     this.updateMap(prevProps);
    // };

    public componentDidMount = () => {
        this.loadMap();
        this.createDataSource();
    };

    // public componentWillUnmount = () => {
    //     this.unloadMap();
    // };

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
        // map.on("load", this.mapLoaded);
        map.on("move", this.mapMoved);
        this.map = map;
    };

    // private updateMap = (prevProps: IGeoChartInnerProps): void => {
    //     let shouldUpdateDataSource = false;
    //     if (this.isNewDataSourceNeeded(prevProps)) {
    //         shouldUpdateDataSource = true;
    //     }
    //     if (shouldUpdateDataSource) {
    //         this.createDataSource();
    //     }
    // };

    // private unloadMap = (): void => {};

    //
    // working with data source
    //

    // private isNewDataSourceNeeded(_prevProps: IGeoChartInnerProps): boolean {
    // // cannot compare dataSource using deep equal as it stores execution promises that almost always differ
    // const dataSourceChanged =
    //     this.props.dataSource.getFingerprint() !== prevProps.dataSource.getFingerprint();

    // const dataSourceInvalidatingPropNames = [
    //     "resultSpec",
    //     "getPage",
    //     // drillable items need fresh execution because drillable context for row attribute is kept in rowData
    //     // It could be refactored to assign drillability without execution,
    //     // but it would suffer a significant performance hit
    //     "drillableItems",
    // ];

    // const dataSourceInvalidatingPropChanged = dataSourceInvalidatingPropNames.some(
    //     propKey => !isEqual(this.props[propKey], prevProps[propKey]),
    // );

    // return dataSourceChanged || dataSourceInvalidatingPropChanged;

    //     return false;
    // }

    private createDataSource = (): void => {
        createDataSource(this.props.resultSpec, this.props.getPage).then(this.dataSourceCreated);
    };

    private dataSourceCreated = (dataSource: IGeoDataSourceFeatures): void => {
        if (!isEqual(dataSource, this.mapDataSource)) {
            this.mapDataSource = dataSource;

            const DATA_SOURCE_NAME = "countries";
            const MAP_LAYER_NAME = "mycircle";

            this.setDataSource(DATA_SOURCE_NAME, dataSource);

            this.map.addLayer({
                id: MAP_LAYER_NAME,
                type: "circle",
                source: DATA_SOURCE_NAME,
                paint: this.getMarkerOptions(),
            });

            this.setState({ isLoading: false });
        }
    };

    private setDataSource = (dataSourceName: string, dataSource: IGeoDataSourceFeatures) => {
        const source: mapboxgl.GeoJSONSourceRaw = {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: dataSource,
            },
        };
        this.map.addSource(dataSourceName, source);
    };

    //
    // event handlers
    //

    // private mapLoaded = () => {

    // };

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
        return {
            "circle-color": [
                "step",
                ["get", "value"],
                "#000000",
                10,
                "#fbb03b",
                50,
                "#223b53",
                150,
                "#e26a6a",
                250,
                "#aa8f00",
                350,
                "#3498db",
                450,
                "#3477db",
                650,
                "#2277db",
                700,
                "#bb77db",
                750,
                "#0077db",
                800,
                "#3aa7db",
            ],
            "circle-radius": {
                property: "value",
                stops: [[10, 8], [50, 9], [100, 12], [500, 16], [800, 25]],
            },
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.75,
        };
    };
}

export const GeoChart = visualizationLoadingHOC(GeoChartInner, false);
