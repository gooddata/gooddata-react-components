// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { AFM, VisualizationObject } from "@gooddata/typings";

import cloneDeep = require("lodash/cloneDeep");

import * as BucketNames from "../../../../constants/bucketNames";
import { METRIC } from "../../../constants/bucket";

import { configurePercent, configureOverTimeComparison } from "../../../utils/bucketConfig";
import {
    IReferencePoint,
    IExtendedReferencePoint,
    IVisProps,
    IBucketItem,
    IBucket,
} from "../../../interfaces/Visualization";
import {
    sanitizeFilters,
    removeAllDerivedMeasures,
    removeAllArithmeticMeasuresFromDerived,
    isDerivedBucketItem,
    hasDerivedBucketItems,
    findDerivedBucketItem,
    getAllItemsByType,
    limitNumberOfMeasuresInBuckets,
} from "../../../utils/bucketHelper";
import { removeSort } from "../../../utils/sort";
import {
    getDefaultHeadlineUiConfig,
    getHeadlineUiConfig,
} from "../../../utils/uiConfigHelpers/headlineUiConfigHelper";
import {
    findComplementaryOverTimeComparisonMeasure,
    findSecondMasterMeasure,
    tryToMapForeignBuckets,
    setHeadlineRefPointBuckets,
} from "./headlineBucketHelper";
import { hasGlobalDateFilter } from "../../../utils/bucketRules";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { Headline } from "../../../../components/core/Headline";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { generateDimensions } from "../../../../helpers/dimensions";
import { setConfigFromFeatureFlags } from "../../../../helpers/featureFlags";
import { PluggableBaseHeadline } from "../baseHeadline/PluggableBaseHeadline";

export class PluggableHeadline extends PluggableBaseHeadline {
    public getExtendedReferencePoint(referencePoint: Readonly<IReferencePoint>) {
        const referencePointCloned = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...referencePointCloned,
            uiConfig: getDefaultHeadlineUiConfig(),
        };

        if (!hasGlobalDateFilter(referencePoint.filters)) {
            newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
            newReferencePoint = removeAllDerivedMeasures(newReferencePoint);
        }

        const mappedReferencePoint = tryToMapForeignBuckets(newReferencePoint);

        if (mappedReferencePoint) {
            newReferencePoint = mappedReferencePoint;
        } else {
            const limitedBuckets = limitNumberOfMeasuresInBuckets(newReferencePoint.buckets, 2, true);
            const allMeasures = getAllItemsByType(limitedBuckets, [METRIC]);
            const primaryMeasure = allMeasures.length > 0 ? allMeasures[0] : null;
            const secondaryMeasure =
                findComplementaryOverTimeComparisonMeasure(primaryMeasure, allMeasures) ||
                findSecondMasterMeasure(allMeasures);

            newReferencePoint = setHeadlineRefPointBuckets(
                newReferencePoint,
                primaryMeasure,
                secondaryMeasure,
            );
        }

        configurePercent(newReferencePoint, true);
        configureOverTimeComparison(newReferencePoint, !!this.featureFlags.enableWeekFilters);

        newReferencePoint.uiConfig = getHeadlineUiConfig(newReferencePoint, this.intl);
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );
        newReferencePoint = removeSort(newReferencePoint);

        return Promise.resolve(sanitizeFilters(newReferencePoint));
    }

    protected renderVisualization(
        options: IVisProps,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        const { dataSource } = options;

        if (dataSource) {
            const { resultSpec, locale, custom, config } = options;
            const { drillableItems } = custom;
            const {
                afterRender,
                onError,
                onLoadingChanged,
                pushData,
                onDrill,
                onFiredDrillEvent,
            } = this.callbacks;

            const resultSpecWithDimensions: AFM.IResultSpec = {
                ...resultSpec,
                dimensions: this.getDimensions(mdObject),
            };

            render(
                <Headline
                    projectId={this.projectId}
                    drillableItems={drillableItems}
                    onDrill={onDrill}
                    onFiredDrillEvent={onFiredDrillEvent}
                    locale={locale}
                    config={setConfigFromFeatureFlags(config, this.featureFlags)}
                    dataSource={dataSource}
                    resultSpec={resultSpecWithDimensions}
                    afterRender={afterRender}
                    onLoadingChanged={onLoadingChanged}
                    pushData={pushData}
                    onError={onError}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />,
                document.querySelector(this.element),
            );
        }
    }

    protected getDimensions(mdObject: VisualizationObject.IVisualizationObjectContent): AFM.IDimension[] {
        return generateDimensions(mdObject, VisualizationTypes.HEADLINE);
    }

    protected mergeDerivedBucketItems(
        referencePoint: IReferencePoint,
        bucket: IBucket,
        newDerivedBucketItems: IBucketItem[],
    ): IBucketItem[] {
        return bucket.items.reduce((resultItems: IBucketItem[], bucketItem: IBucketItem) => {
            const newDerivedBucketItem = findDerivedBucketItem(bucketItem, newDerivedBucketItems);
            const shouldAddItem =
                newDerivedBucketItem &&
                !isDerivedBucketItem(bucketItem) &&
                !hasDerivedBucketItems(bucketItem, referencePoint.buckets);
            const shouldAddAfterMasterItem = bucket.localIdentifier === BucketNames.MEASURES;

            if (shouldAddItem && !shouldAddAfterMasterItem) {
                resultItems.push(newDerivedBucketItem);
            }

            resultItems.push(bucketItem);

            if (shouldAddItem && shouldAddAfterMasterItem) {
                resultItems.push(newDerivedBucketItem);
            }

            return resultItems;
        }, []);
    }
}
