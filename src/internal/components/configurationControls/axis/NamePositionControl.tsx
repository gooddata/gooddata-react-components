// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import get = require("lodash/get");

import DropdownControl from "../DropdownControl";
import { getTranslatedDropdownItems } from "../../../utils/translations";
import { xAxisPositionDropdownItems, yAxisPositionDropdownItems } from "../../../constants/dropdowns";
import { IConfigItemSubsection } from "../../../interfaces/ConfigurationPanel";
import { IVisualizationPropertiesControls } from "../../../interfaces/Visualization";

class NamePositionControl extends React.PureComponent<IConfigItemSubsection & WrappedComponentProps, {}> {
    public render() {
        const { axisVisible, axisNameVisible, namePosition } = this.getControlProperties();
        const { axis, properties, pushData, disabled, configPanelDisabled, intl } = this.props;

        const isDisabled = disabled || !axisVisible || !axisNameVisible;
        const items = getTranslatedDropdownItems(
            this.isXAxis() ? xAxisPositionDropdownItems : yAxisPositionDropdownItems,
            intl,
        );
        return (
            <DropdownControl
                value={namePosition}
                valuePath={`${axis}.name.position`}
                labelText="properties.axis.name.position"
                disabled={isDisabled}
                showDisabledMessage={!configPanelDisabled && isDisabled}
                properties={properties}
                pushData={pushData}
                items={items}
            />
        );
    }

    private isXAxis(): boolean {
        const { axis } = this.props;
        return axis === "xaxis" || axis === "secondary_xaxis";
    }

    private getControlProperties(): IVisualizationPropertiesControls {
        const { axis } = this.props;
        const controlsAxis = get(this.props, `properties.controls.${axis}`, {});

        const axisVisible = get(controlsAxis, "visible", true);
        const axisNameVisible = get(controlsAxis, "name.visible", true);
        const namePosition = get(controlsAxis, "name.position", "auto");

        return {
            axisVisible,
            axisNameVisible,
            namePosition,
        };
    }
}

export default injectIntl(NamePositionControl);
