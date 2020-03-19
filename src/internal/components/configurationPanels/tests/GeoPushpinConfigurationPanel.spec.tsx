// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { IConfigurationPanelContentProps } from "../ConfigurationPanelContent";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import GeoPushpinConfigurationPanel from "../GeoPushpinConfigurationPanel";
import UnsupportedProperties from "../../configurationControls/UnsupportedProperties";

describe("GeoPushpinConfigurationPanel", () => {
    function createComponent(props: IConfigurationPanelContentProps): ShallowWrapper {
        return shallow<IConfigurationPanelContentProps, null>(<GeoPushpinConfigurationPanel {...props} />);
    }

    const defaultProps: IConfigurationPanelContentProps = {
        featureFlags: {
            enablePushpinGeoChart: true,
        },
        isError: false,
        isLoading: false,
        locale: DEFAULT_LOCALE,
        type: VisualizationTypes.PUSHPIN,
    };

    it("should not support configuration properties", () => {
        const wrapper = createComponent({
            ...defaultProps,
            references: {
                tooltip_text_reference: "/gdc/md/pid/obj/88",
            },
            properties: {
                controls: {
                    tooltipText: "/gdc/md/pid/obj/88",
                },
            },
        });

        const upsupportedComponent = wrapper.find(UnsupportedProperties);
        expect(upsupportedComponent.exists()).toEqual(true);
    });
});
