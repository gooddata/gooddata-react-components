// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { VisualizationObject, AFM } from "@gooddata/typings";

import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import set = require("lodash/set");

import * as BucketNames from "../../../../constants/bucketNames";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisConstruct,
    IVisualizationProperties,
    IVisProps,
    IBucketItem,
    IBucket,
} from "../../../interfaces/Visualization";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS, METRIC, ATTRIBUTE } from "../../../constants/bucket";
import { GEO_PUSHPIN_CHART_UICONFIG } from "../../../constants/uiConfig";
import {
    sanitizeFilters,
    getBucketItemsByType,
    getPreferredBucketItems,
    hasBucket,
} from "../../../utils/bucketHelper";
import { setGeoPushpinUiConfig } from "../../../utils/uiConfigHelpers/geoPushpinChartUiConfigHelper";
import { removeSort, createSorts } from "../../../utils/sort";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";

import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";
import { DASHBOARDS_ENVIRONMENT } from "../../../constants/properties";
import { GeoChart } from "../../../../components/core/GeoChart";
import { IGeoConfig } from "../../../../interfaces/GeoChart";

export class PluggableGeoPushpinChart extends PluggableBaseChart {
    private geoPushpinElement: string;

    constructor(props: IVisConstruct) {
        super(props);

        const { callbacks, element, visualizationProperties } = props;
        this.type = VisualizationTypes.PUSHPIN;
        this.supportedPropertiesList = [];
        this.callbacks = callbacks;
        this.geoPushpinElement = element;
        this.initializeProperties(visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(GEO_PUSHPIN_CHART_UICONFIG),
        };

        const buckets = get(clonedReferencePoint, BUCKETS, []);
        const locations = getBucketItemsByType(buckets, BucketNames.LOCATION, [ATTRIBUTE]);
        const measuresSize = this.getMeasureSizeBucketItem(buckets);
        const measuresColor = this.getMeasureColorBucketItem(buckets);
        const segments = getPreferredBucketItems(
            buckets,
            [BucketNames.STACK, BucketNames.SEGMENT_BY],
            [ATTRIBUTE],
        );

        set(newReferencePoint, BUCKETS, [
            {
                localIdentifier: BucketNames.LOCATION,
                items: locations,
            },
            {
                localIdentifier: BucketNames.SIZE,
                items: measuresSize,
            },
            {
                localIdentifier: BucketNames.COLOR,
                items: measuresColor,
            },
            {
                localIdentifier: BucketNames.SEGMENT_BY,
                items: segments,
            },
        ]);

        newReferencePoint = setGeoPushpinUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeFilters(newReferencePoint));
    }

    protected renderConfigurationPanel() {
        const configPanelElement = document.querySelector(this.configPanelElement);
        if (configPanelElement) {
            const properties: IVisualizationProperties = get(this, "visualizationProperties.properties", {});

            render(
                <UnsupportedConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                />,
                configPanelElement,
            );
        }
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

        const fullConfig = this.buildGeoChartConfig(options, mdObject);

        const geoPushpinProps = {
            projectId,
            drillableItems,
            config: fullConfig,
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

    private buildGeoChartConfig(
        options: IVisProps,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ): IGeoConfig {
        const { config } = options;
        const fullConfig = this.buildVisualizationConfig(mdObject, config, null);

        // TODO: Remove hard-coded token here once WA-11019 is resolved in both BE and FE
        return {
            ...fullConfig,
            mapboxAccessToken:
                "pk.eyJ1IjoicGhhbXV5dnUiLCJhIjoiY2s1NmQ0czJvMDF3NTNsb2R2b2djM3V1eiJ9.X0DnlbX8wBZowC2Xjp8OOg",
        };
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

    private getMeasureSizeBucketItem(buckets: IBucket[]): IBucketItem[] {
        if (hasBucket(buckets, BucketNames.MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.MEASURES, [METRIC]).slice(0, 1);
        }

        return getBucketItemsByType(buckets, BucketNames.SIZE, [METRIC]);
    }

    private getMeasureColorBucketItem(buckets: IBucket[]): IBucketItem[] {
        if (hasBucket(buckets, BucketNames.SECONDARY_MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.SECONDARY_MEASURES, [METRIC]).slice(0, 1);
        }

        if (hasBucket(buckets, BucketNames.MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.MEASURES, [METRIC]).slice(1, 2);
        }

        return getBucketItemsByType(buckets, BucketNames.COLOR, [METRIC]);
    }
}
