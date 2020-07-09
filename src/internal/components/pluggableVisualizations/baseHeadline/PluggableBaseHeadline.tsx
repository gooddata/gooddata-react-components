// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";
import { VisualizationObject } from "@gooddata/typings";

import { AbstractPluggableVisualization } from "../AbstractPluggableVisualization";
import { unmountComponentsAtNodes } from "../../../utils/domHelper";
import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";
import {
    ILocale,
    IVisCallbacks,
    IVisualizationPropertiesWrapper,
    IVisualizationProperties,
    IVisProps,
    IFeatureFlags,
    IVisConstruct,
} from "../../../interfaces/Visualization";
import { getSupportedProperties } from "../../../utils/propertiesHelper";
import { createInternalIntl } from "../../../utils/internalIntlProvider";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { IntlShape } from "react-intl";

export abstract class PluggableBaseHeadline extends AbstractPluggableVisualization {
    protected projectId: string;
    protected configPanelElement: string;
    protected element: string;
    protected locale: ILocale;
    protected intl: IntlShape;
    protected callbacks: IVisCallbacks;
    protected featureFlags?: IFeatureFlags;

    constructor(props: IVisConstruct) {
        super();

        this.projectId = props.projectId;
        this.element = props.element;
        this.configPanelElement = props.configPanelElement;
        this.locale = props.locale ? props.locale : DEFAULT_LOCALE;
        this.intl = createInternalIntl(this.locale);
        this.callbacks = props.callbacks;
        this.featureFlags = props.featureFlags;
    }

    public update(
        options: IVisProps,
        visualizationProperties: IVisualizationPropertiesWrapper,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        this.renderVisualization(options, mdObject);
        this.renderConfigurationPanel(visualizationProperties);
    }

    public unmount() {
        unmountComponentsAtNodes([this.element, this.configPanelElement]);
    }

    protected abstract renderVisualization(
        options: IVisProps,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ): void;

    protected renderConfigurationPanel(visualizationProperties: IVisualizationPropertiesWrapper) {
        if (document.querySelector(this.configPanelElement)) {
            const properties: IVisualizationProperties = visualizationProperties
                ? getSupportedProperties(visualizationProperties, this.supportedPropertiesList)
                : {};

            render(
                <UnsupportedConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }
}
