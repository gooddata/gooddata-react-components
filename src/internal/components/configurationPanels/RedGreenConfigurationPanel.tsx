// (C) 2019 GoodData Corporation
import * as React from "react";

import ConfigurationPanelContent from "./ConfigurationPanelContent";
import ConfigSection from "../configurationControls/ConfigSection";
import InputControl from "../configurationControls/InputControl";
import get = require("lodash/get");

export default class RedGreenConfigurationPanel extends ConfigurationPanelContent {
    protected renderConfigurationPanel() {
        const { propertiesMeta, properties, pushData } = this.props;
        const limit = get(this.props, `properties.controls.redgreen.limit`, "");

        return (
            <div>
                <ConfigSection
                    id="red_green_section"
                    title="properties.redgreen.title"
                    propertiesMeta={propertiesMeta}
                    properties={properties}
                    pushData={pushData}
                    canBeToggled={false}
                >
                    <InputControl
                        labelText="properties.redgreen.limit"
                        placeholder="properties.redgreen.limit"
                        type="text"
                        properties={properties}
                        valuePath="redgreen.limit"
                        value={limit}
                        pushData={pushData}
                    />
                </ConfigSection>
            </div>
        );
    }
}
