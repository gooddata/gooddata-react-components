// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";

import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import set = require("lodash/set");

import * as bucketNames from "../../../../constants/bucketNames";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisConstruct,
    IVisualizationProperties,
} from "../../../interfaces/Visualization";
import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { BUCKETS, METRIC, ATTRIBUTE, GEO_ATTRIBUTE } from "../../../constants/bucket";
import { GEO_PUSHPIN_CHART_UICONFIG } from "../../../constants/uiConfig";
import { sanitizeFilters, getBucketItemsByType, getPreferredBucketItems } from "../../../utils/bucketHelper";
import { setGeoPushPinUiConfig } from "../../../utils/uiConfigHelpers/geoPushpinChartUiConfigHelper";
import { removeSort } from "../../../utils/sort";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";

import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";

export class PluggableGeoPushpinChart extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.PUSHPIN;
        this.supportedPropertiesList = [];
        this.initializeProperties(props.visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(GEO_PUSHPIN_CHART_UICONFIG),
        };

        const buckets = get(clonedReferencePoint, BUCKETS, []);
        const locations = getBucketItemsByType(buckets, bucketNames.LOCATION, [GEO_ATTRIBUTE]);
        const measuresSize = getBucketItemsByType(buckets, bucketNames.SIZE, [METRIC]);
        const measuresColor = getBucketItemsByType(buckets, bucketNames.COLOR, [METRIC]);
        const segments = getPreferredBucketItems(
            buckets,
            [bucketNames.STACK, bucketNames.SEGMENT_BY],
            [GEO_ATTRIBUTE, ATTRIBUTE],
        );

        set(newReferencePoint, BUCKETS, [
            {
                localIdentifier: bucketNames.LOCATION,
                items: locations,
            },
            {
                localIdentifier: bucketNames.SIZE,
                items: measuresSize,
            },
            {
                localIdentifier: bucketNames.COLOR,
                items: measuresColor,
            },
            {
                localIdentifier: bucketNames.SEGMENT_BY,
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
}
