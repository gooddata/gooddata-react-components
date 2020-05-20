// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";
import cloneDeep = require("lodash/cloneDeep");
import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisConstruct,
    IBucket,
} from "../../../interfaces/Visualization";

import {
    sanitizeFilters,
    getAllAttributeItems,
    removeAllDerivedMeasures,
    removeAllArithmeticMeasuresFromDerived,
    limitNumberOfMeasuresInBuckets,
    transformMeasureBuckets,
    IMeasureBucketItemsLimit,
} from "../../../utils/bucketHelper";

import * as BucketNames from "../../../../constants/bucketNames";
import { BUCKETS } from "../../../constants/bucket";
import { removeSort } from "../../../utils/sort";
import { setScatterPlotUiConfig } from "../../../utils/uiConfigHelpers/scatterPlotUiConfigHelper";
import { DEFAULT_SCATTERPLOT_UICONFIG } from "../../../constants/uiConfig";
import ScatterPlotConfigurationPanel from "../../configurationPanels/ScatterPlotConfigurationPanel";
import { SCATTERPLOT_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";

const measureBucketItemsLimit: IMeasureBucketItemsLimit[] = [
    {
        localIdentifier: BucketNames.MEASURES,
        itemsLimit: 1,
    },
    {
        localIdentifier: BucketNames.SECONDARY_MEASURES,
        itemsLimit: 1,
    },
];

export const transformBuckets = (buckets: IBucket[]): IBucket[] => {
    const bucketsWithLimitedMeasures = limitNumberOfMeasuresInBuckets(buckets, 2, true);

    const measureBuckets = transformMeasureBuckets(measureBucketItemsLimit, bucketsWithLimitedMeasures);

    const attributeBucket = {
        localIdentifier: BucketNames.ATTRIBUTE,
        items: getAllAttributeItems(buckets).slice(0, 1),
    };

    return [...measureBuckets, attributeBucket];
};

export class PluggableScatterPlot extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);
        this.type = VisualizationTypes.SCATTER;
        this.supportedPropertiesList = SCATTERPLOT_SUPPORTED_PROPERTIES;
        this.initializeProperties(props.visualizationProperties);
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        const clonedReferencePoint = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...clonedReferencePoint,
            uiConfig: cloneDeep(DEFAULT_SCATTERPLOT_UICONFIG),
        };

        newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
        newReferencePoint = removeAllDerivedMeasures(newReferencePoint);

        newReferencePoint[BUCKETS] = transformBuckets(newReferencePoint.buckets);

        newReferencePoint = setScatterPlotUiConfig(newReferencePoint, this.intl, this.type);
        newReferencePoint = configurePercent(newReferencePoint, true);
        newReferencePoint = configureOverTimeComparison(
            newReferencePoint,
            !!this.featureFlags.enableWeekFilters,
        );
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeFilters(newReferencePoint));
    }

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            render(
                <ScatterPlotConfigurationPanel
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
