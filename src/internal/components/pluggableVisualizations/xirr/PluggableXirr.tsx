// (C) 2019 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { VisualizationObject, AFM } from "@gooddata/typings";
import cloneDeep = require("lodash/cloneDeep");

import { IVisProps, IExtendedReferencePoint, IReferencePoint } from "../../../interfaces/Visualization";
import { getXirrUiConfig, getDefaultXirrUiConfig } from "../../../utils/uiConfigHelpers/xirrUiConfigHelper";
import { getReferencePointWithSupportedProperties } from "../../../utils/propertiesHelper";
import { Xirr } from "../../../../components/core/Xirr";
import { setConfigFromFeatureFlags } from "../../../../helpers/featureFlags";
import { removeSort } from "../../../utils/sort";
import { hasGlobalDateFilter } from "../../../utils/bucketRules";
import {
    removeAllArithmeticMeasuresFromDerived,
    removeAllDerivedMeasures,
    sanitizeFilters,
} from "../../../utils/bucketHelper";
import { getXirrBuckets } from "./xirrBucketHelper";
import { generateDimensions } from "../../../../helpers/dimensions";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { PluggableBaseHeadline } from "../baseHeadline/PluggableBaseHeadline";

export class PluggableXirr extends PluggableBaseHeadline {
    public getExtendedReferencePoint = async (
        referencePoint: Readonly<IReferencePoint>,
    ): Promise<IExtendedReferencePoint> => {
        const referencePointCloned = cloneDeep(referencePoint);
        let newReferencePoint: IExtendedReferencePoint = {
            ...referencePointCloned,
            uiConfig: getDefaultXirrUiConfig(),
        };

        if (!hasGlobalDateFilter(referencePoint.filters)) {
            newReferencePoint = removeAllArithmeticMeasuresFromDerived(newReferencePoint);
            newReferencePoint = removeAllDerivedMeasures(newReferencePoint);
        }

        const buckets = getXirrBuckets(referencePoint);
        newReferencePoint.buckets = buckets;

        newReferencePoint.uiConfig = getXirrUiConfig(newReferencePoint, this.intl);

        newReferencePoint = removeSort(newReferencePoint);
        newReferencePoint = getReferencePointWithSupportedProperties(
            newReferencePoint,
            this.supportedPropertiesList,
        );

        return sanitizeFilters(newReferencePoint);
    };

    protected renderVisualization(
        options: IVisProps,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ): void {
        const { dataSource } = options;

        if (dataSource) {
            const { resultSpec, locale, custom, config } = options;
            const { drillableItems } = custom;
            const { afterRender, onError, onLoadingChanged, pushData, onDrill } = this.callbacks;

            const resultSpecWithDimensions: AFM.IResultSpec = {
                ...resultSpec,
                dimensions: this.getDimensions(mdObject),
            };

            render(
                <Xirr
                    projectId={this.projectId}
                    drillableItems={drillableItems}
                    onDrill={onDrill}
                    locale={locale}
                    config={setConfigFromFeatureFlags(config, this.featureFlags)}
                    dataSource={dataSource}
                    resultSpec={resultSpecWithDimensions}
                    afterRender={afterRender}
                    onLoadingChanged={onLoadingChanged}
                    pushData={pushData}
                    onError={onError}
                    ErrorComponent={null}
                    LoadingComponent={null}
                />,
                document.querySelector(this.element),
            );
        }
    }

    private getDimensions(mdObject: VisualizationObject.IVisualizationObjectContent): AFM.IDimension[] {
        return generateDimensions(mdObject, VisualizationTypes.XIRR);
    }
}
