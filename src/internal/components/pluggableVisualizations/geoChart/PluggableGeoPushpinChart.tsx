// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import get = require("lodash/get");
import set = require("lodash/set");
import isEmpty = require("lodash/isEmpty");
import includes = require("lodash/includes");
import cloneDeep = require("lodash/cloneDeep");
import noop = require("lodash/noop");

import { VisualizationObject, AFM } from "@gooddata/typings";

import * as BucketNames from "../../../../constants/bucketNames";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisConstruct,
    IVisualizationProperties,
    IVisProps,
    IBucketItem,
    IBucket,
    IUiConfig,
    IGdcConfig,
    IVisCallbacks,
} from "../../../interfaces/Visualization";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS, METRIC, ATTRIBUTE } from "../../../constants/bucket";
import { GEO_PUSHPIN_CHART_UICONFIG } from "../../../constants/uiConfig";
import {
    sanitizeFilters,
    getPreferredBucketItems,
    getMeasures,
    removeShowOnSecondaryAxis,
    getAttributeItemsWithoutStacks,
    isDateBucketItem,
} from "../../../utils/bucketHelper";
import { setGeoPushpinUiConfig } from "../../../utils/uiConfigHelpers/geoPushpinChartUiConfigHelper";
import { removeSort, createSorts } from "../../../utils/sort";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { DASHBOARDS_ENVIRONMENT } from "../../../constants/properties";
import { GeoChart } from "../../../../components/core/GeoChart";
import { IGeoConfig, IGeoLngLatObj } from "../../../../interfaces/GeoChart";
import { GEOPUSHPIN_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import GeoPushpinConfigurationPanel from "../../configurationPanels/GeoPushpinConfigurationPanel";
import { IChartConfig } from "../../../..";
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from "../../../../constants/geoChart";

export class PluggableGeoPushpinChart extends PluggableBaseChart {
    private geoPushpinElement: string;

    constructor(props: IVisConstruct) {
        super(props);

        const { callbacks, element, visualizationProperties } = props;
        this.type = VisualizationTypes.PUSHPIN;
        this.supportedPropertiesList = GEOPUSHPIN_SUPPORTED_PROPERTIES;
        this.callbacks = callbacks;
        this.geoPushpinElement = element;
        this.initializeProperties(visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super
            .getExtendedReferencePoint(referencePoint)
            .then((extendedReferencePoint: IExtendedReferencePoint) => {
                let newReferencePoint: IExtendedReferencePoint = setGeoPushpinUiConfig(
                    extendedReferencePoint,
                    this.intl,
                    this.type,
                );
                newReferencePoint = this.updateSupportedProperties(newReferencePoint);
                newReferencePoint = getReferencePointWithSupportedProperties(
                    newReferencePoint,
                    this.supportedPropertiesList,
                );
                newReferencePoint = removeSort(newReferencePoint);
                return Promise.resolve(sanitizeFilters(newReferencePoint));
            });
    }

    public getUiConfig(): IUiConfig {
        return cloneDeep(GEO_PUSHPIN_CHART_UICONFIG);
    }

    protected handlePushData = (data: any) => {
        const pushData = get<IVisCallbacks, "pushData", typeof noop>(this.callbacks, "pushData", noop);
        const controls = get<IVisualizationProperties, "controls", any>(
            this.visualizationProperties,
            "controls",
            {},
        );
        const newControls = get<IVisualizationProperties, "properties.controls", any>(
            data,
            "properties.controls",
            {},
        );

        pushData({
            ...data,
            properties: {
                controls: {
                    ...controls,
                    ...newControls,
                },
            },
            references: this.references,
        });
    };

    protected configureBuckets(extendedReferencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
        const buckets: IBucket[] = get(extendedReferencePoint, BUCKETS, []);
        const allMeasures: IBucketItem[] = getMeasures(buckets);
        const primaryMeasures: IBucketItem[] = getPreferredBucketItems(
            buckets,
            [BucketNames.MEASURES, BucketNames.SIZE],
            [METRIC],
        );
        const secondaryMeasures: IBucketItem[] = getPreferredBucketItems(
            buckets,
            [BucketNames.SECONDARY_MEASURES, BucketNames.COLOR],
            [METRIC],
        );
        const sizeMeasures: IBucketItem[] = (primaryMeasures.length > 0
            ? primaryMeasures
            : allMeasures.filter((measure: IBucketItem): boolean => !includes(secondaryMeasures, measure))
        ).slice(0, this.getPreferedBucketItemLimit(BucketNames.SIZE));

        const colorMeasures: IBucketItem[] = (secondaryMeasures.length > 0
            ? secondaryMeasures
            : allMeasures.filter((measure: IBucketItem): boolean => !includes(sizeMeasures, measure))
        ).slice(0, this.getPreferedBucketItemLimit(BucketNames.COLOR));

        set(extendedReferencePoint, BUCKETS, [
            {
                localIdentifier: BucketNames.LOCATION,
                items: this.getLocationItems(buckets),
            },
            {
                localIdentifier: BucketNames.SIZE,
                items: removeShowOnSecondaryAxis(sizeMeasures),
            },
            {
                localIdentifier: BucketNames.COLOR,
                items: removeShowOnSecondaryAxis(colorMeasures),
            },
            {
                localIdentifier: BucketNames.SEGMENT,
                items: this.getSegmentItems(buckets),
            },
        ]);
        return extendedReferencePoint;
    }

    protected renderConfigurationPanel() {
        const configPanelElement = document.querySelector(this.configPanelElement);
        if (configPanelElement) {
            const properties: IVisualizationProperties = get(this, "visualizationProperties.properties", {});

            render(
                <GeoPushpinConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                />,
                configPanelElement,
            );
        }
    }

    protected buildVisualizationConfig(
        mdObject: VisualizationObject.IVisualizationObjectContent,
        config: IGdcConfig,
        supportedControls: IVisualizationProperties,
    ): IChartConfig {
        const lat: number = get(supportedControls, "center.lat", DEFAULT_LATITUDE);
        const lng: number = get(supportedControls, "center.lng", DEFAULT_LONGITUDE);
        const geoChartConfig = {
            ...config,
            center: [lng, lat],
        };
        return {
            mdObject,
            ...supportedControls,
            ...geoChartConfig,
        };
    }

    protected renderVisualization(
        options: IVisProps,
        visualizationProperties: IVisualizationProperties,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        const { dataSource } = options;
        if (!dataSource) {
            return;
        }

        const { projectId, intl, geoPushpinElement } = this;
        const {
            dimensions: { height },
            custom: { drillableItems },
            locale,
            config,
        } = options;
        const {
            afterRender,
            onDrill,
            onFiredDrillEvent,
            onError,
            onExportReady,
            onLoadingChanged,
        } = this.callbacks;

        // keep height undef for AD; causes indigo-visualizations to pick default 100%
        const resultingHeight = this.environment === DASHBOARDS_ENVIRONMENT ? height : undefined;
        const resultSpec = this.getResultSpec(options, visualizationProperties, mdObject);
        const supportedControls: IVisualizationProperties = get(visualizationProperties, "controls", {});
        const configSupportedControls = !isEmpty(supportedControls) && supportedControls;
        const fullConfig = this.buildVisualizationConfig(mdObject, config, configSupportedControls);

        const geoPushpinProps = {
            projectId,
            drillableItems,
            config: fullConfig as IGeoConfig,
            height: resultingHeight,
            intl,
            locale,
            dataSource,
            resultSpec,
            pushData: this.handlePushData,
            onCenterPositionChanged: this.handleOnCenterPositionChanged,
            onZoomChanged: this.handleOnZoomChanged,
            afterRender,
            onDrill,
            onError,
            onExportReady,
            onLoadingChanged,
            onFiredDrillEvent,
            LoadingComponent: null as any,
            ErrorComponent: null as any,
        };

        render(<GeoChart {...geoPushpinProps} />, document.querySelector(geoPushpinElement));
    }

    private getResultSpec(
        options: IVisProps,
        visualizationProperties: IVisualizationProperties,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ): AFM.IResultSpec {
        const { resultSpec, dataSource } = options;

        const resultSpecWithDimensions: AFM.IResultSpec = {
            ...resultSpec,
            dimensions: this.getDimensions(mdObject),
        };

        const hasSizeMeasure = mdObject.buckets.some(bucket => bucket.localIdentifier === BucketNames.SIZE);

        const allProperties: IVisualizationProperties = get(visualizationProperties, "properties", {});

        // only DESC sort on Size measure to always lay smaller pushpins on top of bigger ones
        const sorts: AFM.SortItem[] = hasSizeMeasure
            ? createSorts(this.type, dataSource.getAfm(), resultSpecWithDimensions, allProperties)
            : [];

        return {
            ...resultSpecWithDimensions,
            sorts,
        };
    }

    private getSegmentItems(buckets: IBucket[]): IBucketItem[] {
        let segments = getPreferredBucketItems(
            buckets,
            [BucketNames.STACK, BucketNames.SEGMENT, BucketNames.COLUMNS],
            [ATTRIBUTE],
        );
        const nonSegmentAttributes = getAttributeItemsWithoutStacks(buckets);
        if (nonSegmentAttributes.length > 1 && isEmpty(segments)) {
            // first attribute is taken, find next available non-date attribute
            const [, ...attributesWithoutFirst] = nonSegmentAttributes;
            const nonDate = attributesWithoutFirst.filter(
                (attribute: IBucketItem) => !isDateBucketItem(attribute),
            );
            segments = nonDate.slice(0, 1);
        }
        return segments.slice(0, this.getPreferedBucketItemLimit(BucketNames.SEGMENT));
    }

    private getLocationItems(buckets: IBucket[]): IBucketItem[] {
        const locationItems: IBucketItem[] = getPreferredBucketItems(
            buckets,
            [BucketNames.ATTRIBUTE, BucketNames.VIEW, BucketNames.LOCATION, BucketNames.TREND],
            [ATTRIBUTE],
        ).filter((bucketItem: IBucketItem): boolean => Boolean(bucketItem.locationDisplayFormUri));

        return locationItems.slice(0, this.getPreferedBucketItemLimit(BucketNames.LOCATION));
    }

    private getPreferedBucketItemLimit(preferredBucket: string): number {
        const { buckets: bucketsUiConfig } = this.getUiConfig();
        return bucketsUiConfig[preferredBucket].itemsLimit;
    }

    private updateSupportedProperties(referencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
        const buckets: IBucket[] = get(referencePoint, BUCKETS, []);
        const locationItem = this.getLocationItems(buckets)[0];
        if (!locationItem) {
            return referencePoint;
        }
        const referencePointConfigured = cloneDeep(referencePoint);
        const { dfUri } = locationItem;
        const visualizationProperties = this.visualizationProperties || {};
        const { controls = {} } = visualizationProperties;
        // For tooltip text, displayFrom uri must be default displayFrom
        set(referencePointConfigured, "properties", {
            controls: {
                ...controls,
                tooltipText: dfUri,
            },
        });
        return referencePointConfigured;
    }

    private handleOnCenterPositionChanged = (center: IGeoLngLatObj): void => {
        this.handlePushData({
            properties: {
                controls: {
                    center,
                },
            },
        });
    };

    private handleOnZoomChanged = (zoom: number): void => {
        this.handlePushData({
            properties: {
                controls: {
                    zoom,
                },
            },
        });
    };
}
