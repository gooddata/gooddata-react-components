// (C) 2020 GoodData Corporation
import * as React from "react";
import ConfigurationPanelContent from "./ConfigurationPanelContent";
import UnsupportedProperties from "../configurationControls/UnsupportedProperties";

export default class GeoPushpinConfigurationPanel extends ConfigurationPanelContent {
    public componentDidMount() {
        const { properties, references } = this.props;
        this.props.pushData({
            properties,
            references,
            ignoreUndoRedo: true,
        });
    }

    protected isControlDisabled() {
        return true;
    }

    protected renderConfigurationPanel() {
        return <UnsupportedProperties />;
    }
}
