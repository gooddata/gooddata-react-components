// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";

import get = require("lodash/get");
import { IVisualizationProperties } from "../../interfaces/Visualization";
import ConfigSubsection from "./ConfigSubsection";
import DropdownControl from "./DropdownControl";
import { getTranslatedDropdownItems } from "../../utils/translations";
import { pushpinSizeDropdownItems } from "../../constants/dropdowns";

export interface IPushpinSizeControl {
    disabled: boolean;
    properties: IVisualizationProperties;
    pushData: (data: any) => any;
}

function getPushpinProperty(props: IPushpinSizeControl & WrappedComponentProps) {
    return get(props, "properties.controls.points", {});
}

function PushpinSizeControl(props: IPushpinSizeControl & WrappedComponentProps): React.ReactElement {
    const { minSize = "default", maxSize = "default" } = getPushpinProperty(props);
    const { disabled, properties, pushData, intl } = props;
    return (
        <ConfigSubsection title="properties.points.size.title">
            <DropdownControl
                value={minSize}
                valuePath="points.minSize"
                labelText="properties.points.size.min.title"
                disabled={disabled}
                showDisabledMessage={disabled}
                properties={properties}
                pushData={pushData}
                items={getTranslatedDropdownItems(pushpinSizeDropdownItems, intl)}
            />
            <DropdownControl
                value={maxSize}
                valuePath="points.maxSize"
                labelText="properties.points.size.max.title"
                disabled={disabled}
                showDisabledMessage={disabled}
                properties={properties}
                pushData={pushData}
                items={getTranslatedDropdownItems(pushpinSizeDropdownItems, intl)}
            />
        </ConfigSubsection>
    );
}

export default injectIntl(PushpinSizeControl);
