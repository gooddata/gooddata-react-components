// (C) 2019 GoodData Corporation
import * as React from "react";
import { render } from "react-dom";

import get = require("lodash/get");

import {
    IVisConstruct,
    IReferencePoint,
    IExtendedReferencePoint,
    IVisualizationProperties,
} from "../../../interfaces/Visualization";

import { PluggableBaseChart } from "../baseChart/PluggableBaseChart";
import { setPyramidChartUiConfig } from "../../../utils/uiConfigHelpers/pyramidChartUiConfigHelper";
import UnsupportConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";

import { VisualizationTypes } from "../../../../constants/visualizationTypes";

export class PluggablePyramidChart extends PluggableBaseChart {
    constructor(props: IVisConstruct) {
        super(props);

        this.type = VisualizationTypes.PYRAMID;
    }

    public getExtendedReferencePoint(referencePoint: IReferencePoint): Promise<IExtendedReferencePoint> {
        return super.getExtendedReferencePoint(referencePoint).then(setPyramidChartUiConfig);
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
                <UnsupportConfigurationPanel
                    intl={this.intl}
                    pushData={this.callbacks.pushData}
                    properties={properties}
                />,
                configPanelElement,
            );
        }
    }
}
