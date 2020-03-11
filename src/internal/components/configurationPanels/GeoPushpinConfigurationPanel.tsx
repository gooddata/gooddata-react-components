// (C) 2020 GoodData Corporation
import React = require("react");
import ConfigurationPanelContent from "./ConfigurationPanelContent";
import UnsupportedProperties from "../configurationControls/UnsupportedProperties";

export default class GeoPushpinConfigurationPanel extends ConfigurationPanelContent {
    public componentDidMount() {
        this.props.pushData({
            references: null,
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
