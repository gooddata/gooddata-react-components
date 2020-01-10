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
import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS, METRIC, ATTRIBUTE, GEO_ATTRIBUTE } from "../../../constants/bucket";
import { GEO_PUSHPIN_CHART_UICONFIG } from "../../../constants/uiConfig";
import {
    sanitizeFilters,
    getBucketItemsByType,
    getPreferredBucketItems,
    hasBucket,
} from "../../../utils/bucketHelper";
import { setGeoPushPinUiConfig } from "../../../utils/uiConfigHelpers/geoPushpinChartUiConfigHelper";
import { removeSort, createSorts } from "../../../utils/sort";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";

import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";
import { DASHBOARDS_ENVIRONMENT } from "../../../constants/properties";
import { canSortStackTotalValue } from "../../../utils/mdObjectHelper";
import { GeoChart } from "../../../../components/core/GeoChart";

export class PluggableGeoPushpinChart extends PluggableBaseChart {
    private geoPushpinElement: string;

    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.PUSHPIN;
        this.supportedPropertiesList = [];
        this.callbacks = props.callbacks;
        this.geoPushpinElement = props.element;
        this.initializeProperties(props.visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(GEO_PUSHPIN_CHART_UICONFIG),
        };

        const buckets = get(clonedReferencePoint, BUCKETS, []);
        const locations = getBucketItemsByType(buckets, BucketNames.LOCATION, [GEO_ATTRIBUTE]);
        const measuresSize = this.getMeasuresSizeBucketItem(buckets);
        const measuresColor = this.getMeasuresColorBucketItem(buckets);
        const segments = getPreferredBucketItems(
            buckets,
            [BucketNames.STACK, BucketNames.SEGMENT_BY],
            [GEO_ATTRIBUTE, ATTRIBUTE],
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

        newReferencePoint = setGeoPushPinUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = configurePercent(newReferencePoint, false);
        newReferencePoint = configureOverTimeComparison(newReferencePoint);
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
            const properties: IVisualizationProperties = get(
                this.visualizationProperties,
                "properties",
                {},
            ) as IVisualizationProperties;

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
        if (dataSource) {
            const { dimensions, custom, locale, config } = options;
            const { height } = dimensions;
            const { drillableItems } = custom;
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
            const allProperties: IVisualizationProperties = get(
                visualizationProperties,
                "properties",
                {},
            ) as IVisualizationProperties;
            const resultSpecWithDimensions: AFM.IResultSpec = {
                ...options.resultSpec,
                dimensions: this.getDimensions(mdObject),
            };
            const enableSortingByTotalGroup = this.featureFlags.enableSortingByTotalGroup as boolean;
            const sorts: AFM.SortItem[] = createSorts(
                this.type,
                dataSource.getAfm(),
                resultSpecWithDimensions,
                allProperties,
                canSortStackTotalValue(mdObject, null, enableSortingByTotalGroup),
                enableSortingByTotalGroup,
            );
            const resultSpecWithSorts = {
                ...resultSpecWithDimensions,
                sorts,
            };
            const fullConfig = this.buildVisualizationConfig(mdObject, config, null);
            const geoPushpinProps = {
                projectId: this.projectId,
                drillableItems,
                onDrill,
                onFiredDrillEvent,
                config: fullConfig,
                height: resultingHeight,
                locale,
                dataSource,
                resultSpec: resultSpecWithSorts,
                afterRender,
                onLoadingChanged,
                pushData: this.handlePushData,
                onError,
                onExportReady,
                LoadingComponent: null as any,
                ErrorComponent: null as any,
                intl: this.intl,
            };

            render(<GeoChart {...geoPushpinProps} />, document.querySelector(this.geoPushpinElement));
        }
    }

    private getMeasuresSizeBucketItem(buckets: IBucket[]): IBucketItem[] {
        if (hasBucket(buckets, BucketNames.MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.MEASURES, [METRIC]).slice(0, 1);
        }

        return getBucketItemsByType(buckets, BucketNames.SIZE, [METRIC]);
    }

    private getMeasuresColorBucketItem(buckets: IBucket[]): IBucketItem[] {
        if (hasBucket(buckets, BucketNames.SECONDARY_MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.SECONDARY_MEASURES, [METRIC]).slice(0, 1);
        }

        if (hasBucket(buckets, BucketNames.MEASURES)) {
            return getBucketItemsByType(buckets, BucketNames.MEASURES, [METRIC]).slice(1, 2);
        }

        return getBucketItemsByType(buckets, BucketNames.COLOR, [METRIC]);
    }
}
