// (C) 2019 GoodData Corporation
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Bubble, BubbleHoverTrigger } from "@gooddata/goodstrap";
import ConfigSection from "../configurationControls/ConfigSection";
import CheckboxControl from "../configurationControls/CheckboxControl";
import DataLabelsControl from "../configurationControls/DataLabelsControl";
import {
    SHOW_DELAY_DEFAULT,
    HIDE_DELAY_DEFAULT,
    BUBBLE_ARROW_OFFSET_X,
    BUBBLE_ARROW_OFFSET_Y,
} from "../../constants/bubble";
import BaseChartConfigurationPanel from "./BaseChartConfigurationPanel";

export default class LineChartBasedConfigurationPanel extends BaseChartConfigurationPanel {
    protected renderConfigurationPanel() {
        const { gridEnabled, axes } = this.getControlProperties();

        const { properties, propertiesMeta, pushData } = this.props;
        const controlsDisabled = this.isControlDisabled();

        return (
            <BubbleHoverTrigger showDelay={SHOW_DELAY_DEFAULT} hideDelay={HIDE_DELAY_DEFAULT}>
                <div>
                    {this.renderColorSection()}
                    {this.getBaseChartAxisSection(properties, propertiesMeta, axes)}
                    {this.renderLegendSection()}
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
                            defaultValue={false}
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
}
