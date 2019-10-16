// (C) 2019 GoodData Corporation
import * as React from "react";
import * as classNames from "classnames";
import { FormattedMessage } from "react-intl";
import get = require("lodash/get");
import includes = require("lodash/includes");
import Bubble from "@gooddata/goodstrap/lib/Bubble/Bubble";
import BubbleHoverTrigger from "@gooddata/goodstrap/lib/Bubble/BubbleHoverTrigger";

import * as BucketNames from "../../../constants/bucketNames";
import MinMaxControl from "../configurationControls//MinMaxControl";
import ConfigurationPanelContent from "./ConfigurationPanelContent";
import ConfigSection from "../configurationControls/ConfigSection";
import CheckboxControl from "../configurationControls/CheckboxControl";
import DataLabelsControl from "../configurationControls/DataLabelsControl";
import LabelSubsection from "../configurationControls/axis/LabelSubsection";
import NameSubsection from "../configurationControls/axis/NameSubsection";
import {
    SHOW_DELAY_DEFAULT,
    HIDE_DELAY_DEFAULT,
    BUBBLE_ARROW_OFFSET_X,
    BUBBLE_ARROW_OFFSET_Y,
} from "../../constants/bubble";
import { IAxisProperties } from "../../interfaces/AxisType";
import { AXIS, BASE_CHART_AXIS_CONFIG, DUAL_AXES_SUPPORTED_CHARTS } from "../../constants/axis";
import { countItemsOnAxes } from "../../utils/mdObjectHelper";

export default class BaseChartConfigurationPanel extends ConfigurationPanelContent {
    protected renderCanvasSection() {
        const { gridEnabled } = this.getControlProperties();

        const { properties, propertiesMeta, pushData } = this.props;
        const controlsDisabled = this.isControlDisabled();
        return (
            <ConfigSection
                id="canvas_section"
                title="properties.canvas.title"
                propertiesMeta={propertiesMeta}
                properties={properties}
                pushData={pushData}
            >
                <DataLabelsControl
                    pushData={pushData}
                    properties={properties}
                    isDisabled={controlsDisabled}
                />
                <CheckboxControl
                    valuePath="grid.enabled"
                    labelText="properties.canvas.gridline"
                    properties={properties}
                    checked={gridEnabled}
                    disabled={controlsDisabled}
                    pushData={pushData}
                />
            </ConfigSection>
        );
    }

    protected renderConfigurationPanel() {
        const { axes } = this.getControlProperties();

        return (
            <BubbleHoverTrigger showDelay={SHOW_DELAY_DEFAULT} hideDelay={HIDE_DELAY_DEFAULT}>
                <div>
                    {this.renderColorSection()}
                    {this.getBaseChartAxisSection(axes)}
                    {this.renderLegendSection()}
                    {this.renderCanvasSection()}
                </div>
                <Bubble
                    className={this.getBubbleClassNames()}
                    arrowOffsets={{ "tc bc": [BUBBLE_ARROW_OFFSET_X, BUBBLE_ARROW_OFFSET_Y] }}
                    alignPoints={[{ align: "tc bc" }]}
                >
                    <FormattedMessage id="properties.config.not_applicable" />
                </Bubble>
            </BubbleHoverTrigger>
        );
    }

    protected getAxesConfiguration(type: string): any[] {
        return BASE_CHART_AXIS_CONFIG[type];
    }

    protected getControlProperties() {
        const props = this.props;
        const gridEnabled = get(props, "properties.controls.grid.enabled", true);
        const axisType = includes(DUAL_AXES_SUPPORTED_CHARTS, props.type)
            ? get(props, "axis") || AXIS.PRIMARY
            : AXIS.PRIMARY;
        const configurations = this.getAxesConfiguration(axisType);
        const axes: IAxisProperties[] = configurations.map((axis: any) => {
            return {
                ...axis,
                visible: get(props, `properties.controls.${axis.name}.visible`, true),
            };
        });

        return {
            gridEnabled,
            axes,
        };
    }

    protected getBubbleClassNames() {
        return classNames("bubble-primary", {
            invisible: !this.isControlDisabled(),
        });
    }

    protected isViewedBy() {
        const { mdObject } = this.props;
        return (
            mdObject &&
            mdObject.buckets
                .filter(
                    bucket =>
                        [BucketNames.VIEW, BucketNames.TREND].indexOf(get(bucket, "localIdentifier")) >= 0,
                )
                .some(bucket => get(bucket, "items").length > 0)
        );
    }

    protected getBaseChartAxisSection(axes: IAxisProperties[]) {
        const { type, properties, propertiesMeta, pushData, mdObject } = this.props;
        const controls = properties && properties.controls;
        const controlsDisabled = this.isControlDisabled();
        const isViewedBy = this.isViewedBy();
        const itemsOnAxes = countItemsOnAxes(type, controls, mdObject);

        return axes.map((axis: IAxisProperties) => {
            const disabled = controlsDisabled || (!axis.primary && !isViewedBy);
            const hasMoreThanOneItem = itemsOnAxes[axis.name] > 1;
            const { name, title, subtitle, visible } = axis;

            return (
                <ConfigSection
                    key={name}
                    id={`${name}_section`}
                    title={title}
                    subtitle={subtitle}
                    valuePath={`${name}.visible`}
                    canBeToggled={true}
                    toggledOn={visible}
                    toggleDisabled={controlsDisabled}
                    propertiesMeta={propertiesMeta}
                    properties={properties}
                    pushData={pushData}
                >
                    <NameSubsection
                        disabled={disabled || hasMoreThanOneItem}
                        configPanelDisabled={controlsDisabled}
                        axis={axis.name}
                        properties={properties}
                        pushData={pushData}
                    />
                    <LabelSubsection
                        disabled={disabled}
                        configPanelDisabled={controlsDisabled}
                        axis={axis.name}
                        properties={properties}
                        pushData={pushData}
                    />
                    {axis.primary && this.renderMinMax(axis.name)}
                </ConfigSection>
            );
        });
    }

    protected renderMinMax(basePath: string) {
        const { pushData, properties, propertiesMeta } = this.props;
        return (
            <MinMaxControl
                isDisabled={this.isControlDisabled()}
                basePath={basePath}
                pushData={pushData}
                properties={properties}
                propertiesMeta={propertiesMeta}
            />
        );
    }
}
