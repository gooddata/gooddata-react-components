// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import get = require("lodash/get");
import set = require("lodash/set");
import isEmpty = require("lodash/isEmpty");
import includes = require("lodash/includes");
import cloneDeep = require("lodash/cloneDeep");

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
} from "../../../interfaces/Visualization";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS, METRIC, ATTRIBUTE } from "../../../constants/bucket";
import { GEO_PUSHPIN_CHART_UICONFIG } from "../../../constants/uiConfig";
import {
    getPreferredBucketItems,
    getMeasures,
    removeShowOnSecondaryAxis,
    getAttributeItemsWithoutStacks,
    isDateBucketItem,
    getItemsCount,
    getItemsFromBuckets,
    removeAllArithmeticMeasuresFromDerived,
    removeAllDerivedMeasures,
    limitNumberOfMeasuresInBuckets,
} from "../../../utils/bucketHelper";
import { setGeoPushpinUiConfig } from "../../../utils/uiConfigHelpers/geoPushpinChartUiConfigHelper";
import { createSorts } from "../../../utils/sort";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { DASHBOARDS_ENVIRONMENT } from "../../../constants/properties";
import { GeoChart } from "../../../../components/core/GeoChart";
import { IGeoConfig } from "../../../../interfaces/GeoChart";
import { GEOPUSHPIN_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import GeoPushpinConfigurationPanel from "../../configurationPanels/GeoPushpinConfigurationPanel";
import { IChartConfig } from "../../../..";

const NUMBER_MEASURES_IN_BUCKETS_LIMIT = 2;

export class PluggableGeoPushpinChart extends PluggableBaseChart {
    private geoPushpinElement: string;

    constructor(props: IVisConstruct) {
        super(props);

        const { callbacks, element, visualizationProperties } = props;
        this.type = VisualizationTypes.PUSHPIN;
        this.callbacks = callbacks;
        this.geoPushpinElement = element;
        this.initializeProperties(visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super
            .getExtendedReferencePoint(referencePoint)
            .then((extendedReferencePoint: IExtendedReferencePoint) => {
                const newReferencePoint: IExtendedReferencePoint = setGeoPushpinUiConfig(
                    extendedReferencePoint,
                    this.intl,
                    this.type,
                );
                return this.updateSupportedProperties(newReferencePoint);
            });
    }

    public getUiConfig(): IUiConfig {
        return cloneDeep(GEO_PUSHPIN_CHART_UICONFIG);
    }

    protected getSupportedPropertiesList() {
        return GEOPUSHPIN_SUPPORTED_PROPERTIES;
    }

    protected configureBuckets(extendedReferencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
        const newExtendedReferencePoint: IExtendedReferencePoint = this.sanitizeMeasures(
            extendedReferencePoint,
        );
        const buckets: IBucket[] = limitNumberOfMeasuresInBuckets(
            newExtendedReferencePoint.buckets,
            NUMBER_MEASURES_IN_BUCKETS_LIMIT,
        );
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

        set(newExtendedReferencePoint, BUCKETS, [
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
        return newExtendedReferencePoint;
    }

    protected renderConfigurationPanel() {
        const configPanelElement = document.querySelector(this.configPanelElement);
        if (configPanelElement) {
            render(
                <GeoPushpinConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={this.visualizationProperties}
                    references={this.references}
                    propertiesMeta={this.propertiesMeta}
                    mdObject={this.mdObject}
                    colors={this.colors}
                    type={this.type}
                    isError={this.isError}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
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
        const { center, legend, viewport = {} } = supportedControls;
        const { colorMapping } = super.buildVisualizationConfig(mdObject, config, supportedControls);
        const centerProp = center ? { center } : {};
        const legendProp = legend ? { legend } : {};
        const { isInEditMode, isExportMode } = config;
        const viewportProp = {
            viewport: {
                ...viewport,
                frozen: isInEditMode || isExportMode,
            },
        };
        const geoChartConfig = {
            ...config,
            ...centerProp,
            ...legendProp,
            ...viewportProp,
        };
        return {
            mdObject,
            ...supportedControls,
            ...geoChartConfig,
            colorMapping,
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
        const configSupportedControls = !isEmpty(supportedControls) && cloneDeep(supportedControls);
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

    private sanitizeMeasures(extendedReferencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
        const newExtendedReferencePoint: IExtendedReferencePoint = removeAllArithmeticMeasuresFromDerived(
            extendedReferencePoint,
        );
        return removeAllDerivedMeasures(newExtendedReferencePoint);
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

        const hasSegmentAttribute: boolean = mdObject.buckets.some(
            (bucket: VisualizationObject.IBucket): boolean => bucket.localIdentifier === BucketNames.SEGMENT,
        );

        const allProperties: IVisualizationProperties = get(visualizationProperties, "properties", {});

        // sort items by segmentBy by alphabetical order
        const sorts: AFM.SortItem[] = hasSegmentAttribute
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
            const locationItems = this.getLocationItems(buckets);
            segments = nonSegmentAttributes
                .filter((attribute: IBucketItem): boolean => !includes(locationItems, attribute))
                .filter((attribute: IBucketItem): boolean => !isDateBucketItem(attribute))
                .slice(0, 1);
        }
        return segments.slice(0, this.getPreferedBucketItemLimit(BucketNames.SEGMENT));
    }

    private getLocationItems(buckets: IBucket[]): IBucketItem[] {
        const locationItems: IBucketItem[] = getItemsFromBuckets(
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
        const hasSizeMesure = getItemsCount(buckets, BucketNames.SIZE) > 0;
        const hasColorMesure = getItemsCount(buckets, BucketNames.COLOR) > 0;
        const hasLocationAttribute = getItemsCount(buckets, BucketNames.LOCATION) > 0;
        const hasSegmentAttribute = getItemsCount(buckets, BucketNames.SEGMENT) > 0;
        const groupNearbyPoints =
            hasLocationAttribute && !hasColorMesure && !hasSizeMesure && !hasSegmentAttribute;
        // For tooltip text, displayFrom uri must be default displayFrom
        set(referencePointConfigured, "properties", {
            controls: {
                points: {
                    groupNearbyPoints,
                },
                ...controls,
                tooltipText: dfUri,
            },
        });

        if (this.references) {
            set(referencePointConfigured, "references", this.references);
        }
        return referencePointConfigured;
    }
}
