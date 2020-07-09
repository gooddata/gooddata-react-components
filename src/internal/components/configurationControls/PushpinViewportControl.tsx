// (C) 2020 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import { injectIntl, WrappedComponentProps } from "react-intl";

import DropdownControl from "./DropdownControl";
import { IVisualizationPropertiesContent } from "../../interfaces/Visualization";
import { getTranslatedDropdownItems } from "../../utils/translations";
import { pushpinViewportDropdownItems } from "../../constants/dropdowns";
import { IGeoConfigViewport } from "../../../interfaces/GeoChart";

export interface IPushpinViewportControl {
    disabled: boolean;
    properties: IVisualizationPropertiesContent;
    pushData: (data: any) => any;
}

function getPushpinProperty(props: IPushpinViewportControl & WrappedComponentProps): IGeoConfigViewport {
    return get(props, "properties.controls.viewport", { area: "auto" });
}

function PushpinViewportControl(props: IPushpinViewportControl & WrappedComponentProps): React.ReactElement {
    const { area } = getPushpinProperty(props);
    const { disabled, properties, pushData, intl } = props;
    return (
        <div className="s-pushpin-viewport-control">
            <DropdownControl
                value={area}
                valuePath="viewport.area"
                labelText="properties.viewport.area.title"
                disabled={disabled}
                showDisabledMessage={disabled}
                properties={properties}
                pushData={pushData}
                items={getTranslatedDropdownItems(pushpinViewportDropdownItems, intl)}
            />
        </div>
    );
}

export default injectIntl(PushpinViewportControl);
