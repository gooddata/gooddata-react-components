// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import ConfigSubsection from "../../configurationControls/ConfigSubsection";
import NamePositionControl from "./NamePositionControl";
import { IConfigItemSubsection } from "../../../interfaces/ConfigurationPanel";
import { IVisualizationPropertiesControls } from "../../../interfaces/Visualization";

class NameSubsection extends React.PureComponent<IConfigItemSubsection & WrappedComponentProps, {}> {
    public render() {
        const { axisVisible, axisNameVisible } = this.getControlProperties();
        const { axis, properties, pushData, disabled, configPanelDisabled } = this.props;

        return (
            <ConfigSubsection
                title="properties.axis.name"
                valuePath={`${axis}.name.visible`}
                properties={properties}
                pushData={pushData}
                canBeToggled={true}
                toggledOn={axisNameVisible}
                toggleDisabled={disabled || !axisVisible}
                showDisabledMessage={!configPanelDisabled && disabled}
            >
                <NamePositionControl
                    disabled={disabled}
                    configPanelDisabled={configPanelDisabled}
                    axis={axis}
                    properties={properties}
                    pushData={pushData}
                />
            </ConfigSubsection>
        );
    }

    private getControlProperties(): IVisualizationPropertiesControls {
        const controlsAxis: IVisualizationPropertiesControls = get(
            this.props,
            `properties.controls.${this.props.axis}`,
            {},
        );
        const axisVisible: boolean = get(controlsAxis, "visible", true);
        const axisNameVisible: boolean = get(controlsAxis, "name.visible", true);

        return {
            axisVisible,
            axisNameVisible,
        };
    }
}

export default injectIntl(NameSubsection);
