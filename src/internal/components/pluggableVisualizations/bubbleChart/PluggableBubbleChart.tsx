// (C) 2019 GoodData Corporation
import React from "react";
import { render } from "react-dom";
import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";
import cloneDeep from "lodash/cloneDeep";
import includes from "lodash/includes";
import set from "lodash/set";
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { IReferencePoint, IExtendedReferencePoint, IVisConstruct } from "../../../interfaces/Visualization";

import {
    sanitizeUnusedFilters,
    getMeasures,
    getPreferredBucketItems,
    getAllAttributeItems,
    removeAllDerivedMeasures,
    removeAllArithmeticMeasuresFromDerived,
    limitNumberOfMeasuresInBuckets,
} from "../../../utils/bucketHelper";

import * as BucketNames from "../../../../constants/bucketNames";
import { METRIC, BUCKETS } from "../../../constants/bucket";
import { removeSort } from "../../../utils/sort";
import { setBubbleChartUiConfig } from "../../../utils/uiConfigHelpers/bubbleChartUiConfigHelper";
import { DEFAULT_BUBBLE_CHART_CONFIG } from "../../../constants/uiConfig";
import { BUBBLE_CHART_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import BubbleChartConfigurationPanel from "../../configurationPanels/BubbleChartConfigurationPanel";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";

export class PluggableBubbleChart extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.BUBBLE;
        this.supportedPropertiesList = BUBBLE_CHART_SUPPORTED_PROPERTIES;
        this.initializeProperties(props.visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(DEFAULT_BUBBLE_CHART_CONFIG),
        };
        newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
        newReferencePoint = removeAllDerivedMeasures(newReferencePoint);

        const buckets = limitNumberOfMeasuresInBuckets(clonedReferencePoint.buckets, 3);
        // limit number of measures in the ref point here?

        // Check if there are three measure buckets
        const measuresBucketItems = getPreferredBucketItems(buckets, [BucketNames.MEASURES], [METRIC]);
        const secondaryMeasuresBucketItems = getPreferredBucketItems(
            buckets,
            [BucketNames.SECONDARY_MEASURES],
            [METRIC],
        );
        const tertiaryMeasuresBucketItems = getPreferredBucketItems(
            buckets,
            [BucketNames.TERTIARY_MEASURES],
            [METRIC],
        );
        const allMeasures = getMeasures(buckets);

        // skip first to reserve first items to be picked later
        const secondaryAndTertiaryItems = [
            ...secondaryMeasuresBucketItems.slice(0, 1),
            ...tertiaryMeasuresBucketItems.slice(0, 1),
        ];

        const measures =
            measuresBucketItems.length > 0
                ? measuresBucketItems.slice(0, 1)
                : allMeasures.filter(measure => !includes(secondaryAndTertiaryItems, measure)).slice(0, 1);

        const secondaryMeasures =
            secondaryMeasuresBucketItems.length > 0
                ? secondaryMeasuresBucketItems.slice(0, 1)
                : allMeasures
                      .filter(
                          measure =>
                              !includes([...measures, ...tertiaryMeasuresBucketItems.slice(0, 1)], measure),
                      )
                      .slice(0, 1);

        const tertiaryMeasures =
            tertiaryMeasuresBucketItems.length > 0
                ? tertiaryMeasuresBucketItems.slice(0, 1)
                : allMeasures
                      .filter(measure => !includes([...measures, ...secondaryMeasures], measure))
                      .slice(0, 1);

        set(newReferencePoint, BUCKETS, [
            {
                localIdentifier: BucketNames.MEASURES,
                items: measures,
            },
            {
                localIdentifier: BucketNames.SECONDARY_MEASURES,
                items: secondaryMeasures,
            },
            {
                localIdentifier: BucketNames.TERTIARY_MEASURES,
                items: tertiaryMeasures,
            },
            {
                localIdentifier: BucketNames.VIEW,
                items: getAllAttributeItems(buckets).slice(0, 1),
            },
        ]);

        newReferencePoint = setBubbleChartUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = configurePercent(newReferencePoint, true);
        newReferencePoint = configureOverTimeComparison(newReferencePoint);
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeUnusedFilters(newReferencePoint, clonedReferencePoint));
    }

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <BubbleChartConfigurationPanel
                    locale={this.locale}
                    references={this.references}
                    properties={this.visualizationProperties}
                    propertiesMeta={this.propertiesMeta}
                    mdObject={this.mdObject}
                    colors={this.colors}
                    pushData={this.handlePushData}
                    type={this.type}
                    isError={this.isError}
                    isLoading={this.isLoading}
                    featureFlags={this.featureFlags}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
