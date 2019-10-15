// (C) 2019 GoodData Corporation
import * as React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { AbstractPluggableVisualization } from "../AbstractPluggableVisualization";
import {
    IVisConstruct,
    IVisProps,
    IVisualizationProperties,
    IReferencePoint,
    IExtendedReferencePoint,
    IUiConfig,
    IVisCallbacks,
    ILocale,
} from "../../../interfaces/Visualization";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { VisualizationObject, AFM } from "@gooddata/typings";
// import { getSupportedProperties } from "../../../utils/propertiesHelper";
import { VisualizationTypes, BucketNames } from "../../../..";
import { generateDimensions } from "../../../../helpers/dimensions";
import { RedGreen } from "../../../../components/core/RedGreen";
import get = require("lodash/get");
import { measuresBase } from "../../../constants/uiConfig";
import { limitNumberOfMeasuresInBuckets, getAllItemsByType } from "../../../utils/bucketHelper";
import { cloneDeep } from "lodash";
import { METRIC, BUCKETS } from "../../../constants/bucket";
import RedGreenConfigurationPanel from "../../configurationPanels/RedGreenConfigurationPanel";
import { IChartConfig } from "../../../../interfaces/Config";
// import { createInternalIntl } from "../../../utils/internalIntlProvider";
// import { InjectedIntl } from "react-intl";

export class PluggableRedGreen extends AbstractPluggableVisualization {
    protected configPanelElement: string;
    private projectId: string;
    private callbacks: IVisCallbacks;
    // private intl: InjectedIntl;
    private locale: ILocale;
    private visualizationProperties: IVisualizationProperties;
    private element: string;

    constructor(props: IVisConstruct) {
        super();
        this.projectId = props.projectId;
        this.element = props.element;
        this.configPanelElement = props.configPanelElement;
        this.callbacks = props.callbacks;
        this.locale = props.locale ? props.locale : DEFAULT_LOCALE;
        // this.intl = createInternalIntl(this.locale);
    }

    public unmount() {
        unmountComponentAtNode(document.querySelector(this.element));
        if (document.querySelector(this.configPanelElement)) {
            unmountComponentAtNode(document.querySelector(this.configPanelElement));
        }
    }

    public update(
        options: IVisProps,
        visualizationProperties: IVisualizationProperties,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        this.visualizationProperties = visualizationProperties;
        this.renderVisualization(options, mdObject);
        this.renderConfigurationPanel();
    }

    public getExtendedReferencePoint = async (
        referencePoint: Readonly<IReferencePoint>,
    ): Promise<IExtendedReferencePoint> => {
        const uiConfig: IUiConfig = {
            buckets: {
                measures: {
                    ...measuresBase,
                    itemsLimit: 1,
                    isShowInPercentVisible: false,
                    allowsReordering: false,
                },
            },
        };
        const referencePointCloned = cloneDeep(referencePoint);
        const newReferencePoint: IExtendedReferencePoint = {
            ...referencePointCloned,
            uiConfig,
        };

        const limitedBuckets = limitNumberOfMeasuresInBuckets(newReferencePoint.buckets, 2, true);
        const allMeasures = getAllItemsByType(limitedBuckets, [METRIC]);
        const measure = allMeasures.length > 0 ? allMeasures[0] : null;

        newReferencePoint[BUCKETS] = [
            {
                localIdentifier: BucketNames.MEASURES,
                items: measure ? [measure] : [],
            },
        ];

        return newReferencePoint;
    };

    protected renderVisualization(
        options: IVisProps,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        const { dataSource } = options;

        if (dataSource) {
            const { resultSpec, locale, custom } = options;

            const config: IChartConfig = {
                redGreenLimit: get(this.visualizationProperties, "properties.controls.redgreen.limit", ""),
            };

            const { drillableItems } = custom;
            const { afterRender, onError, onLoadingChanged, pushData } = this.callbacks;

            const resultSpecWithDimensions: AFM.IResultSpec = {
                ...resultSpec,
                dimensions: this.getDimensions(mdObject),
            };

            render(
                <RedGreen
                    projectId={this.projectId}
                    drillableItems={drillableItems}
                    locale={locale}
                    config={config}
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

    protected renderConfigurationPanel() {
        if (document.querySelector(this.configPanelElement)) {
            const properties: IVisualizationProperties = get(
                this.visualizationProperties,
                "properties",
                {},
            ) as IVisualizationProperties;

            render(
                <RedGreenConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                    propertiesMeta={{ red_green_section: { collapsed: false } }}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }

    protected getDimensions(mdObject: VisualizationObject.IVisualizationObjectContent): AFM.IDimension[] {
        return generateDimensions(mdObject, VisualizationTypes.HEADLINE);
    }
}
